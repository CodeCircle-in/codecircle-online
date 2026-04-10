# CodeCircle

A student community platform — open source, built for students, by students.

**Tech stack:** React + Vite · Tailwind CSS · Framer Motion · Express · MongoDB · Google OAuth · JWT

**Deploy targets (all free):** Vercel (frontend) · Render (backend) · MongoDB Atlas (database) · Google OAuth (auth)

---

## Project structure

```
codecircle/
├── client/          # React frontend (deploy to Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   └── avatar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── CategoriesSection.jsx
│   │   │   ├── BlogPreview.jsx
│   │   │   ├── HallOfFame.jsx
│   │   │   ├── RecentUploads.jsx
│   │   │   └── Seo.jsx
│   │   │   ├── CommunitiesSection.jsx
│   │   │   ├── JoinSection.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SubmitResource.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── lib/
│   │   │   └── utils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── vercel.json
│   └── package.json
│
└── server/          # Express backend (deploy to Render)
    ├── models/
    │   ├── User.js
    │   ├── Post.js
    │   └── Resource.js
    ├── routes/
    │   ├── auth.js
    │   ├── posts.js
    │   ├── resources.js
    │   └── admin.js
    ├── middleware/
    │   ├── auth.js
    │   └── passport.js
    ├── index.js
    └── package.json
```

---

## Step 1 — MongoDB Atlas (free tier)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and create a free account.
2. Create a new **free** M0 cluster (any region).
3. Under **Database Access**, create a user with read/write permissions. Save the password.
4. Under **Network Access**, add `0.0.0.0/0` to allow all IPs (required for Render).
5. Click **Connect → Drivers** and copy the connection string. Replace `<password>` with your user password.

Your `MONGODB_URI` will look like:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/codecircle?retryWrites=true&w=majority
```

---

## Step 2 — Google OAuth credentials (free)

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a new project (e.g. `codecircle`).
3. Go to **APIs & Services → OAuth consent screen**.
   - Choose **External**, fill in App name (`CodeCircle`), support email, developer email.
   - Add scope: `email`, `profile`.
   - Save and continue.
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**.
   - Application type: **Web application**.
   - Authorized redirect URIs — add both:
     ```
     http://localhost:5000/api/auth/google/callback
     https://your-api.onrender.com/api/auth/google/callback
     ```
   - Save. Copy **Client ID** and **Client Secret**.

---

## Step 3 — Deploy the backend to Render (free)

1. Push the `server/` folder to a GitHub repository (can be a separate repo or monorepo).
2. Go to [render.com](https://render.com) → New → Web Service.
3. Connect your GitHub repo. Set **Root Directory** to `server` if using monorepo.
4. Settings:
   - Environment: **Node**
   - Build command: `npm install`
   - Start command: `npm start`
   - Plan: **Free**
5. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your Atlas connection string |
   | `GOOGLE_CLIENT_ID` | from Google Console |
   | `GOOGLE_CLIENT_SECRET` | from Google Console |
   | `JWT_SECRET` | any long random string (e.g. run `openssl rand -hex 32`) |
   | `CLIENT_URL` | `https://your-app.vercel.app` |
   | `SERVER_URL` | `https://your-api.onrender.com` |
   | `NODE_ENV` | `production` |

6. Deploy. Copy the Render URL (e.g. `https://codecircle-api.onrender.com`).

> Important: set `CLIENT_URL` without a trailing slash. Use `https://your-app.vercel.app`, not `https://your-app.vercel.app/`.

> **Note:** Free Render services spin down after inactivity. First request after idle takes ~30s. Upgrade to Starter ($7/mo) to avoid cold starts.

---

## Step 4 — Deploy the frontend to Vercel (free)

1. Push the `client/` folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Set **Root Directory** to `client` if using monorepo.
4. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-api.onrender.com/api` |
   | `VITE_GITHUB_REPO` | `your-github-username/your-repo-name` |

5. Deploy. Copy the Vercel URL (e.g. `https://codecircle.vercel.app`).

6. Go back to Render and update `CLIENT_URL` to your Vercel URL.
7. Go back to Google Console and ensure your Render callback URL is in the redirect URIs list.

> The frontend also includes a Vercel rewrite for `/api/*`, but you should still set `VITE_API_URL` to your real Render backend URL for clean production configuration.

---

## Step 5 — Local development

**Backend:**
```bash
cd server
npm install
npm run dev   # runs on http://localhost:5000
```

Create `server/.env` with:

```env
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_long_random_jwt_secret
MONGODB_URI=your_mongodb_atlas_connection_string
SERVER_URL=http://localhost:5000
PORT=5000
```

**Frontend:**
```bash
cd client
npm install
npm run dev   # runs on http://localhost:5173
```

Create `client/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GITHUB_REPO=your-github-username/your-repo-name
```

---

## Admin setup

The **first user** who signs in with Google is automatically made admin. After that, you can promote other users via the `/admin` panel under the Users tab.

Admins can:
- Create, edit, delete blog posts (with optional image URL and resource link)
- Create, edit, delete resources per category
- Promote / demote other users

Signed-in users can:
- Open `/dashboard` from the navbar after login
- Upload resources
- Edit or delete their own uploaded resources
- Use `/submit-resource` for a dedicated submission flow

---

## Homepage highlights

- `Recent Uploads` appears directly below the hero section
- `Hall of Fame` shows compact avatar stacks for GitHub contributors and top resource uploaders
- Clicking either Hall of Fame group opens the full people list in a modal

---

## Hall of Fame

The Hall of Fame fetches contributor data from the GitHub API automatically using `VITE_GITHUB_REPO`. It also groups resource uploaders from the backend and ranks them by number of uploads.

What it shows:
- GitHub contributors from `https://api.github.com/repos/<repo>/contributors`
- Resource uploaders based on submitted resources in the app
- Compact avatar previews on the homepage
- Full contributor and uploader lists inside click-to-open modals

---

## Categories

The 8 topic categories are defined in `client/src/components/CategoriesSection.jsx`. Each has its own page at `/category/:slug`. Admins can assign posts and resources to categories from the admin panel.

---

## SEO

The frontend includes a basic SEO setup for production:

- Static meta tags in `client/index.html`
- Per-page titles and descriptions via `client/src/components/Seo.jsx`
- `robots.txt` in `client/public/robots.txt`
- `sitemap.xml` in `client/public/sitemap.xml`

For the best social sharing previews, add a real image at:

```text
https://codecircle.online/og-image.png
```

or update the image URL used in the SEO component.

---

## Customisation checklist

- [ ] Update WhatsApp link in `Hero.jsx`, `About.jsx`, `CommunitiesSection.jsx`, `JoinSection.jsx`, `Footer.jsx`
- [ ] Update Discord link in the same files
- [ ] Update GitHub org URL in `Footer.jsx` and `HallOfFame.jsx`
- [ ] Set `VITE_GITHUB_REPO` to your actual repository
- [ ] Replace placeholder Instagram link in `Footer.jsx`
- [ ] Update `VITE_API_URL` in Vercel environment variables after deploying Render
- [ ] Add a real `og-image.png` for social previews
- [ ] Keep `CLIENT_URL` on Render without a trailing slash

---

## License

MIT — free to use, fork, and contribute.
