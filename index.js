const express = require ('express');
var cors = require('cors')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Imports Routes 
const authRoute = require('./routes/auth');


app.use(cors());

//middleware
app.use(express.json());



// Route MiddleWare

app.use('/api/user', authRoute);


//database connect 

dotenv.config();
mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser: true}, 
    () => {
      return console.log('connected to db');
    });



app.listen(4000, () => console.log('server up and running'));