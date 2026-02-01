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
