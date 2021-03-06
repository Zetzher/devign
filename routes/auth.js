var express = require('express');
var router = express.Router();

const bcrypt = require("bcryptjs");
const bcryptSalt = 10;      
const User = require('../models/user'); 



router.get('/logout', (req, res, next) => {
    if (!req.session.currentUser) {
        
      res.redirect('/');
      return;
    }
  
    req.session.destroy((err) => {
        
      if (err) {
        next(err);
        return;
      }
  
      res.redirect('/');
    });
});



// estas dos líneas le dicen a router que por favor use userIsNotLoggedIn
const userIsNotLoggedIn = require("../middlewares/auth-mid").userIsNotLoggedIn
router.use((req, res, next)=> userIsNotLoggedIn(req, res, next));

//Shorcut /auth

router.get("/signup", (req, res, next) => {
    res.render("auth/signup.hbs", {errorMessage: ''});
})

router.post("/signup", (req, res, next) => {
    const {username, email, password, repeatPassword} = req.body;

    if(!username || !password) {
        res.render("auth/signup", {errorMessage: "Please complete the fields"})
        return;
    }

    if(password !== repeatPassword) {
        res.render("auth/signup", {errorMessage: "Passwords don't match"})
        return;
    }

    if(email === '' || password === '') {
        res.render("auth/signup", {errorMessage: "Please enter email and password"});
        return;
    }

    User.findOne({username})
    .then(user => {
        if (user) {
            res.render("auth/signup", {errorMessage: "The userName already exists"})
            return;
        }

        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)
        User.create({username, email, "password": hashPass})
        .then((user) => {
            
            req.session.currentUser = user;
            res.redirect("/private/user")
        })
        .catch(err => console.log("Error at posting signup: " + err))
    })
    .catch(err => console.log("Error finding the user in DB: " + err))
})

router.get("/login", (req, res, next) => {
    res.render("auth/login.hbs", {errorMessage: ''});
})

router.post("/login", (req, res, next) => {
    const {username, password} = req.body;

    if(username === "" || password === "") {
        res.render("auth/login", {errorMessage: "Please, complete all the fields"})
    }

    User.findOne({username})
        .then(user => {
            if (!user) {
                res.render("auth/login", {errorMessage: "There is no user with that username"})
            }
            if (bcrypt.compareSync(password, user.password)) { // user.password es la hashseada
                req.session.currentUser = user;
                res.redirect("/private/user")
            }

            else {
                res.render("auth/login", {errorMessage: "Incorrect password"})
            }

        })
        .catch(err => console.log("error finding the user: " + err))
})



module.exports = router;