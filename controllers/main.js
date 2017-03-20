/**
 * Created by thomas on 10/03/17.
 */
const mongo = require('../mongo/database');
const ObjectId = require('mongodb').ObjectID;
const initData = require('../init/init.json');
const modelsUser = require('../models/users');

module.exports = {
    initDb : function(req,res) {
        let usersCollection = mongo.db.collection('users');
        if(req.query.clean) {
            usersCollection.removeMany({});
        }
        usersCollection.find({}).toArray()
            .then(users => {
                if(users.length < 1) return usersCollection.insertMany(initData);
                else {
                    res.status(200).send({code : 200, message : "Init already done"});
                }
            })
            .then(result => {
                if(result)
                    res.status(200).send({code : 200,message: result.insertedCount + " data inserted into the db"});
            })
            .catch(err => {
                res.status(500).send({code : 500,message : "An error has been thrown",err : err})
        });

    },
    getUsers : function(req,res){
        let usersCollection = mongo.db.collection('users');
        usersCollection.find({}).toArray()
            .then(users => {
                res.send(users);
            })
            .catch(err => {
                res.status(500).send({code : 500,message : "An error has been thrown",err : err})
            });
    },
    addUsers : function(req,res){
            let err = modelsUser.validateUser(req.body);

            if(err.length > 0) {
                res.status(400).send(err);
                return;
            }

            let user = {
                name : req.body.name,
                amount : req.body.amount,
                creditCard : {
                    expirationDate : req.body.creditCard.expirationDate,
                    numbers : req.body.creditCard.numbers,
                    cvv : req.body.creditCard.cvv
                }
            };
            let usersCollection = mongo.db.collection('users');
            usersCollection.insertOne(user)
                .then(result => {
                    res.status(200).send(result);
                })
                .catch(err => {
                    res.status(500).send(err);
                });
    },
    editUsers : function(req,res){
        let err = modelsUser.validateUser(req.body);
        let usersCollection = mongo.db.collection('users');

        if(err.length > 0) {
            res.status(400).send(err);
            return;
        }

        usersCollection.findOneAndUpdate(
            {_id:new ObjectId(req.params.id)},
            req.body)
            .then(doc => {
                res.status(200).send(doc);
            })

    },
    debit : function(req,res){


        if(!Number.isInteger(req.body.debitAmount)){
            res.status(400).send({code: 400, message : "Bad format for amount", id : 301});
            return;
        }
        let debitAmount = req.body.debitAmount;
        let usersCollection = mongo.db.collection('users');
        let user;

        let today = new Date();
        let morning = today.setHours(0,0,0,0);
        let evening = today.setHours(23,59,59);

        let msInOneDay = evening - morning;
        let dayToPay = Date.now() + msInOneDay * 7;



        usersCollection.findOne({_id:new ObjectId(req.params.id)})
            .then(doc => {
                user = doc;
                let err = modelsUser.validateUser(user);

                if(err.length > 0) {
                    res.status(400).send(err);
                    return;
                }
                if(user.amount < (debitAmount*5)) {
                    res.status(400).send({code : 400, message : "amount on the account insufficient", id : 302});
                    return;
                }
                return usersCollection.updateOne(
                    {_id:new ObjectId(req.params.id)},
                    {$push : { payments : {
                            amount : debitAmount,
                            date : dayToPay}
                    }}
                );
            })
            .then(result => {
                res.status(200).send(result);
            }).catch(err => {
                res.status(500).send(err);
        });

    },
    credit : function(req,res){
        if(!Number.isInteger(req.body.creditAmount)){
            res.status(400).send({code: 400, message : "Bad format for amount", id : 301});
            return;
        }
        let creditAmount = req.body.creditAmount;
        let usersCollection = mongo.db.collection('users');
        usersCollection.findOneAndUpdate(
            {_id: new ObjectId(req.params.id)},
            {$inc : {amount : creditAmount}})
            .then(result => {
                res.status(200).send(result);
            }).catch(err => {
            res.status(500).send(err);
        });

    },
    checkPayment : function(req,res){
        let today = new Date();
        let morning = today.setHours(0,0,0,0);
        let evening = today.setHours(23,59,59);

        let usersCollection = mongo.db.collection('users');

        usersCollection.find({payments:{$exists:true}})
            .forEach(processUserPayment, result => {
                res.status(200).send({message : 'Updates done'});
            });

        function processUserPayment(user){
            let nextPayments = [];

            for (let i = 0; i < user.payments.length; i++) {
                let payment = user.payments[i];
                if(payment.date <= evening && payment.date >= morning) {
                    user.amount -= payment.amount;
                }else{
                    nextPayments.push(payment);
                }
            }
            user.payments = nextPayments;
            return usersCollection.updateOne({_id : user._id},user);
        }
    }
};