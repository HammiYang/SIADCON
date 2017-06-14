var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new LocalStrategy({
        passReqToCallback: true
    }, function (req, email, password, done) {
        console.log(email);
        //return;
     var config = require('.././database/config');
     console.log("-----------------------");
        mongo.connect(config.url, function (err, db) {
            if (err) {
                return console.error(err)
            }
            //accedo a la coleccion con parrots 
            db.collection('Users').find({
                email: email}).toArray(function (err, documents, fields) {
                 if (err) throw err;
                 
                //se imprimen los documentos encontrados 
                console.log(documents)
                //se cierra la conexion a la base de datos
                db.close();
                if(documents.length > 0){
                    var user = documents[0];
                    if(bcrypt.compareSync(password, user.password)){
                        return done(null,{
                            _id : user._id,
                            nombre : user.nombre,
                            email : user.email
                        });
                    }
                }
               
                return done(null, false, req.flash('authmessage','E-mail o Contraseña incorrecto.'));
            });
        });
    }
    ));
};