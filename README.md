<p align="center">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://github.com/itsdrvgo/hirehaven-mern/blob/master/www/public/logos/hirehaven_light.svg?raw=true">
        <img src="https://github.com/itsdrvgo/hirehaven-mern/blob/master/www/public/logos/hirehaven_light.svg?raw=true" width="200" alt="HireHaven">
    </picture>
</p>

<h1 align="center">
    HireHaven
</h1>

<div align="center">

![Discord](https://img.shields.io/discord/1133372614165934160?label=Discord&labelColor=blue&color=gray&link=https%3A%2F%2Fitsdrvgo.me%2Fsupport)
![GitHub Repo stars](https://img.shields.io/github/stars/itsdrvgo/hirehaven-mern?label=Stars&labelColor=darkgreen&color=white&link=https%3A%2F%2Fgithub.com%2Fitsdrvgo%2Fhirehaven-mern)

</div>

<center>

HireHaven is a cutting-edge job platform designed to
connect innovative startups with talented professionals.
We believe in fostering collaboration and growth,
creating a haven where careers flourish and businesses
thrive.

</center>

<a href="https://github.com/itsdrvgo/hirehaven-mern" target="_blank">
    <p align="center">
        <img src="https://github.com/itsdrvgo/hirehaven-mern/blob/master/www/public/og.webp?raw=true" alt="HireHaven" />
    </p>
</a>

## Previews

Please find some of the screenshots of the project in the [screenshots](screenshots) directory. Some of the previews may be blurred to protect sensitive information.

## Introduction

Hey there, I'm [DRVGO](https://itsdrvgo.me/), a passionate Full Stack Developer, infusing art and technology to create captivating digital experiences. I'm highly skilled in JavaScript, TypeScript, React.js, Next.js, Tailwind CSS, and more. I'm also a self-taught designer, specializing in UI/UX design and branding.

## Technologies / Packages Used

The portfolio website is built with the following technologies:

-   **FRONTEND**

    -   [Next.JS 14 (App Router)](https://nextjs.org/): A powerful framework for building performant and SEO-friendly web applications.
    -   [TypeScript](https://www.typescriptlang.org/): Ensuring robust and type-safe code for enhanced development.
    -   [React.JS](https://react.dev/): Creating dynamic and interactive user interfaces for seamless navigation.
    -   [ShadCN UI](https://ui.shadcn.com/): The best library of manipulate the UI.
    -   [Tailwind CSS](https://tailwindcss.com/): Designing responsive layouts with ease and speed.
    -   [Framer Motion](https://www.framer.com/motion/): Adding delightful animations to user interactions.
    -   [Tanstack Query](https://tanstack.com/query/latest): A powerful and flexible data fetching library for React.
    -   [Axios](https://axios-http.com/): Making HTTP requests to the server for fetching and sending data.
    -   [Zod](https://zod.dev/): A TypeScript-first schema declaration and validation library.
    -   [Mantine Hooks](https://mantine.dev/): A collection of React hooks for building accessible and composable UI components.
    -   [Zustand](https://zustand-demo.pmnd.rs/): A small, fast, and scalable state management library.

-   **BACKEND**

    -   [Node.JS](https://nodejs.org/): A JavaScript runtime for building scalable and fast server-side applications.
    -   [Express.JS](https://expressjs.com/): A minimal and flexible Node.js web application framework.
    -   [TypeScript](https://www.typescriptlang.org/): Ensuring robust and type-safe code for enhanced development.
    -   [MongoDB](https://www.mongodb.com/): A NoSQL database for storing and managing data.
    -   [Mongoose](https://mongoosejs.com/): An Object Data Modeling (ODM) library for MongoDB and Node.js.
    -   [JSON Web Tokens](https://jwt.io/): Securely transmitting information between parties as a JSON object.
    -   [bcrypt](https://www.npmjs.com/package/bcrypt): A password-hashing function for securing user passwords.
    -   [Joi](https://joi.dev/): A schema description language and data validator for JavaScript.
    -   [Multer](https://www.npmjs.com/package/multer): A middleware for handling multipart/form-data, primarily used for uploading files.
    -   [Nodemailer](https://nodemailer.com/): A module for sending emails from Node.js applications.
    -   [Express Rate Limit](https://www.npmjs.com/package/express-rate-limit): A rate-limiting middleware for Express applications.

## How to Use

This project is divided into two main parts: the frontend and the backend. The frontend is built with Next.js and Tailwind CSS, while the backend is built with Node.js and Express.js. The frontend and backend are connected to a MongoDB database for storing and managing data. You can follow the steps below to run the project on your local machine.

### Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have installed the latest version of Node.js and npm.
-   You have installed MongoDB Compass or any other MongoDB client, and you have a MongoDB Atlas account.
-   You have installed Git for version control.
-   You have installed a code editor like Visual Studio Code.
-   You have a basic understanding of JavaScript, TypeScript, React.js, Node.js, and Express.js.
-   You have a basic understanding of MongoDB and Mongoose.
-   You have a basic understanding of RESTful APIs and CRUD operations.

### Steps

Follow these steps to run the project on your local machine:

1. Clone the repository:

    ```bash
    #  copy the repository URL and replace [REPO_URL] with it
    git clone [REPO_URL]
    ```

2. Navigate to the project directory:

    ```bash
    cd hirehaven-mern
    ```

3. Install the dependencies:

    ```bash
    #  install the dependencies for the frontend
    cd www
    npm install

    #  install the dependencies for the backend
    cd ../api
    npm install
    ```

4. Create a `.env` file in the `api` directory and copy the contents of the `.env.example` file into it. Replace the values with your own:

    - You'll need to create a MongoDB Atlas account and a cluster to get database string. We split the database string into `DB_PROTOCOL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, and `DB_NAME` for security reasons. Later, we'll combine these values to form the database string.
    - Use `crypto.randomBytes(64).toString('hex')` to generate a random string for the `JWT_SECRET` and `EMAIL_SECRET`. Preferably, use different strings for each.
    - Locally, your `FRONTEND_URL` will be `http://localhost:3000` and your `BACKEND_URL` will be `http://localhost:3001`.
    - We used Gmail for sending emails. You can use your own email provider. If you use Gmail, you'll need to enable "Less secure app access" in your Google account settings. Fill out the `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM_NAME`, and `EMAIL_FROM_ADDRESS` fields accordingly.

5. Once you have set up the `.env` file, start the backend server:

    ```bash
    #  navigate to the api directory
    cd api

    #  start the server in development mode
    npm run dev
    ```

    > The server will run on `http://localhost:3001`. To build the server for production, run `npm run build` and then `npm run start`, or you could directly run `npm run start`, which will build and start the server.

6. Similarly, create a `.env` file in the `www` directory and copy the contents of the `.env.example` file into it. Replace the values with your own:

    - The `NEXT_PUBLIC_BACKEND_URL` should be `http://localhost:3001` for development.

7. Open a new terminal window and start the frontend server:

    ```bash
    #  navigate to the www directory
    cd www

    #  start the server in development mode
    npm run dev
    ```

    > The frontend will run on `http://localhost:3000`. Open your browser and navigate to this URL to view the project. You can now register, login, and use the application.

## Community

Join the [DRVGO Discord Server](https://itsdrvgo.me/support) to connect with the community and get help with your projects.

## License

This project is licensed under the [MIT License](LICENSE).

## Connect with me

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/itsdrvgo)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/itsdrvgo)
[![Twitch](https://img.shields.io/badge/Twitch-%239146FF.svg?logo=Twitch&logoColor=white)](https://twitch.tv/itsdrvgo)
[![X](https://img.shields.io/badge/X-%23000000.svg?logo=X&logoColor=white)](https://x.com/itsdrvgo)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?logo=YouTube&logoColor=white)](https://youtube.com/@itsdrvgodev)
