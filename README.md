# Green Social

Minimal green-themed social app (posts, reactions, comments, auth).

Prereqs: Node.js 18+ is recommended.

Install and run:

```bash
npm install
npm start
```

App will run on http://localhost:3000

Notes:
<<<<<<< HEAD
- This is a minimal demo. The server uses SQLite and stores data in `data.db`.
- For production change `JWT_SECRET` environment variable.

Render
------

This app should be deployed to Render as a `Web Service`, not a static site.

Recommended settings:

```bash
Build Command: npm install
Start Command: npm start
```

Important:
- Set `Root Directory` to `Green-Social` if your repo root contains this folder.
- Add a persistent disk and mount it at `/var/data`.
- Set `DATA_DIR=/var/data` so SQLite data and uploaded files persist across deploys.
- Set a strong `JWT_SECRET` in Render environment variables.

=======
- This is a minimal demo. The server uses SQLite and stores data in `data/data.db` by default.
- Uploads are stored in `data/uploads` by default.
- For production you must set `JWT_SECRET` environment variable.
- Useful env vars:
  - `PORT` (default `3000`)
  - `DATA_DIR` (default `./data`)
  - `DB_PATH` (optional override)
  - `UPLOAD_DIR` (optional override)
 
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
Docker
------

Build and run the image:

```bash
docker build -t green-social:latest .
<<<<<<< HEAD
docker run -p 3000:3000 -v "$(pwd)/data:/app/data" green-social:latest
=======
docker run -p 3000:3000 -e NODE_ENV=production -e DATA_DIR=/app/data -e JWT_SECRET=change-me -v "$(pwd)/data:/app/data" green-social:latest
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
```

Using docker-compose:

```bash
docker-compose up --build
```

Notes
-----
- The app stores SQLite DB in `data/data.db` when you mount `./data` as a volume.
- On Windows PowerShell, use `-v "${PWD}/data:/app/data"` or create the `data` folder first.
<<<<<<< HEAD
=======

Deploy to the internet (easy option: Render)
--------------------------------------------

This app needs a **Node.js web service** and (recommended) a **persistent disk** because it uses SQLite + uploads.

- Create a new **Web Service** from your GitHub repo.
- **Start command**: `npm start`
- **Environment variables**:
  - `NODE_ENV=production`
  - `JWT_SECRET=<any long random string>`
  - `DATA_DIR=/var/data`
- Add a **Disk** mounted to `/var/data` (so `data.db` and `uploads/` survive restarts).

After deploy your site will be available on your Render URL.
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
