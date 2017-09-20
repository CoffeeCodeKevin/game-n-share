const next = require('next');
const express = require('express');
const routes = require('./routes');
const pg = require('pg');
const format = require('pg-format');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dev: process.env.NODE_ENV !== 'production'});
const handle = app.getRequestHandler();
const handler = routes.getRequestHandler(app)
const port = process.env.PORT || 3000;

const PGUSER = process.env.DBUSER;
const PGDB = process.env.DB;

const config = {
  user: PGUSER,
  database: PGDB,
  ssl: true,
  max: 100,
  connectionTimeoutMillis: 1000,
  idleTimeoutMillis: 1800000
};

const pool = new pg.Pool(config);
let client;

app.prepare().then(() => {
  const server = express();
  server.use(handler);

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  pool.connect((err, client, done) => {
    console.log(err)
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on port ${port}...`);
    });

    currentClient = client;
  });
});
