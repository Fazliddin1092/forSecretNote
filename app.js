require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');



const app = express();
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/secretForNoteDB', {useNewUrlParser: true, useUnifiedTopology: true});




const userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']  });
const User = mongoose.model('User',userSchema);



app.get('/', (req, res) => {
  res.render('home');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/register', (req, res) => {
  res.render('register');
});





app.post("/login", (req, res) => {
  User.findOne({username:req.body.username}, function(err, founditem){
    if (!err) {
      if(founditem.password===req.body.password){
        res.render("secrets");
      }
    } else {
      console.log(err);
    }
  });
});
app.post("/register", (req, res) => {
  const user = new User ({
    username:req.body.username,
    password:req.body.password
  });
  user.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});



app.listen(3000, ()=>{
  console.log("The server started on 3000");
})
