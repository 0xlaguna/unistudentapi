var homeRouter = require('./routes/index');
var userRouter = require('./routes/users');

module.exports = function setupRoutes(app) {
  app.use('/', homeRouter);
  app.use('/user', userRouter);
}