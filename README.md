# **Bingo Companion App API**

This project was developed for the purposes of being a part of my web portfolio. **[See it in action here](https://bingocompanionapp.netlify.app/)**.

- [Description](#description)
- [Requirements](#requirements)
- [Installation and setup](#installation-and-setup)
  - [Install](#install)
  - [Run](#run)
- [Environment Variables](#environment-variables)
  - [MongoDB](#mongodb)
  - [Secrets](#secrets)
  - [Google App Password](#google-app-password)
  - [Email Template](#email-template)
- [License](#license)

## **Description**

RESTful API served with [Node.js](https://nodejs.org/en/) and powered by [Express](https://expressjs.com/) that provides the back-end functionality to a [React](https://reactjs.org/) web application. You can find that front-end repo along with its own setup instructions [here](https://github.com/antmercado94/bingocompanionapp).

## **Requirements**

[MongoDB](https://www.mongodb.com/) is used as the database for this project and will require its [URI connection string](https://www.mongodb.com/docs/manual/reference/connection-string/) to be set as an [env](#environment-variables) variable. **The server will not start until a database connection is established**.

[Gmail](https://www.google.com/gmail/about/) auth is used for nodemailer [SMTP transport](https://nodemailer.com/smtp/) config to simply send a password reset link to a specified email. This requires having a Google account with two-factor authorization and obtaining an app password which should be set as an [env](#environment-variables) variable. See this guide [here](https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628) for more details.

## **Installation and setup**

### **Install**

- [Download zip](https://github.com/antmercado94/bingocompanionapp-api/archive/refs/heads/main.zip) or clone: `git clone https://github.com/antmercado94/bingocompanionapp-api.git`
- Install dependencies using npm: `npm install`

### **Run**

Start node server:

```
npm run start
```

Or run [nodemon](https://nodemon.io/) for local development:

```
npm run dev
```

## **Environment Variables**

Several functionalities within this project require the use of environment variables. These variables should be set inside of a [.env file](https://github.com/antmercado94/bingocompanionapp-api/blob/main/.env.example) (local dev) or within a web host's configuration.

#### **MongoDB**

- `MONGO_URL=YOURCONNECTIONSTRING`

#### **Secrets**

- `ACCESS_TOKEN_SECRET=YOURSECRET`
- `RESET_TOKEN_SECRET=YOURSECRET`

#### **Google App Password**

- `ADMIN_APP_PW=YOURPASSWORD`

#### **Email Template**

- `ADMIN_EMAIL=YOUREMAIL`
- `CLIENT_HOST=YOURFRONTENDHOST`
- `HOME_URL=YOURHOMEURL`
- `LOGO_PATH=LOGOURL`

## **License**

Code released under [the MIT license](https://github.com/antmercado94/bingocompanionapp-api/blob/main/LICENSE).
