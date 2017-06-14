var express = require('express');
var router = express.Router();
var passport = require('passport');
var controllers = require('.././controllers');
var AuthMiddleware =require('.././middleware/auth');

router.get('/', controllers.HomeController.index);
//rutas de usuario
router.get('/auth/signup', controllers.UseController. getSignUp);
router.post('/auth/signup', controllers.UseController. postSignUp);
router.get('/auth/signin', controllers.UseController. getSignIn);
router.post('/auth/signin', passport.authenticate('local',{
    successRedirect : '/users/panel',
    failureRedirect : '/auth/signin',
    failureFlash :true
}));
router.get('/auth/logout', controllers.UseController. logout);
router.get('/users/panel', AuthMiddleware.isLogged , controllers.UseController. getUserPanel);
router.get('/users/balance',AuthMiddleware.isLogged ,controllers.UseController. getAdmLista);
router.post('/users/balance',AuthMiddleware.isLogged ,controllers.UseController. postAdmLista);
router.get('/users/item', AuthMiddleware.isLogged ,controllers.UseController. getItem);
router.post('/users/item',AuthMiddleware.isLogged , controllers.UseController. postItem);
router.get('/users/myBalance',AuthMiddleware.isLogged ,controllers.UseController. getUser);
router.get('/users/shUser',AuthMiddleware.isLogged ,controllers.UseController. getAdmUsers);
router.post('/users/shUser',AuthMiddleware.isLogged ,controllers.UseController. postPagos);




module.exports = router;
