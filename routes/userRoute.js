const userController = require('../controllers/userController');

module.exports = (route) => {
  route.post('/user/register', userController.register);
  route.post('/user/login', userController.login);
  route.post('/user/logout', userController.logout);
  route.post('/user/revoke', userController.auth, userController.revoke);
};
