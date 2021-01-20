const express = require('express');
const Account = require('../models/account.js');
const Address = require('../models/address.js');
const router = express.Router();


// Create user auth
const auth = (req, res, next) => {
    let token = req.cookies.authToken;

    Account.findByToken(token, (error, user) => {
        if (error) throw error;
        if(!user) res.json({isAuth: false, error: true});
        req.token= token;
        req.user = user;
        next();
    });
}

// Create a new user account
router.post('/register', async (req, res) => {
    Address.create(req.body.address, (error, address) => {
        if (error) throw error;
        Account.create({
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           email: req.body.email,
           phoneNumber: req.body.phoneNumber,
           address_id:  address._id,
           password: req.body.password
        }, 
        (error) => {
            if (error) throw error;
            res.status(200).json({
                success: true,
                message: 'Successfully Signed Up',
            });
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
    Account.findOne({'email': req.body.email}, (error, account) => {
        if(error) throw error;
        if(!user) {
            return res.status(404).json({ success: false, message: 'User email not found!' });
        }else {
            account.comparePassword(req.body.password, (error, isMatch) => {
                if (!isMatch) {
                    return res.status(400).json({ success: false, message: 'Wrong Password!' });
                }else{
                    account.generateToken((error, account) => {
                        if (error) {
                            return res.status(400).send(); 
                        }else{
                            res.cookie('authToken', account.token).status(200).json({
                                success: true,
                                message: 'Successfully Logged In',
                                id: account._id,
                                firstName: account.firstName,
                                lastName: account.lastName,
                                email: account.email,
                                token: account.token
                            });
                        }
                    });
                }
            });
        }
    });
});


module.exports = router;