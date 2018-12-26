## MERN App Boilerplate

A nice boilerplate with pre-configured scripts and nodemon to make development and deployment easy.

File structure overview:
- client: contains your React front-end.
- internals: contains helper scripts for building your app. 
- server: your express backend, models, and controllers.

To begin, start in the root directory and run `yarn setup`. This will install all dependencies for the server and client.

To run: `yarn start`
To deploy: `heroku create your-app-name`. Then push changes to your repository, then run `yarn deploy`.