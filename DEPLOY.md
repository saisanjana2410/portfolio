# Hosting the portfolio

## Render (portfolio and backend together)

1. Push this folder as a GitHub repository.
2. In Render, choose **New → Blueprint** and select the repository. The included `render.yaml` configures a free preview web service. Review the service and plan before creating it.
3. Alternatively choose **New → Web Service**, connect the repository, choose Node, set build to `npm install --omit=dev`, start to `npm start`, and environment `NODE_ENV=production` and `NODE_VERSION=24.16.0`.
4. The site works immediately with prepared first-person portfolio replies.
5. For generative AI, add `OPENAI_API_KEY` in Render's environment settings. Never commit a key. Model is configurable through `OPENAI_MODEL`.
6. Render sets `RENDER_EXTERNAL_URL` automatically for same-origin chat validation. If adding a custom domain, set `APP_ORIGIN` to the exact HTTPS origin, e.g. `https://your-domain.com`, without a trailing slash.

The free preview plan sleeps when idle. For an always-ready portfolio, review Render's paid web-service options. AI API charges are separate from hosting. The blueprint does not add an API key or enable AI billing by itself.

For another Node host, use Node 24, `npm start`, `NODE_ENV=production`, its assigned `PORT`, and `APP_ORIGIN` set to the public HTTPS origin. The server binds to `0.0.0.0` in production.

Before enabling a paid AI model publicly, configure provider usage alerts and deployment-level abuse controls. The app has request/body limits and does not log chat transcripts. Its in-memory rate limit is per process and resets on restart.

Only the selected portrait is included. Internal content-handoff notes, local `.env`, the unused older avatar and removed animation code are excluded from Git.
