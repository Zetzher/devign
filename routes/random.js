var express = require('express');
var router = express.Router();

const Card = require('../models/card')
const Project = require('../models/project')
const User = require('../models/user')

//shorcut -> /random

router.get("/", (req, res, next) => {
    Card.find() 
    .then(data => {
        const random = Math.floor(Math.random() * data.length);
        res.render("random.hbs", {data: data[random]});
    })
    .catch(err => console.log(err));
})

// const userIsLoggedIn = require("../middlewares/auth-mid").userIsLoggedIn
// router.use((req, res, next)=> userIsLoggedIn(req, res, next));
// const userIsNotLoggedIn = require("../middlewares/auth-mid").userIsNotLoggedIn
// router.use((req, res, next)=> userIsNotLoggedIn(req, res, next));

// router.get("/project/create", (req, res, next) => {
//    res.render("project/create");
// })

//router.post("/project/create", async (req, res, next) => {

//    res.render("project/create", {message:"Project created successfully!"});

//});

module.exports = router;