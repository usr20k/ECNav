var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  console.log("logged in, loading home page.");
  console.log(userProfile);
  res.render('pages/home',{
          my_title: "EC Nav",
          search_result:null,
          userProfile: userProfile
      })
});

module.exports = router;
