# Texting

A real-time chat application for one to one chat.

![Texting Screenshot](https://drive.google.com/uc?export=view&id=1ueKpCldKLvzoR3UJV3W_00fXWqjMyjZ_)

## ✨ Features

- Real-Time Messaging 💬
- User Authentication with Google 👤
- Private Chat 🔒
- Push Notifications 🔔
- Search Functionality 🔍
- Responsive Design 📱

## Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
- Redis - [Download & Install Redis](https://redis.io/docs/getting-started/installation/), and make sure it's running on the default port (6379).

## Run Locally

Clone the project

```bash
  git clone https://github.com/ashukumar2001/texting.git
```

Go to the project directory

```bash
  cd texting
```

Install dependencies for frontend

```bash
  // with npm
  cd frontend && npm install

  // with yarn
  cd frontend && yarn
```

Install dependencies for backend

```bash
  // with npm
  cd backend && npm install

  // with yarn
  cd backend && yarn
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### For frontend configuration see - [`frontend/.example.env`](https://github.com/ashukumar2001/texting/blob/main/frontend/.example.env)

`VITE_BACKEND_BASE_URL` - Your backend's base url

`VITE_GOOGLE_CLIENT_ID` - Your Google client ID for Authentication. [see this to setup](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

`VITE_GOOGLE_CLIENT_SECRET` - Google client secret

`VITE_APPLICATION_SERVER_KEY` - Application server key that the push server will use to authenticate your application server. This is your Public Key generated from `webpush.generateVAPIDKeys()` function.

### For backend configuration see - [`backend/.example.env`](https://github.com/ashukumar2001/texting/blob/main/backend/example.env)

`OTP_HASH_SECRET` - This can be a random string that's totally unpredictable, you can [see this to generate one](https://mojitocoder.medium.com/generate-a-random-jwt-secret-22a89e8be00d)

`DATABASE_URL` - MongoDB connection string.

`REDIS_PORT` - Redis port number. By default, the Redis server runs on TCP Port 6379

`REDIS_HOST` - Redis host name. By default it is 127.0.0.1

`JWT_ACCESS_TOKEN_SECRET` - Secret key for generating access token.

`JWT_REFRESH_TOKEN_SECRET` - Secret key for generating refresh token.

`GOOGLE_CLIENT_ID` - Google Client ID

`GOOGLE_CLIENT_SECRET` - Google Cilent Secret

`VAPID_KEY_PUBLIC` - Voluntary Application Server Identification key allow you to send web push campaigns without having to send them through a service like Firebase Cloud Messaging (or FCM). [See this to generate vapid keys](https://github.com/web-push-libs/web-push#usage)

`VAPID_KEY_PRIVATE` - Your private vapid key generated from above step.

`FRONTEND_URL` - Your frontend web app URL.

#### I have used [Twilio](https://www.twilio.com/en-us/messaging) as a SMS service to send OTP to the user. If you want to implement Twilio, then update this configuration in env file or you can leave these env variables blank in development mode. [See this to set-up Twilio Messaging](https://www.twilio.com/docs/sms/tutorials/how-to-send-sms-messages/node)

`SMS_SERVICE_SID`

`SMS_SERVICE_AUTH_TOKEN`

`SMS_SERVICE_SENDER_NUMBER`
