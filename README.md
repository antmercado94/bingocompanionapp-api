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
  - [SendGrid](#sendgrid)
  - [Email Template](#email-template)
- [License](#license)

## **Description**

RESTful API served with [Node.js](https://nodejs.org/en/) and powered by [Express](https://expressjs.com/) that provides the back-end functionality to a [React](https://reactjs.org/) web application. You can find that front-end repo along with its own setup instructions [here](https://github.com/antmercado94/bingocompanionapp).

## **Requirements**

[MongoDB](https://www.mongodb.com/) is used as the database for this project and will require its [URI connection string](https://www.mongodb.com/docs/manual/reference/connection-string/) to be set as an [env](#environment-variables) variable. **The server will not start until a database connection is established**.

[SendGrid](https://sendgrid.com/) API is a cloud-based SMTP provider that is used to send email from a specified email host. This requires having an account with SendGrid and obtaining an API key that should be set as an [env](#environment-variables) variable.

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

#### **SendGrid**

- `SENDGRID_API_KEY=YOURAPIKEY`

#### **Email Template**

- `ADMIN_EMAIL=YOUREMAIL`
- `CLIENT_HOST=YOURFRONTENDHOST`
- `HOME_URL=YOURHOMEURL`
- `LOGO_PATH=LOGOURL`

## **License**

Code released under [the MIT license](https://github.com/antmercado94/bingocompanionapp-api/blob/main/LICENSE).
