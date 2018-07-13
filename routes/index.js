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
  router.processArrayFromRequest(req, res, next);
  res.render('verified', { title: 'Results:', dependency_array: req.body.dependency_array });
});

router.processArrayFromRequest = function (req, res, next){
  // Extract "array" from request before sending to verifyData function
  let origArray = req.body.dependency_array.toString();
  req.body.dependency_array = router.verifyData(origArray);

  next();
}

router.verifyData = function (content){
  let finalArray = [];
  let packageArray = [];
  let dependencyArray = [];

  let origContent = content;
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

  // first remove any without dependencies
  for(let x = 0; x < array.length; x++){
    let arrayItems = array[x].split(': ');
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

  return finalArray;

  // next();
};

module.exports = router;
