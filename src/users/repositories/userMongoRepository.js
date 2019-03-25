const User = require('../User');

module.exports = {
    findById: id => User.findOne({ _id: id }),
    findByEmail: email => User.findOne({ email: email }),
    findAll: () => User.find(),
    create: user => User.create(user),
    deleteById: id => User.findByIdAndDelete(id)
}