const User = require('./User');

module.exports = {
    findById: id => User.findById(id),
    findByEmail: email => User.findOne({ email: email }),
    findAll: () => User.find(),
    create: user => User.create(user),
    deleteById: id => User.delete({ id: id })
}