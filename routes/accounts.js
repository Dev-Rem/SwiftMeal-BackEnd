const express = require('express');
const Account = require('../models/account.js');
const Address = require('../models/address.js');
const router = express.Router();
const { auth } = require('../routes/auth');

/* Create a new user account */
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
        (error, account) => {
            if (error) throw error;
            res.status(200).json({
                success: true,
                message: 'Successfully Signed Up',
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                phoneNumber: account.phoneNumber
            });
        });
    });
});

/* Login a user */
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
                                phoneNumber: account.phoneNumber,
                                token: account.token
                            });
                        }
                    });
                }
            });
        }
    });
});

/* Logout a user */
router.post('/logout', auth, (req, res) => {
    Account.findByIdAndDelete({ _id: req.user_id }, { token: ''}, (error) => {
        if (error) return res.json({ success: false, error })
        return res.status(200).send({ success: true, message: 'Successfully Logged Out' });
    });
});

/* Get a single user account */
router.get('/account', auth, (req, res) => {
    return res.status(200).json({
        isAuthenticated: true,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        address_id: req.user.address_id
    });
});

module.exports = router;