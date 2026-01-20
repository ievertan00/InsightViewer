# Android Migration Plan

This plan transforms your InsightViewer project into an Android app using Capacitor, ensuring full feature parity and connectivity to your live Render backend without affecting your production deployment.

## Phase 1: Backend Security Update (Render)

To allow the Android app (which runs on `http://localhost` internally) to communicate with your backend, you must update the CORS settings.

**Action:** Update `backend/app/main.py`

Modify the `allowed_origins` logic to explicitly include `http://localhost`.

```python
# In backend/app/main.py
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,https://insight-viewer-web.onrender.com"
).split(",")

# Add the Capacitor Android origin
if "http://localhost" not in allowed_origins:
    allowed_origins.append("http://localhost")
```

*Note: Alternatively, you can add `http://localhost` to the `ALLOWED_ORIGINS` environment variable in your Render Dashboard.*

## Phase 2: Frontend "Mobile Mode" Configuration

We will configure Next.js to switch to "static export" mode only when building the mobile app. This keeps your web deployment on Render standard and unchanged.

**Action:** Update `frontend/next.config.ts`

```typescript
import type { NextConfig } from "next";

// Check if we are building for Capacitor (Mobile)
const isMobile = process.env.CAPACITOR_BUILD === 'true';

const nextConfig: NextConfig = {
  // Only use 'export' for mobile builds; keep default for Render
  output: isMobile ? 'export' : undefined,
  
  // Disable image optimization only for mobile (since Node.js is missing there)
  images: {
    unoptimized: isMobile,
  },
  
  // Ensure the app knows it's being served from a local file system in the APK
  assetPrefix: isMobile ? './' : undefined, 
};

export default nextConfig;
```

## Phase 3: The One-Step Build Command

Use this PowerShell command locally to build the Android assets. It sets the necessary environment variables to enable "Mobile Mode" and points the app to your production backend.

**Run in PowerShell (inside `frontend/` directory):**

```powershell
# 1. Build using the Production Render Backend URL
$env:CAPACITOR_BUILD='true'; $env:NEXT_PUBLIC_API_URL='https://insight-viewer-web.onrender.com/api/v1'; npm run build

# 2. Sync the assets to the Android project
npx cap sync
```

*Replace `https://insight-viewer-web.onrender.com/api/v1` with your actual backend URL if different.*

## Phase 4: Verification & Deployment

1.  **Open in Android Studio:**
    Run the following command to open the project in Android Studio (ensure Android Studio is installed):
    ```powershell
    npx cap open android
    ```

2.  **Verify Functionality:**
    *   **Data Fetching:** Ensure lists and reports load (fetching from Render).
    *   **File Upload:** Test the Excel upload feature.
    *   **Charts:** Verify that charts render correctly.

3.  **Build the APK:**
    *   In Android Studio, navigate to **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate the installable app file.
