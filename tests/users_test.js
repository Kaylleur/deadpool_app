/**
 * Created by thomas on 20/03/17.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../bin/www');
var should = chai.should();

chai.use(chaiHttp);


describe('Users', function() {


    it('should init the database with 10 users without credit card and 300 on amount on /initDb', function(done){
        chai.request(server)
            .get('/initDb?clean=true')
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.code.should.equal(200);
                done();
            });
    });

    it('should list ALL users on /users GET', function(done) {
        chai.request(server)
            .get('/users')
            .end(function(err, res){
                res.should.have.status(200);
                res.should.be.json;
                done();
            });
    });

    it('should add a SINGLE user on /users POST', function(done) {
        var userToAdd = {
            "name":"toto",
            "amount":512,
            "creditCard" : {
                "expirationDate":123456789,
                "numbers":1000000000000000,
                "cvv":100
            }
        };
        chai.request(server)
            .post('/users')
            .send(userToAdd)
            .end(function(err,res){
               res.should.have.status(200);
               res.should.be.json;
               res.body.ok.should.equal(1);
               res.body.n.should.equal(1);
               done();
            });
    });
    it('should update a SINGLE user on /users/<id> PUT', function(done){
        var userToUpdate = {
            "name":"toto",
            "amount":448,
            "creditCard" : {
                "expirationDate":9876543210,
                "numbers":9999999999999999,
                "cvv":999
            }
        };
        chai.request(server)
            .get('/users')
            .end(function(err, res){
                chai.request(server)
                .put('/users/'+res.body[0]._id)
                    .send(userToUpdate)
                    .end(function(err,res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.ok.should.equal(1);
                        done();
                    });
            });
    });

    it('should credit a SINGLE user account on /credit/<id> POST', function(done){
        var amountToCredit= {creditAmount: 500};

        chai.request(server)
            .get('/users')
            .end(function(err, res){
                chai.request(server)
                    .post('/credit/'+res.body[0]._id)
                    .send(amountToCredit)
                    .end(function(err,res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.ok.should.equal(1);
                        done();
                    });
            });
    });

    it('should debit a SINGLE user account on /debit/<id> POST', function(done){
        var amountToDebit= {debitAmount: 10};

        chai.request(server)
            .get('/users')
            .end(function(err, res){
                chai.request(server)
                    .post('/debit/'+res.body[0]._id)
                    .send(amountToDebit)
                    .end(function(err,res){
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.ok.should.equal(1);
                        done();
                    });
            });
    });

    it('should check if some payment has to be done today on /checkPayment GET', function(done){
        chai.request(server)
            .get('/checkPayment')
            .end(function(err,res){
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.message.should.equal('Updates done');
                done();
            });
    });

    it('should init the database with 10 users 300 on amount on /initDb', function(done){
       chai.request(server)
           .get('/initDb')
           .end(function(err,res){
               res.should.have.status(200);
               res.should.be.json;
               res.body.should.be.a('object');
               res.body.code.should.equal(200);
               done();
           });
    });

    /**
     * ERRORS CASES AFTER THAT
     */

    it('should test to add a SINGLE user but throw error on /users POST', function(done) {
        var userToAdd = {
            "name":undefined,
            "amount":"512",
            "creditCard" : {
                "expirationDate":"123456789",
                "numbers":"1000000000000000",
                "cvv":"100"
            }
        };
        chai.request(server)
            .post('/users')
            .send(userToAdd)
            .end(function(err,res){
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length.at.least(5);
                res.body.should.include({message:"name invalid",id:101});
                res.body.should.include({message:"amount invalid",id:102});
                res.body.should.include({message:"credit card expiration date invalid",id:201});
                res.body.should.include({message:"credit card numbers invalid",id:202});
                res.body.should.include({message:"credit card cvv invalid",id:203});
                done();
            });
    });

    it('should test to edit a SINGLE user but throw error on /users PUT', function(done) {
        var userToEdit = {
            "name":undefined,
            "amount":"512",
            "creditCard" : {
                "expirationDate":"123456789",
                "numbers":"1000000000000000",
                "cvv":"100"
            }
        };
        chai.request(server)
            .get('/users')
            .end(function(err, res) {
                chai.request(server)
                    .put('/users/' + res.body[0]._id)
                    .send(userToEdit)
                    .end(function (err, res) {
                        res.should.have.status(400);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.should.have.length.at.least(5);
                        res.body.should.include({message: "name invalid", id: 101});
                        res.body.should.include({message: "amount invalid", id: 102});
                        res.body.should.include({message: "credit card expiration date invalid", id: 201});
                        res.body.should.include({message: "credit card numbers invalid", id: 202});
                        res.body.should.include({message: "credit card cvv invalid", id: 203});
                        done();
                    });
            });
    });


    it('should not find route on /blabla GET', function(done){
       chai.request(server)
           .get('/blabla')
           .end(function(err,res){
              res.should.have.status(404);
              done();
           });
    });


    it('should credit a SINGLE user account and throw 302 error on /credit/<id> POST', function(done){
        var amountToCredit= {creditAmount: "500"};

        chai.request(server)
            .get('/users')
            .end(function(err, res){
                chai.request(server)
                    .post('/credit/'+res.body[0]._id)
                    .send(amountToCredit)
                    .end(function(err,res){
                        res.should.have.status(400);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.id.should.equal(301);
                        done();
                    });
            });
    });

    it('should debit a SINGLE user account and throw 302 error on /debit/<id> POST', function(done){
        var amountToDebit= {debitAmount: 99999999};

        chai.request(server)
            .get('/users')
            .end(function(err, res){
                chai.request(server)
                    .post('/debit/'+res.body[0]._id)
                    .send(amountToDebit)
                    .end(function(err,res){
                        res.should.have.status(400);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.id.should.equal(302);
                        done();
                    });
            });
    });


    it('should debit a SINGLE user account and throw 302 error on /debit/<id> POST', function(done){
        var amountToDebit= {debitAmount: "10"};

        chai.request(server)
            .get('/users')
            .end(function(err, res){
                chai.request(server)
                    .post('/debit/'+res.body[0]._id)
                    .send(amountToDebit)
                    .end(function(err,res){
                        res.should.have.status(400);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.id.should.equal(301);
                        done();
                    });
            });
    });

});