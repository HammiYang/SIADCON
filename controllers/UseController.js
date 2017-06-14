var mongo = require('mongodb').MongoClient;
var bcrypt = require('bcryptjs');

module.exports = {
    getSignUp: function (req, res, next) {
        return res.render('users/signup');
    },

    postSignUp: function (req, res, next) {
        //nivel de la encriptacion el numero podemos ponerlo mas elevado dependiendo de la dificultad que le demos 

        var salt = bcrypt.genSaltSync(10)
        //pedimos la propiedad password y le pasamos el objeto salt
        var password = bcrypt.hashSync(req.body.password, salt);
        //objeto json
        var user = {
            email: req.body.email,
            nombre: req.body.nombre,
            //seguridad (password: password) ---> no mandar el password
            //password: req.body.password
            password: password,
            _id: req.body._id,Seguridad:0, RecoleccionBasura:0, LimpiezaComunes:0,
                            AlumbradoComunes:0, Limpiezatinacos:0, PagoAdministrador:0, total:0

        }

        //pasamos la configuracion de la base de datos
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        var url = config.url;
        console.log(`> BD: ${url}`);
        //insertamos los datos 
        var _id = req.body._id;
        mongo.connect(url, function (err, db) {
            if (err) throw err
            var collection = db.collection('Users')
            collection.find({
                _id: _id
            }).toArray(function (err, documents, fields) {
                if (err){}
                    collection.insert(user, function (err, data) {
                        if (err) console.log("¡Se duplica el departamento!")
                        console.log(JSON.stringify(user))
                        db.close()
                    })
                console.log(documents + "<------------------------sí imprime");
                if (documents.length > 0) {
                    //
                    req.flash('messageErr', 'ERROR. El departamento está duplicado, por favor verifica');
                    console.log(documents + "<---------------------ya existe");
                } else {
                   req.flash('info', 'Se ha registrado correctamente, ya puede iniciar sesión.');
                    console.log(documents + "<------------------------es nuevo");
                }
                
                return res.redirect('/auth/signin');
            });
        });
    },
    getSignIn: function (req, res, next) {
        return res.render('users/signin', { message: req.flash('info'), authmessage: req.flash('authmessage'),
         messageErr: req.flash('messageErr')});
    },
    logout: function (req, res, next) {
        req.logout();
        res.redirect('/auth/signin');
    },
    getUserPanel: function (req, res, next) {
        res.render('users/panel', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user

        });
    },
    getAdmLista: function (req, res, next){
         var mes = req.body.mes
        //pasamos la configuracion de la base de datos
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        console.log("-----------------MES---------------");
        console.log(mes);
        var url = config.url;
        console.log(`> BD: ${url}`);


        mongo.connect(url, function (err, db) {
            if (err) throw err
            var collection = db.collection('Users')
            collection.distinct("pagos",function (err, documents, fields) {
                if (err) throw err;
                //se imprimen los documentos encontrados 
                console.log(`------- datos${documents}`);
                console.log(JSON.stringify(documents));
                //se cierra la conexion a la base de datos
                documents.forEach(function(element) {
                    console.log(element);
                
                });

                console.log('lo que envia de items en postAdmlista');
                //) console.log (`${items}`);
                db.close();
                 res.render('users/balance', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    items:documents
                });
            });

           
        });
         
    },
    postAdmLista: function (req, res, next) {
        var mes = req.body.mes
        //pasamos la configuracion de la base de datos
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        console.log("-----------------MES---------------");
        console.log(mes);
        var url = config.url;
        console.log(`> BD: ${url}`);


        mongo.connect(url, function (err, db) {
            if (err) throw err
            var collection = db.collection('Users')
            collection.find({"pagos.mes":mes},{_id:false,"pagos.$":true}).toArray(function (err, documents, fields) {
                if (err) throw err;
                //se imprimen los documentos encontrados 
                console.log(`------- datos${documents}`);
                console.log(JSON.stringify(documents));
                //se cierra la conexion a la base de datos

                console.log('lo que envia de items en postAdmlista');
                //) console.log (`${items}`);
                db.close();
                return res.redirect('/users/balance');
            });
        });

    },
    getItem: function (req, res, next) {
        return res.render('users/item', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            message: req.flash('infor')

        });
    },
    postItem: function (req, res, next) {
        
           var seguridad=parseInt(req.body.seguridad),
            basura= parseInt(req.body.basura),
            limpieza= parseInt(req.body.limpieza),
            luz= parseInt(req.body.luz),
            tinacos=parseInt(req.body.tinacos),
            pago= parseInt(req.body.pago),
            mes= (req.body.mes),
            total=parseInt(req.body.pago) + parseInt(req.body.tinacos)
            + parseInt(req.body.luz) + parseInt(req.body.limpieza)
            + parseInt(req.body.basura) + parseInt(req.body.seguridad)

        
        console.log(pago.total);
        console.log(pago);
        //pasamos la configuracion de la base de datos
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        var url = config.url;
        console.log(`> BD: ${url}`);
        //insertamos los datos 
        mongo.connect(url, function (err, db) {
            if (err) throw err
            var collection = db.collection('Users')
            collection.update({},{$push :{"pagos":{$each:[{seguridad
                ,basura,limpieza,luz,tinacos,pago,mes,total}]}}},{multi:true}, function (err, data, pago) {
                if (err) throw err
                console.log(JSON.stringify(pago)) 
                db.close()
            });
        });

        req.flash('infor', 'Se ha registrado correctamente el nuevo pago.');

        return res.redirect('/users/item');
    },
    getUser: function (req, res, next) {
        //pasamos la configuracion de la base de datos
        var nombre = req.user.nombre;
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        var url = config.url;
        console.log(`> BD: ${url}`);
        mongo.connect(url, function (err, db) {
            if (err) throw err
            var collection = db.collection('Users')
            collection.find({
                nombre: nombre
            }).toArray(function (err, documents, fields) {
                if (err) throw err;
                //se imprimen los documentos encontrados 
                console.log(`------- datos${documents}`);
                console.log(JSON.stringify(documents));
                //se cierra la conexion a la base de datos

                console.log('lo que envía de items');
                //) console.log (`${items}`);
                db.close();
                res.render('users/myBalance', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    items: documents
                });
            });
        });
    },
    getAdmUsers: function (req, res, next) {
        //pasamos la configuracion de la base de datos
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        var url = config.url;
        console.log(`> BD: ${url}`);
        mongo.connect(url, function (err, db) {
            if (err) throw err
            var collection = db.collection('Users')
            collection.find().toArray(function (err, documents, fields) {
                if (err) throw err;
                //se imprimen los documentos encontrados 
                console.log(`------- datos${documents}`);
                console.log(JSON.stringify(documents));
                //se cierra la conexion a la base de datos

                console.log('lo que envía de items');
                //) console.log (`${items}`);
                db.close();
                res.render('users/shUser', {
                    isAuthenticated: req.isAuthenticated(),
                    user: req.user,
                    items: documents,
                    message: req.flash('infor'),
                    messageRep: req.flash('messageRep')
                });
            });
        });
    },
    postPagos: function (req, res, next) {
        var _id = req.body.numDepto,
            Seguridad = req.body.Seguridad,
            RecoleccionBasura = req.body.RecoleccionBasura,
            LimpiezaComunes = req.body.LimpiezaComunes,
            AlumbradoComunes = req.body.AlumbradoComunes,
            Limpiezatinacos = req.body.Limpiezatinacos,
            PagoAdministrador = req.body.PagoAdministrador;
        total = parseInt(req.body.PagoAdministrador) + parseInt(req.body.Limpiezatinacos)
            + parseInt(req.body.AlumbradoComunes) + parseInt(req.body.LimpiezaComunes)
            + parseInt(req.body.RecoleccionBasura) + parseInt(req.body.Seguridad);

        console.log(total);
        //pasamos la configuracion de la base de datos
        var config = require('.././database/config');
        //creamos la coneccion a la base de datos 
        var url = config.url;
        console.log(`> BD: ${url}`);
        //insertamos los datos 
        mongo.connect(url, function (err, db) {
            if (err) return console.error(err)

            var users = db.collection('Users')
            // update
            users.find({
                _id: _id
            }).toArray(function (err, documents, fields) {
                if (err)
                    console.log('-----------losdoc')
                console.log(documents);
                users.update({
                    _id: _id
                }, {
                        $set: {
                            Seguridad, RecoleccionBasura, LimpiezaComunes,
                            AlumbradoComunes, Limpiezatinacos, PagoAdministrador, total

                        }
                    })
                db.close()
                
                console.log(documents + "<------------------------si imprime");
                if (documents.length > 0) {
                    req.flash('infor', 'Se realizó correctamente la actualización del pago.');
                } else {
                    req.flash('messageRep', 'ERROR. El departamento no está registrado.')
                }

                return res.redirect('/users/shUser');
            });

        });
  
    }
};
