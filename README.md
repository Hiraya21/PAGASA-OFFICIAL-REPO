# PAGASA Guimba Youth Organization Management Information System (MIS)

A modern, responsive Municipal Youth Information System & Digital Portal for **Pag-asa Youth Association of the Philippines - Guimba Chapter (PAGASA-Guimba)**.

---

## 🚀 Deployment Guide

### Option 1: Deploy to Vercel (Recommended - One Click / Fast)

Vercel provides lightning-fast global CDN hosting for Vite and React apps with automatic SSL and zero configuration:

1. Push or export your code to your **GitHub** repository (`https://github.com/DSZTER/PAGASA-REPO.git`).
2. Go to **[vercel.com](https://vercel.com/)** and sign in with your GitHub account.
3. Click **Add New...** → **Project**.
4. Import your GitHub repository (`PAGASA-REPO`).
5. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (or `vite build`)
   - **Output Directory**: `dist`
6. *(Optional)* If you use Gemini AI features, expand **Environment Variables** and add:
   - `GEMINI_API_KEY`: *(your Gemini API key)*
7. Click **Deploy**.
8. Within ~30 seconds, your site will be live at `https://your-project-name.vercel.app`!

---

### Option 2: Deploy to GitHub Pages

1. Export this repository to GitHub via **Export to GitHub** in the top menu.
2. In your GitHub repository:
   - Go to **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Go to the **Actions** tab in your repository to watch the automated build and deployment.
4. Your site will immediately be live at `https://dszter.github.io/PAGASA-REPO/` with all assets, styles, and scripts loaded correctly.

---

### Option 2: Deploy to Render (Web Service)

Render allows you to host the application for free with automatic SSL and continuous deployment from GitHub:

1. Sign up or log in at **[render.com](https://render.com/)**.
2. Click **New +** → **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repository `pagasa-guimba-youth-mis`.
4. Configure the service settings:
   - **Name**: `pagasa-guimba-mis` (or your preferred name)
   - **Language**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. *(Optional)* Add Environment Variables in the **Environment** section:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API key if using AI features)*
6. Click **Create Web Service**.
7. Render will build the Vite client and Node server bundle and deploy your application to a live public `.onrender.com` URL.

---

### Option 3: Deploy to Render as a Blueprint (Automatic)

Since this repository includes `render.yaml`:
1. In Render, select **New +** → **Blueprint**.
2. Connect your repository. Render will automatically read the build and start commands from `render.yaml` and configure everything for you.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
