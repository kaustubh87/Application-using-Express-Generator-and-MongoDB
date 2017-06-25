var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    //Using local for Local Strategy Passport

    local: {
        name: String,
        email: String,
        password: String
    }

});

//Generate hash for the password entered by the user

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSalt(8), null);
};

//Verify if password is valid

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

//create the model for users and expose it to the app

module.exports = mongoose.model('User', userSchema);