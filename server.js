const express = require('express');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

//Database Setup
const db = knex({
  client: 'pg',
  connection: 'postgres://db_0r9t_user:cOBTIx8p9xuHO2Lxo12JSMKRtsrLY5ML@dpg-cev0v6pgp3jjsh1c0g6g-a.oregon-postgres.render.com/db_0r9t'
});

const app = express();

// const whitelist = ['http://localhost:3001']
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

app.use(morgan('combined'));
app.use(cors())
// app.use(cors(corsOptions))
app.use(express.json()); 

app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})
app.get('/helloworld', (req, res) => {
  res.send('Hello World!')
})

app.listen(3000, ()=> {
  console.log(`app is running on port 3000`);
})