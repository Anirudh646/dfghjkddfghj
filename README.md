# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Deployment

This application is configured to be deployed to **Firebase App Hosting**.

To deploy your application, you will need to have the Firebase CLI installed. If you don't have it, you can install it with the following command:

```bash
npm install -g firebase-tools
```

Once the Firebase CLI is installed, follow these steps:

1.  **Login to Firebase:**
    ```bash
    firebase login
    ```

2.  **Initialize Firebase in your project (if you haven't already):**
    You can link your local project to a Firebase project. Run the following command and select your Firebase project when prompted.
    ```bash
    firebase use --add
    ```

3.  **Deploy your application:**
    ```bash
    firebase deploy --only hosting
    ```

This command will build your Next.js application and deploy it to Firebase App Hosting. After the deployment is complete, the CLI will provide you with the URL where your application is live.
