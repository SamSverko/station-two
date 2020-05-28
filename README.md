[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![first-timers-only](https://img.shields.io/badge/first--timers--only-friendly-blue.svg)](https://www.firsttimersonly.com/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# station-two

Create and host your own trivia 🎉 (in the works, coming soon!)

---

## Back End

### API

Data is provided through REST API endpoints. View the [API Documentation](https://documenter.getpostman.com/view/8479393/Szme4dYQ?version=latest).

### Setup

- Ensure your environment has [Git](https://git-scm.com/), [Node.js](https://nodejs.org/en/), and [npm](https://www.npmjs.com/) installed.
- Clone repository, run `git clone https://github.com/SamSverko/station-two.git`.
- Navigate into project directory, run `cd station-two`.
- Install dependencies:
  - **For development:** Run `npm i`.
  - **For production:** Run `npm i --production`.
- Edit `sample.env` with appropriate values and save as `.env`.

### Development & Production

- Follow **Setup** section above.
- To start the server:
	- **For development:**
    - Start the pm2 process, run `npm run dev-start`.
    - When needed, test JavaScript syntax, run `npm test`. Be sure to fix any errors that appear.
	- **For production:**
    - Start the pm2 process, run `npm run start`.
- View at whatever `http://[host]:[port]` matches your `.env` file.
- To control the server:
	- **For development:**
    - Stop the pm2 process, run `npm run dev-stop`.
    - Restart the pm2 process, run `npm run dev-restart`.
	- **For production:**
    - Stop the pm2 process, run `npm run stop`.
    - Restart the pm2 process, run `npm run restart`.

### Dependencies

#### Local

- [axios](https://www.npmjs.com/package/axios) - Promise based HTTP client for the browser and node.js.
- [compression](https://www.npmjs.com/package/compression) - Node.js compression middleware.
- [cors](https://www.npmjs.com/package/cors) - Node.js CORS middleware.
- [dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables from .env file.
- [express](https://www.npmjs.com/package/express) - Fast, unopinionated, minimalist web framework.
- [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize) - Sanitize your express payload to prevent MongoDB operator injection..
- [express-validator](https://www.npmjs.com/package/express-validator) - Express middleware for the validator module.
- [helmet](https://www.npmjs.com/package/helmet) - Help secure Express/Connect apps with various HTTP headers.
- [mongodb](https://www.npmjs.com/package/mongodb) - The official MongoDB driver for Node.js.
- [pm2](https://www.npmjs.com/package/pm2) - Production process manager for Node.JS applications with a built-in load balancer.
- [socket.io](https://www.npmjs.com/package/socket.io) - Node.js realtime framework server.

#### Development

- [standard](https://www.npmjs.com/package/standard) - JavaScript Standard Style.

---

## Front End

## Setup

- Follow **Back End Setup** section above.
- Enter front end directory, run `cd client`.
- Install dependencies, run `npm i`.

### Available Scripts

#### `npm start`

- Runs the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- The page will reload if you make edits.
- You will also see any lint errors in the console.

#### `npm test`

- Launches the test runner in the interactive watch mode.

#### `npm run build`

- Builds the app for production to the `build` folder.
- It correctly bundles React in production mode and optimizes the build for the best performance.
- The build is minified and the filenames include the hashes.
- Your app is ready to be deployed!

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

- If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
- Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.
- You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


### Dependencies

#### Local

- [@testing-library/jest-dom](https://www.npmjs.com/package/@testing-library/jest-dom) - Custom jest matchers to test the state of the DOM.
- [@testing-library/react](https://www.npmjs.com/package/@testing-library/react) - Simple and complete React DOM testing utilities that encourage good testing practices..
- [@testing-library/user-event](https://www.npmjs.com/package/@testing-library/user-event) - Simulate user events for react-testing-library.
- [bootstrap](https://www.npmjs.com/package/bootstrap) - The most popular front-end framework for developing responsive, mobile first projects on the web.
- [react](https://www.npmjs.com/package/react) - React is a JavaScript library for building user interfaces.
- [react-bootstrap](https://www.npmjs.com/package/react-bootstrap) - Bootstrap 4 components built with React.
- [react-dom](https://www.npmjs.com/package/react-dom) - React package for working with the DOM.
- [react-router-dom](https://www.npmjs.com/package/react-router-dom) - DOM bindings for React Router.
- [react-scripts](https://www.npmjs.com/package/react-scripts) - Configuration and scripts for Create React App.
- [socket.io-client](https://www.npmjs.com/package/socket.io-client) - Realtime framework server (client).
- [styled-components](https://www.npmjs.com/package/styled-components) - Visual primitives for the component age. Use the best bits of ES6 and CSS to style your apps without stress.