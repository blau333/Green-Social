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

Docker
------

Build and run the image:

```bash
docker build -t green-social:latest .
docker run -p 3000:3000 -v "$(pwd)/data:/app/data" green-social:latest
```

Using docker-compose:

```bash
docker-compose up --build
```

Notes
-----
- The app stores SQLite DB in `data/data.db` when you mount `./data` as a volume.
- On Windows PowerShell, use `-v "${PWD}/data:/app/data"` or create the `data` folder first.
