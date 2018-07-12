//Require the dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const assert = require('assert');

let testArrayOne = ["KittenService: ","Leetmeme: Cyberportal","Cyberportal: Ice","CamelCaser: KittenService","Fraudstream: Leetmeme","Ice: "];
let sameVerifierOutput = "KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream";
let verifierOutput = "KittenService, Ice, Cyberportal, Leetmeme, CamelCaser, Fraudstream";

chai.use(chaiHttp);

describe('Verifier', () =>{
    describe('/', function() {
        it('it should verify array given in textarea', function(done){
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    assert.equal(verifierOutput, sameVerifierOutput);
                    done();
                });
        });
    });
});