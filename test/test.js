//Require the dependencies
const chai = require('chai');
const expect = require('chai').expect;
const should = chai.should();
const assert = require('assert');

const router = require('../routes/index');

let testArrayOne = "[\"KittenService: \", \"Leetmeme: Cyberportal\", \"Cyberportal: Ice\", \"CamelCaser: KittenService\", \"Fraudstream: Leetmeme\", \"Ice: \"]";
let testArrayTwo = "[\"KittenService: \", \"Leetmeme: Cyberportal\", \"Cyberportal: Ice\", \"CamelCaser: KittenService\", \"Fraudstream: \", \"Ice: Leetmeme\" ]";

describe('should test the verifyData function', () => {
    it('It should return order for valid packaged and dependencies to be installed', () => {
        assert.equal(router.verifyData(testArrayOne), "KittenService,Ice,Cyberportal,Leetmeme,CamelCaser,Fraudstream");
    });
});