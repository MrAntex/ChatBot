const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'this is the private key', (err, decodedToken) => {
            if (err) {
                console.log(err.message)
                res.redirect('/auth/login');
            }
            else {
                //console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/auth/login');
    }
}


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'this is the private key', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'this is the private key', async (err, decodedToken) => {
            if (err) {
                res.send('Could not verify token');
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                if (user.privilege) {
                    next();
                }
                else {
                    res.redirect('/auth/accessDenied')
                }
            }
        });
    } else {
        console.log("aaa");
        res.redirect('/auth/accessDenied')
    }
};


module.exports = {
    requireAuth,
    checkUser,
    requireAdmin
}