const validate = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if(!validate.isLength(data.username, { min: 2, max: 30 })){
        errors.username = 'Username must be between 2 and 30 characters';
    }
    if(validate.isEmpty(data.username)) {
        errors.username = 'Username field is required';
    }

    if(validate.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    } else if(!validate.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(validate.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    } else if(!validate.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}