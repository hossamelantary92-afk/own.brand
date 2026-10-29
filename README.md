# Own Brand — Internal Pharmacy Catalog

Arabic RTL, responsive, static web app. Contains 879 operational products sourced from `Own_Brand_Final_Availability_Review_2026-10-30.xlsx` / Working Catalog.

## Deploy to Vercel
1. Upload the four files (`index.html`, `styles.css`, `app.js`, `products.json`) at repository root on GitHub.
2. Import the repository into Vercel. Choose **Other** framework, no build command, output directory `.` (or leave defaults).
3. Deploy. The site is a static frontend; no backend is needed for read-only browsing.

## Local preview
Run `python -m http.server 8000` inside the folder and visit `http://localhost:8000`.
Opening `index.html` via `file://` may block loading JSON.

## Data and security
This version has **no authentication**. It is an internal-use design, but anyone with the deployed URL may access it unless deployment access protection is configured. For actual private staff-only access, add Firebase Auth and protected data/API or a hosting access gate before distributing the URL. Static `products.json` is publicly readable on a public deployment.

Product availability is **not** live and is not implied by inclusion in the catalog. Products excluded in the source workbook (four alternate SKUs and three Stevia products) are not included here. Brand names are provisionally derived from the first word of the English product description.
