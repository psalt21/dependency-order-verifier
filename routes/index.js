const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dependency Order Verifier' });
});

// POST for verifying dependency array
router.post('', function (req, res, next){
  console.log('before verifyData function', req.body.dependency_array);
  verifyData(req, res, next);
  console.log('after verifyData function', req.body.dependency_array);
  res.render('verified', { title: 'Results:', dependency_array: req.body.dependency_array });
});

function verifyData(req, res, next){
  let finalArray = [];

  let origContent = req.body.dependency_array.toString();
  if(origContent.slice(-1) === ']'){
    origContent = origContent.substring(0, origContent.length-1);
  }
  if(origContent.slice(-1) === "\""){
    origContent = origContent.substring(0, origContent.length-1);
  }
  if(origContent.charAt(0) === '['){
    origContent = origContent.substring(1);
  }
  if(origContent.charAt(0) === '\"'){
    origContent = origContent.substring(1);
  }
  if(origContent.charAt(0) === ' '){
    origContent = origContent.substring(1);
  }
  origContent.trim();
  let array = origContent.split('", "');

  console.log('array before verifying dependencies', array);

  for(let x = 0; x < array.length; x++){
    console.log('current array item:', array[x]);
    let arrayItems = array[x].split(': ');
    console.log('arrayItems are:', arrayItems);
    if(arrayItems[1] === ''){
      finalArray.push(arrayItems[0]);
    }
  }

  req.body.dependency_array = finalArray;

  next();
};

module.exports = router;
