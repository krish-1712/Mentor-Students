var express = require('express');
const mongoose = require('mongoose')
const { dbUrl } = require('../Common/dbConfig');


mongoose.connect(dbUrl)

var router = express.Router();

/* GET users listing. */
//  router.get('/', function(req, res, next) {
//    res.send('respond with a resource');
//  });


module.exports = router;
