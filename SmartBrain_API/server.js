
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
const knex = require('knex');


app.use(cors());
app.use(express.json());

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client:'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Klazura61%',
        database : 'smart-brain'
    }
});

app.get('/', (req, res)=>{
    res.send('success');
})

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})


app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})

app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
});

