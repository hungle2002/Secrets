//jshint esversion:6
require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = mongoose.Schema({
    email:String,
    password:String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.get("/submit", function(req, res){
    res.render("submit");
});

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const user = new User({
            email: req.body.username,
            password:hash
        });
        user.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username}, function(err, user){
        if(err){
            console.log(err);
        }else{
            if(user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result){
                        res.render("secrets")
                    }else{
                        console.log("Wrong password!!");
                    }
                });
            }else{
                console.log("Email not found !!");
            }
        }
    })
});

app.listen(3000, function(){
    console.log("Server waiting on port 3000 ...");
});