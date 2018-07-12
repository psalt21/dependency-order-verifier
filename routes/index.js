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
  let packageArray = [];
  let dependencyArray = [];

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

  // first remove any without dependencies
  for(let x = 0; x < array.length; x++){
    console.log('current array item:', array[x]);
    let arrayItems = array[x].split(': ');
    console.log('arrayItems are:', arrayItems);
    if(arrayItems[1] === ''){
      finalArray.push(arrayItems[0]);
    } else {
      // Then separate those with dependencies by putting them in separate arrays
      packageArray.push(arrayItems[0]);
      dependencyArray.push(arrayItems[1]);
    }
  }

  // now add any dependencies as long as they aren't already in finalArray
  for(let x = 0; x < dependencyArray.length; x++){
    if(!finalArray.includes(dependencyArray[x])){
      finalArray.push(dependencyArray[x]);
    }
  }

  // now add any packages as long as they aren't already in finalArray
  for(let x = 0; x < packageArray.length; x++){
    if(!finalArray.includes(packageArray[x])){
      finalArray.push(packageArray[x]);
    }
  }
  
  req.body.dependency_array = finalArray;

  next();
};

module.exports = router;
