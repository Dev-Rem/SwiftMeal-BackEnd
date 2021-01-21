const Account = require('../models/account');

/* Create user auth */
exports.auth = (req, res, next) => {
    let token = req.cookies.authToken;

    Account.findByToken(token, (error, user) => {
        if (error) throw error;
        if(!user) res.json({isAuth: false, error: true});
        req.token= token;
        req.user = user;
        next();
    });
}

module.exports = { auth }