const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
    //duplicateur error code
    if (err.code === 11000) {
        errors.email = 'That email is already used'
        return errors;
    }

    //incorrect email
    if(err.message === 'Incorrect email'){
        errors.email = 'That email is not registered'
    }

    //incorrect password
    if(err.message === 'Incorrect password'){
        errors.password = 'That password is incorrect'
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}

const maxAge = 24 * 60 * 60; // Time before the JW token expires
const createToken = (id) => {
    return jwt.sign({ id: id }, 'this is the private key', {
        expiresIn: maxAge
    })
}

const signup_get = (req, res) => {
    res.render('./auth/signup', { title: 'Sign up', subtitle: 'aaa' });
}

const login_get = (req, res) => {
    res.render('./auth/login', { title: 'Login', subtitle: '' });
}

const logout_get = (req, res) => {
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}


const signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email: email, password: password,privilege:false });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

const home = (req,res) =>{
    res.render('./auth/home',{title:'',subtitle:'Home page'});
}

const access_denied = (req, res) => {
    res.render('./auth/deniedPerm', { title: '', subtitle: '' });
}


module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    home,
    logout_get,
    access_denied
}