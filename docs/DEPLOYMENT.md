# VPS Deployment Guide

This document provides a step-by-step guide to deploying the Vision Public School (VPS) Management Portal to a production environment using **TiDB Cloud**, **Render**, and **Vercel**.

---

## ☁️ 1. Database: TiDB Cloud (Serverless)

TiDB Cloud provides a MySQL-compatible distributed database that is perfect for scaling.

1.  **Create Account**: Sign up at [tidbcloud.com](https://tidbcloud.com).
2.  **Create Cluster**: Choose **TiDB Serverless**.
3.  **Security Settings**: 
    *   Set up an **IP Access List** (Allow `0.0.0.0/0` for initial setup, then restrict to Render's outbound IPs if needed).
    *   Create a **SQL User** and password.
4.  **Connection String**: Copy the JDBC connection string. It should look like this:
    ```
    jdbc:mysql://[HOST]:4000/vps_db?sslMode=VERIFY_IDENTITY&enabledTLSProtocols=TLSv1.2,TLSv1.3
    ```

---

## 🚀 2. Backend: Render

Render will host the Spring Boot backend with automatic deployments from GitHub.

1.  **New Web Service**: Connect your GitHub repository.
2.  **Runtime**: Select **Docker** (Render will use the included `Dockerfile`).
3.  **Environment Variables**: Add the following under "Advanced":
    | Key | Value |
    | :--- | :--- |
    | `DB_URL` | (Your TiDB JDBC URL) |
    | `DB_USERNAME` | (Your TiDB User) |
    | `DB_PASSWORD` | (Your TiDB Password) |
    | `JWT_SECRET` | (A long random string for security) |
    | `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` (Required for login) |
    | `PORT` | `8080` |
4.  **Deploy**: Render will build the Docker image and deploy. Copy the `.onrender.com` URL.

---

## 🎨 3. Frontend: Vercel

Vercel provides optimized hosting for React/Vite applications.

1.  **Import Project**: Connect GitHub and select the repository.
2.  **Project Settings**:
    *   **Framework**: Vite.
    *   **Root Directory**: `frontend`.
3.  **Environment Variables**: Add the following:
    | Key | Value |
    | :--- | :--- |
    | `VITE_API_URL` | `https://vps-backend.onrender.com` (Your Render URL) |
4.  **Build & Deploy**: Click Deploy. Vercel will provide a `.vercel.app` URL.

---

## 🧪 4. Post-Deployment Verification

1.  **Health Check**: Visit `https://your-backend.onrender.com/api/system/diagnose`. It should return a 401 (meaning the server is alive and protected).
2.  **First Login**: Use the System Admin credentials to verify database connectivity.
3.  **Media Check**: Upload a student photo and verify it displays correctly.

---

## 🔒 Security Best Practices
*   **SSL**: Ensure `sslMode=VERIFY_IDENTITY` is present in your database URL.
*   **Secrets**: Never commit your `application.properties` with real passwords. Use Environment Variables as shown above.
*   **CORS**: The backend is configured to allow requests from your Vercel URL. If you change domains, update `SecurityConfig.java`.

---

*Professional Deployment by Antigravity AI.*
