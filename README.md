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
- This is a minimal demo. The server uses SQLite and stores data in `data/data.db` by default.
- Uploads are stored in `data/uploads` by default.
- For production you must set `JWT_SECRET` environment variable.
- Useful env vars:
  - `PORT` (default `3000`)
  - `DATA_DIR` (default `./data`)
  - `DB_PATH` (optional override)
  - `UPLOAD_DIR` (optional override)
 
Docker
------

Build and run the image:

```bash
docker build -t green-social:latest .
docker run -p 3000:3000 -e NODE_ENV=production -e DATA_DIR=/app/data -e JWT_SECRET=change-me -v "$(pwd)/data:/app/data" green-social:latest
```

Using docker-compose:

```bash
docker-compose up --build
```

Notes
-----
- The app stores SQLite DB in `data/data.db` when you mount `./data` as a volume.
- On Windows PowerShell, use `-v "${PWD}/data:/app/data"` or create the `data` folder first.

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
