# WebsitePortfolioHarry Admin Notes

## What this admin supports

- Password-protected admin login in VPS/server mode.
- Form-based editing for homepage content and project cards.
- Direct editing for any text file under `public/` via the **Public files** tab.
- Optional post-save auto-publish of `public/` content to GitHub Pages.

## Important architecture note

GitHub Pages is static. A password-protected editor that saves changes without opening GitHub needs a backend somewhere.

So the recommended setup is:

- **Public website** stays on `gh-pages`
- **Admin panel** runs in **VPS/server mode**
- Admin saves source files in this repo
- Optional post-save hook syncs `public/` content into `gh-pages`

This works well here because the homepage fetches `/data/site-content-overrides.json` and `/data/projects-overrides.json` at runtime, so content updates do **not** require a full site rebuild.

## Required environment variables

```bash
ENABLE_VPS_MODE=1
ADMIN_PASSWORD_HASH=<sha256 hex of your password>
ADMIN_SESSION_SECRET=<long random secret>
```

To auto-publish GitHub Pages content after each save:

```bash
ADMIN_POST_SAVE_COMMAND=/absolute/path/to/repo/scripts/deploy-gh-pages.sh
# optional overrides
ADMIN_DEPLOY_BRANCH=gh-pages
ADMIN_PAGES_CNAME=ignatiusharry.my.id
```

## Generate password hash

```bash
python3 - <<'PY'
import hashlib
print(hashlib.sha256(b"your-password-here").hexdigest())
PY
```

## Local verification

```bash
ENABLE_VPS_MODE=1 \
ADMIN_PASSWORD_HASH=*** \
ADMIN_SESSION_SECRET=*** \
npm run build && npm run start
```

Then open `/admin`, login with the raw password, edit content, and save.

## GitHub Pages sync flow

`./scripts/deploy-gh-pages.sh` does this:

1. clones or initializes the `gh-pages` branch worktree
2. copies `public/` into the branch root
3. refreshes `.nojekyll`
4. preserves/writes `CNAME`
5. commits and pushes only if public content changed

That means JSON/content updates from the admin become live on GitHub Pages without needing to open GitHub manually.
