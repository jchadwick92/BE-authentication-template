const userRepository = require("../../users/userMongoRepository");

module.exports = {
  findAll: (req, res) => {
    userRepository.findAll().then(users => res.json(users));
  },

  findById: (req, res) => {
    userRepository.findById(req.params.id).then(user => {
        if (!user) {
            return res.status(404).json("No user found");
          }
        return res.json(user)
    })
    .catch(() => console.log(""));
  },

  delete: (req, res) => {
    userRepository.findById(req.params.id).then(user => {
      if (!user) {
        return res.status(404).json("No user found");
      }
      userRepository
        .deleteById(req.params.id)
        .then(() => res.status(204).json({ body: "user successfully deleted" }))
        .catch(err => console.log(err));
    });
  }
};
