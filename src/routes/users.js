var jwt = require('jsonwebtoken');
var userController = require('../controllers/userController');
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Does nothing!');
});

router.post('/login', async function(req, res, next){
  //Do login here
  await userController.CheckIfUserExists(req.body.email, req.body.password).then(() => {
    //return json web token
    //token = jwt.sign({userId: req.body.email}, process.env.JWT_SECRET);
    res.status(200).send("Ok");
  })
  .catch(reason => {
    console.log(reason);
    res.status(404).json({ message: "Usuario/contraseña invalido" });
  });
});

router.post('/student', async function(req, res, next){
  await userController.getStudentData(req.body.email, req.body.password).then((sdata) => {
    res.status(200).send(sdata);
  });
});

module.exports = router;
