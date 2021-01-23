# Aqua App

> This is a microservice component, representing the reviews of a product detail page.


## Requirements

This project relies on a MongoDB database and Node.js.

### Installing Dependencies

From within the root directory:
Creates files `dev.env` and `test.env` under `/config`. An example is provided.
Fill in the env variable `MONGODB_URL` in each, making sure to supply an appropriate MongoDB uri.

```sh
npm install

sudo service mongodb start

npm run dev:server
npm run dev:client
```
