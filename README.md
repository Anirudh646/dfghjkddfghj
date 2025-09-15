# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Development

To run the application in your local development environment, follow these steps:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the Next.js application.

3.  **Run the Genkit AI flows (in a separate terminal):**
    For the AI features to work, you need to run the Genkit development server.
    ```bash
    npm run genkit:watch
    ```

## Deployment

This application is configured for deployment to various platforms that support Node.js.

### Firebase App Hosting

This project is pre-configured for **Firebase App Hosting**.

To deploy your application, you will need to have the Firebase CLI installed.
```bash
npm install -g firebase-tools
```

1.  **Login to Firebase:**
    ```bash
    firebase login
    ```

2.  **Link to your Firebase project:**
    ```bash
    firebase use --add
    ```

3.  **Deploy your application:**
    ```bash
    firebase deploy --only hosting
    ```
This command builds and deploys your Next.js application to Firebase App Hosting.

### Other Platforms (Vercel, Netlify, etc.)

To deploy to other platforms, you can generally follow these steps:

1.  Connect your Git repository to the hosting provider.
2.  Configure the build settings:
    - **Build Command:** `npm run build`
    - **Output Directory:** `.next`
3.  Set up environment variables (like `GEMINI_API_KEY`) in the provider's dashboard.

The application will be built and deployed automatically on `git push`.
