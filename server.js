const next = require('next');
const express = require('express');
const routes = require('./routes');
const pg = require('pg');
const format = require('pg-format');
const crypto = require('crypto');

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

// Found here: https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/.
// Even for a small practice app like this, I would prefer to use best practices
// for the storage of user passwords.

const genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

const sha512 = function(password, salt){
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    const salt = genRandomString(16);
    const passwordData = sha512(userpassword, salt);
}
