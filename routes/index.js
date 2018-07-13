const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const _ = require('lodash');
router.use(bodyParser.urlencoded({ extended: true }));

// GET home page.
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Dependency Order Verifier' });
});

// POST for verifying dependency array
router.post('', (req, res, next) => {
  router.processArrayFromRequest(req, res, next);
  res.render('verified', { title: 'Results:', dependency_array: req.body.dependency_array });
});

router.processArrayFromRequest = (req, res, next) => {
  // Extract "array" from request before sending to verifyData function
  let origArray = req.body.dependency_array;
  req.body.dependency_array = router.verifyData(origArray);

  next();
}

router.verifyData = (content) => {
  let finalArray = [];
  let packageArray = [];
  let dependencyArray = [];
  let packageDependencyObject = {};
  let dependencyChain = [];
  let dependencyCycleDetected = false;

  let origContent = content;
  // Remove brackets and quotation marks at both ends first
    origContent = origContent.toString().substring(0, origContent.length-2);
    origContent = origContent.toString().substring(2);
  
  let array = origContent.split('", "');

  // first remove any without dependencies
  for(let i = 0; i < array.length; i++){
    let arrayItems = array[i].split(': ');
    if(arrayItems[1] === ''){
      finalArray.push(arrayItems[0]);
    } else {
      // Then separate those with dependencies by putting them in separate arrays
      packageArray.push(arrayItems[0]);
      dependencyArray.push(arrayItems[1]);
    }
  }

  // build an object that represents all packages and dependencies as key value pairs
  for(let i = 0; i < packageArray.length; i++){
    packageDependencyObject[packageArray[i]] = dependencyArray[i];
  }

  // Add first package in packageArray to dependencyChain array
  let addAnother = true;
  dependencyChain.push(packageArray[0]);
  // now add dependency of last item in the array until there are no more to add
  while(addAnother){
    if(dependencyChain.length <= packageArray.length){
      addAnother = true;
      dependencyChain.push(packageDependencyObject[dependencyChain[dependencyChain.length-1]]);
    } else {
      addAnother = false;
    }
  }

  // Remove any undefined items in array
  while(dependencyChain[dependencyChain.length-1] === undefined){
    dependencyChain.pop();
  }

  // Check for duplicates in dependencyChain array
  let cleanDependencyChain = _.uniq(dependencyChain);
  if(cleanDependencyChain.length < dependencyChain.length){
    dependencyCycleDetected = true;
  }
  
  // if there is not dependency cycle detected then go ahead and build final output
  if(!dependencyCycleDetected){
    // now add any dependencies as long as they aren't already in finalArray
    for(let i = 0; i < dependencyArray.length; i++){
      if(!finalArray.includes(dependencyArray[i])){
        finalArray.push(dependencyArray[i]);
      }
    }
    // now add any packages as long as they aren't already in finalArray
    for(let i = 0; i < packageArray.length; i++){
      if(!finalArray.includes(packageArray[i])){
        finalArray.push(packageArray[i]);
      }
    }
    return finalArray;
  } else {
    return Error('A dependency cycle has been detected! Please try again with a valid array.');
  }
};

module.exports = router;
