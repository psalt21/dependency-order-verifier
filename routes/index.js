const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dependency Order Verifier' });
});

// POST for verifying dependency array
router.post('', function (req, res){ 
  console.log('I\'m in here baby!');
  res.render('verified', { title: 'Results:', dependency_array: req.body.dependency_array });
});

module.exports = router;
