const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Unvalid email']
    },
    password: {
        type: String,
        required: [true, 'Enter a password'],
        minlength: [5, 'Password must be atleast 5 characters long']
    },
    privilege: {
        type: Boolean,
        required:true
    }
})


//Function used before the document is saved on the DB
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error('Incorrect email');
}


const User = mongoose.model('user', userSchema);

module.exports = User;