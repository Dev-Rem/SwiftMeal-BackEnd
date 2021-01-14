const express = require('express');
const Account = require('../models/account.js');
const Address = require('../models/address.js');
const router = express.Router();

// Create a new user account
router.post('/register', (req, res) => {
    Address.create(req.body.address, (error, address) => {
        if(error) {
            console.log(error);
            return res.status(500).send();
        }
        Account.create({
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           email: req.body.email,
           phoneNumber: req.body.phoneNumber,
           address_id:  address._id,
           password: req.body.password
        }, 
        (error, account) => {
            if(error) {
                console.log(error);
                return res.status(500).send();
            }
            res.send(account);
        });
    });
});

// get a single user account
router.get('/:id', (req, res) => {
    Account.findById(req.params.id, (error, account) => {
        if(error){
            console.log(error);
            return res.status(500).send();
        }
        if(!account){
            return res.status(404).send();
        }
        res.send(account);
    }).populate('address_id');
});


// login a user
router.post('/login', (req, res) => {
    Account.findOne(req.body, (error, account) => {
        if(error) {
            console.log(error);
            return res.status(500).send();
        }
        if(!user) {
            return res.status(400).send();
        }
        req.session.user = account;
        return res.status(200).send();
    });
});

module.exports = router;