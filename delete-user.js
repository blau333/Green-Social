const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

(async () => {
  const username = process.argv[2];
  if (!username) {
    console.error('Usage: node delete-user.js <username>');
    process.exit(1);
  }

  const db = await open({
    filename: path.join(__dirname, 'data.db'),
    driver: sqlite3.Database
  });

  try {
    const user = await db.get(
      'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
      username.trim()
    );

    if (!user) {
      console.log(`User '${username}' not found.`);
      await db.close();
      process.exit(0);
    }

    const userId = user.id;
    console.log(`Deleting user '${username}' with id=${userId} and related data...`);

    await db.exec('BEGIN TRANSACTION');

    // Reactions by the user
    await db.run('DELETE FROM reactions WHERE user_id = ?', userId);
    // Reactions on the user's posts
    await db.run(
      'DELETE FROM reactions WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)',
      userId
    );

    // Comments by the user
    await db.run('DELETE FROM comments WHERE user_id = ?', userId);
    // Comments on the user's posts
    await db.run(
      'DELETE FROM comments WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)',
      userId
    );

    // Messages to/from the user
    await db.run(
      'DELETE FROM messages WHERE from_user_id = ? OR to_user_id = ?',
      userId,
      userId
    );

    // Subscriptions involving the user
    await db.run(
      'DELETE FROM subscriptions WHERE subscriber_id = ? OR subscribed_to_id = ?',
      userId,
      userId
    );

    // Notifications involving the user or their posts
    await db.run(
      'DELETE FROM notifications WHERE user_id = ? OR from_user_id = ? OR post_id IN (SELECT id FROM posts WHERE user_id = ?)',
      userId,
      userId,
      userId
    );

    // Posts by the user
    await db.run('DELETE FROM posts WHERE user_id = ?', userId);

    // Finally, the user record
    await db.run('DELETE FROM users WHERE id = ?', userId);

    await db.exec('COMMIT');

    console.log(`User '${username}' and related data deleted successfully.`);
  } catch (err) {
    console.error('Error deleting user:', err);
    try {
      await db.exec('ROLLBACK');
    } catch (rollbackErr) {
      console.error('Error during rollback:', rollbackErr);
    }
    process.exit(1);
  } finally {
    await db.close();
  }
})();

