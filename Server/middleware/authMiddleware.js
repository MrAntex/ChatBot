const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotenv').config();

const hashingKey = process.env.hashingKey;

// If the user is not connected, redirect him to the login page
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, hashingKey, (err, decodedToken) => {
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

// This function tells which user is connected to display his name in a view
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, hashingKey, async (err, decodedToken) => {
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

// Check if the user is an admin
const requireAdmin = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, hashingKey, async (err, decodedToken) => {
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