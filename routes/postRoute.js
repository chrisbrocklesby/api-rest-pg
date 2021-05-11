const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

module.exports = (route) => {
  route.post('/posts', userController.auth, postController.create);
  route.get('/posts', userController.auth, postController.readAll);
  route.get('/posts/:id', userController.auth, postController.readById);
  route.patch('/posts/:id', userController.auth, postController.update);
  route.delete('/posts/:id', userController.auth, postController.delete);
};
