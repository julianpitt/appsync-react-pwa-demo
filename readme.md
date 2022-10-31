# AppSync Notifications Demo application

This demo shows how to notify users on webbrowsers using in app notifications with websockets and browser notifications

## Setup

### Project requirements

Before install the application, make sure you have the following installed or available:

- NodeJS v16+
- AWS CDK
- An AWS Account

Once you have all the previous installed, you need to install all the dependencies for the frontend and backend application. You can achieve this by opening a terminal in the root of this directory and running `npm install`

### Generating VAPID keys

To use web browser notifications, you will need to generate public and private keys.

```bash
npx web-push generate-vapid-keys
```

This will generate a public private keypair that your application will use when communicating to a browser push server

```bash

(example output, do not use)
=======================================

Public Key:
BIXSwFZKL_N12QFT0YlFZ-zZT10fI6ZWIztsRR9o4NYl0pSRBKUJs8PXiXu76X92NAstMADeyLRJF4xXvK9Jhk8

Private Key:
mPuJ9fROjs7k-AA-YsD8oBqZchld4fdLNCJpDmmzQYI

=======================================
```

Take the outputs of this command and add it to your environment variables in your terminal

```bash
export VAPID_PUBLIC_KEY=(ENTER VAPID PUBLIC KEY)
export VAPID_PRIVATE_KEY=(ENTER VAPID PRIVATE KEY)
export VAPID_IDENTIFIER=mailto:(ENTER A VALID EMAIL ADDRESS)
```

These keys will be used on the frontend and backend code.
A more secure way would be to add these details to a secret key service like System Manager Parameter Store or AppConfig but for this demo we will just keep it in the env vars

### Installing the application

With your profile and region set in your terminal env vars, you can now run the cdk deploy commands.

```bash
npx cdk bootstrap
npm run deploy
```

### Starting the application

Once the cdk command has finished deploying, you can now start the client application

```bash
npm start
```
