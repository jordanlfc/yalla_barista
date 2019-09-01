
//Dependencies
const express = require("express"),
    app = express(),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    CookieParser = require('cookie-parser'),
    url = require('url'),
    multer = require('multer'),
    cookieSession = require('cookie-session'),
    passport = require('passport'),
    mysql = require('mysql'),
    dbconfig = require('./config/database'),
    connection = mysql.createConnection(dbconfig.connection),
    uploader = multer(),
    withcv = uploader.single('cvfile'),
    nodemailer = require("nodemailer");
async = require("async"),
    crypto = require("crypto"),
    bcrypt = require('bcrypt-nodejs');
flash = require("connect-flash"),
    path = require("path");



connection.query('USE ' + dbconfig.database);



//port 
const port = process.env.PORT || 45000;

require('./config/passport')(passport);

//app uses

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static("displaypic"));
app.use(methodOverride("_method"));
app.use(flash());


app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2', 'key3'],
    maxAge: '36000000'
}))



function getRandomInt(max) {
    var randomNumber = Math.floor(Math.random() * Math.floor(max));
    return randomNumber.toString()
}


app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

//view engine
app.set("view engine", "ejs");

//functions 


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}





//multer engine
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './displaypic/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + file.originalname)
    },

})
var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './displaypic/')
    },
    filename: function (req, file, cb) {
        cb(null, req.user.id + file.originalname)
    },

})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('display');



const upload2 = multer({
    storage: storage2,
}).single('vid');

const checkFileType = (file, cb) => {
    //Allowed Extensions 
    const filetypes = /jpeg|jpg|png/
    //check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mime 
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('error: Images Only')
    }
}




//routes

app.get('/', (req, res) => {

    let sql = `SELECT * FROM testimonials`

    connection.query(sql, (err, data) => {
        if (err) {
            res.sendStatus(404)
        } else {
            res.render('index', { data: data })
        }
    })



})


app.post('/', isLoggedIn, (req, res, err) => {
    if (!req.user.is_admin == 1) {
        res.redirect('/')
    }

    upload(req, res, (err) => {
        if (err || !req.file) {
            req.flash('error', 'Upload failed')
            res.redirect('back')
        } else {
            let sql = `INSERT INTO testimonials (comment, company, path, name ) values (?, ?, ?, ?)`

            let data = [
                req.body.comment, req.body.company, req.file.path, req.body.name,
            ]


            // execute the UPDATE statement
            connection.query(sql, data, (err, results) => {
                if (err) {
                    res.send(err);
                }
                req.flash('success', 'Uploaded')
                res.redirect('back')
            })
        }
    })
});

app.get('/new', isLoggedIn, (req, res) => {

    if (!req.user.is_admin == 1) {
        res.redirect('/')
    }

    res.render('new')
})









app.post('/user_verify:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    verified = ?
    WHERE 
    id = ?`
    let data = [
        1, id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {
            res.send(results)
        }
        res.redirect('back')
    })
});
app.post('/user_unverify:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    verified = ?
    WHERE 
    id = ?`
    let data = [
        0, id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {
            res.send(results)
        }
        res.redirect('back')
    })
});

app.post('/act_prem:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    premium = ?
    WHERE 
    id = ?`

    let data = [
        1, id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {
            res.send(results)
        }
        res.redirect('back')
    })
});
app.post('/deact_prem:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    premium = ?
    WHERE 
    id = ?`
    let data = [
        0, id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {

            res.send(results)
        }
        res.redirect('back')
    })
});

app.post('/deact_vid:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    videoverify = ?
    WHERE 
    id = ?`
    let data = [
        0, id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {

            res.send(results)
        }
        res.redirect('back')
    })
});

app.post('/act_vid:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    videoverify = ?
    WHERE 
    id = ?`
    let data = [
        1, id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {
            res.redirect('back')
        }
        res.redirect('back')
    })
});

app.post('/delete:id', (req, res) => {
    var id = req.params.id
    let sql = `DELETE FROM users 
    WHERE
    id = ?`
    let data = [
        id
    ]
    connection.query(sql, data, (err, user, results) => {
        if (err) {
            res.send(results)
        }
        res.redirect('/admin_business')
    })
});

app.post('/user_rmdp:id', (req, res) => {
    var id = req.params.id
    let sql = `UPDATE users 
    SET 
    display_path = ?
    WHERE 
    id = ?`
    let sql2 = `SELECT * FROM users WHERE id = ? `
    let data = [
        null, id
    ]
    connection.query(sql, data, (err) => {
        if (err) {
            res.redirect('back')
        }

    })

    connection.query(sql2, id, (err, user) => {
        if (err) {
            res.redirect('back')
        }
        userEmail = user[0].email
        pictureWarning()
        res.redirect('back')

    })

});




app.get('/cand_signup', (req, res) => {
    if (!req.user) {
        res.redirect('/')
    } else if (req.user.membership_active === 0) {
        res.render('cand_signup')
    } else {
        res.redirect('/success')
    }

});

app.get('/shop_signup', (req, res) => res.render('shop_signup'));


app.get('/business_:id', (req, res) => {

    let bus_id2 = req.query.bus_ID

    if (!req.user) {
        res.redirect('/')
    } else {

        let address_id = req.params.id
        let user_id = req.user.id || bus_id2

        if (address_id != user_id && req.user.is_admin != 1) {
            if (req.user.is_candidate) {
                res.redirect(`/user_${user_id}`)
            } else {

                res.redirect('/fail')
            }
        } else {
            let sql = `SELECT * FROM users WHERE id = ?`
            let sql2 = `SELECT * FROM users WHERE is_candidate = ?`
            let data = address_id
            let data2 = 1

            connection.query(sql, [data], function (err, result) {
                if (!result[0] || !result[0].membership_active) {
                    res.send('nothing')
                } else {
                    connection.query(sql2, [data2], function (err, candidates) {
                        if (err) {
                            res.send(err)
                        } else {

                            res.render('business', {
                                business: result,
                                candidates: candidates
                            })
                        }
                    })
                }
            })
        }
    }
});




app.get('/admin', isLoggedIn, (req, res) => {

    if (!req.user.is_admin == 1) {
        req.logOut()
        res.redirect('/')
    }

    let sql = `SELECT * FROM users WHERE is_candidate = ?`
    let data = 1

    connection.query(sql, data, (err, users) => {
        if (err) {
            res.sendStatus(404)
        } else {
            res.render('adminmain', { candidates: users })
        }
    })
})



app.get('/admin_business', isLoggedIn, (req, res) => {

    if (!req.user.is_admin == 1) {
        req.logOut()
        res.redirect('/')
    }

    let sql = `SELECT * FROM users WHERE is_business = ?`
    let data = 1

    connection.query(sql, data, (err, users) => {
        if (err) {
            res.sendStatus(404)
        } else {
            res.render('adminbusiness', { business: users })
        }
    })
})







app.get('/user_:id', (req, res, err) => {


    let user_id2 = req.query.user_ID



    if (!req.user) {
        res.redirect('/')
    } else if (req.user.id != req.params.id && (req.user.is_business === 0 && req.user.is_admin === 0)) {
        res.redirect('/')
    } else {
        let address_id = req.params.id
        let user_id = req.user._id || user_id2

        let sql = `SELECT * FROM users WHERE id = ?`

        let data = address_id

        connection.query(sql, [data], function (err, result) {
            if (!result[0] || !result[0].membership_active) {
                res.send(404)
            } else {
               console.log (`currentUser.like${result[0].id}`)
                res.render('user', { 
                    candidate: result,
                    buttonTest: `currentUser.like${result[0].id}`
                })
                
            }

        })
    }
});


app.get('/adminuser_:id', isLoggedIn, (req, res, err) => {

    let user_id2 = req.query.user_ID

    if (!req.user.is_admin == 1) {
        req.logOut()
        res.redirect('/')
    }
    let address_id = req.params.id
    let user_id = req.user._id || user_id2

    let sql = `SELECT * FROM users WHERE id = ?`

    let data = address_id

    connection.query(sql, [data], function (err, result) {
        if (!result[0]) {
            res.send(404)

        } else if (result[0].is_candidate == 0) {
            req.flash('error', 'User is not a candidate')
            res.redirect('/admin')

        } else {
            res.render('adminuser', { candidate: result })
        }

    })
})



app.post('/cand_signup', (req, res) => {
    if (req.user.membership_active === 0 && req.user.is_candidate === 1) {

        if (!req.body.checkbox) {
            return res.redirect('back')
        }


        let array1 = req.body.checkbox
        let emptiedArray = ""

        for (var i = 0; i < array1.length; i++) {
            emptiedArray = emptiedArray + "," + array1[i] + '.'
            emptiedArray = emptiedArray.slice(0, -1)
        }




        let sql = `UPDATE users 
        SET 
        coffee = ?,
        award = ?,
        tool = ?,
        country = ?,
        city = ?,
        position = ?, 
        bean = ?, 
        experience = ?,
        description = ?,
        membership_active = ?, 
        is_business = ?, 
        is_admin = ?,
        visastatus = ?,
        previousex = ?, 
        speciality = ?,
        phone = ?,
        available = ?,
        rout = ?
        WHERE id = ?`;

        let data = [
            req.body.drink, req.body.award, req.body.tool, req.body.country,
            req.body.city, req.body.position, req.body.bean, req.body.experience,
            req.body.description, 1, 0, 0, req.body.visaradios, emptiedArray, req.body.speciality, req.body.phone, req.body.available, req.body.rout, req.user.id
        ];

        // execute the UPDATE statement
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            res.redirect('/success')
        })
    }
})


app.get('/user_:id/edit', isLoggedIn, (req, res) => {
    if (req.params.id != req.user.id) {
        req.logOut();
        res.redirect('/')
    }
    let sql = `SELECT * FROM users WHERE id = ? `
    let data = req.user.id

    connection.query(sql, data, (err, user) => {
        res.render('cand_edit', { candidate: user })
    })
});

app.post('/user_:id', isLoggedIn, (req, res) => {

    if (!req.body.checkbox) {
        return res.redirect('back')
    }

    let array1 = req.body.checkbox
    let emptiedArray = ""

    for (var i = 0; i < array1.length; i++) {
        emptiedArray = emptiedArray + "," + array1[i] + '.'
        emptiedArray = emptiedArray.slice(0, -1)
    }

    console.log(emptiedArray)

    let sql = `UPDATE users 
        SET 
        coffee = ?,
        award = ?,
        tool = ?,
        country = ?,
        city = ?,
        position = ?, 
        bean = ?, 
        experience = ?,
        description = ?,
        phone = ?,
        visastatus = ?,
        previousex = ?, 
        speciality = ?,
        available = ?,
        rout = ? 
        WHERE id = ?`;

    let data = [
        req.body.drink, req.body.award, req.body.tool, req.body.country,
        req.body.city, req.body.position, req.body.bean, req.body.experience,
        req.body.description, req.body.phone, req.body.visaradios, emptiedArray, req.body.speciality, req.body.available, req.body.rout, req.user.id
    ];



    // execute the UPDATE statement
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        res.redirect('/success')
    })
})


app.get('/business_:id/edit', isLoggedIn, (req, res) => {
    if (req.params.id != req.user.id) {
        req.logOut();
        res.redirect('/')
    }
    let sql = `SELECT * FROM users WHERE id = ? `
    let data = req.user.id

    connection.query(sql, data, (err, user) => {
        res.render('shopedit', { business: user })
    })
});

app.post('/business1_:id', isLoggedIn, (req, res) => {

    let sql = `UPDATE users 
        SET 
        company_name = ?,
        email = ?,
        phone = ?,
        country = ?,
        city = ?, 
        employees_number = ?,
        ideal = ?
        WHERE id = ?`;

    let data = [
        req.body.name, req.body.email, req.body.phone, req.body.country,
        req.body.city, req.body.numemp, req.user.ideal, req.user.id
    ];



    // execute the UPDATE statement
    connection.query(sql, data, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        req.flash('success', 'Details Changed')
        res.redirect('/success')
    })
})






app.get('/success', (req, res) => {
    if (!req.user) {
        res.redirect('/')

    } else if (req.user.is_admin == 1) {
        res.redirect('/admin')
    } else if (req.user.is_candidate && req.user.membership_active == 0) {
        res.redirect('/cand_signup')
    } else {
        if (req.user.is_candidate === 1) {
            let user_ID = req.user.id;
            res.redirect(url.format({
                pathname: `/user_${user_ID}`,
                query: {
                    user_ID: user_ID
                }
            }))
        } else {
            let bus_ID = req.user.id
            res.redirect(url.format({
                pathname: `/business_${bus_ID}`,
                query: {
                    bus_ID: bus_ID

                }
            }))
        }

    }
});




//like post 

app.post('/likebutton', (req, res) => {

    let sql = `
    SELECT email,fname,lname,company_name,phone,country,city
    FROM users
    WHERE id = ?
    `
    let client = req.body.client
    let barista = req.body.barista

    let sql2 = `
    ALTER TABLE
    users ADD COLUMN 
    IF NOT EXISTS like${barista} VARCHAR(255)
    `
    
    let sql3 = `
    UPDATE users 
    SET like${barista} = ?
    WHERE id = ? 
    `
    

    let data = [1,client]

    connection.query(sql, client, (err, found) => {
        if (err) {
            req.flash('error', 'unable to like user')
            res.redirect('back')
        }
        connection.query(sql, barista, (err, found2) => {
            if (err) {
                req.flash('error', 'unable to like user')
                res.redirect('back')
            }
            likeNotification(found,found2)
            connection.query(sql2, data, (err,result) => {
                if(err){
                    res.redirect('back')
                }
                console.log(result)
                connection.query(sql3,data,(err,result) =>{
                    if(err){
                        res.redirect('back')
                    }
                    console.log(result)
                })
            })
        })
    })
})








//multer upload routes



app.post('/dp', (req, res, err) => {
    upload(req, res, (err) => {
        if (err || !req.file) {
            req.flash('error', 'jpeg,jpg or png only')
            res.redirect('back')
        } else {
            let sql = `UPDATE users 
            SET 
            display_path = ?
            WHERE id = ?`;

            let data = [
                req.file.path, req.user.id
            ];

            // execute the UPDATE statement
            connection.query(sql, data, (err, results) => {
                if (err) {
                    req.flash('error', 'jpeg,jpg or png only');
                }
                req.flash('success', 'Picture Uploaded')
                res.redirect('back')
            })
        }
    })
});

app.post('/vid', (req, res) => {
    upload2(req, res, (err) => {
        if (err) {
            res.redirect('back')
        } else {
            let sql = `UPDATE users 
            SET 
            video_path = ?
            WHERE id = ?`;

            let data = [
                req.file.path, req.user.id
            ];

            // execute the UPDATE statement
            connection.query(sql, data, (err, results) => {
                if (err) {
                    res.send(err);
                }
                res.redirect('back')
            })
        }
    })
});




//passport login/out routes

require('./routes/routes.js')(app, passport);


//nodemailer

app.post('/cv', withcv, (req, res) => {

    const cv = req.file;



    const output = `
    <p>You have a new cv from '${req.user.fname} ${req.user.lname}'</p>
    <h3>Contact Details<h3>
    <ul>
        <li>Name: ${req.user.fname} ${req.user.lname}</li>
        <li>Email: ${req.user.email}</li>
        <li>Number: ${req.user.number}</li>
        <li>City: ${req.user.city}</li>
    <ul>
    
    `



    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "mail.yallabarista.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'no-reply@yallabarista.com', // generated ethereal user
                pass: 'admin1289' // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });



        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `<${req.user.email}>`,
            to: "admin@yallabarista.com",
            subject: `Application - ${req.user.fname}`,
            cc: `${req.file.filename}`,
            html: output,
            attachments: [{
                filename: cv.originalname,
                contentType: cv.mimetype,
                encoding: cv.encoding,
                content: cv.buffer
            }]

        });





        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    }
    main().catch(console.error);


    let sql = `
    UPDATE users SET profilecomplete = ? WHERE id = ? 
    `
    let data = [
        1, req.user.id
    ]

    connection.query(sql, data, (err) => {
        if (err) {
            req.flash('error', 'upload failed')
            res.redirect('back')
        }
        req.flash('success', 'CV SENT')
        res.redirect('back')

    })


})




app.post('/contact', (req, res) => {


    const output = `
    <p>You have a new message from '${req.body.name}'</p>
    <h3>Personal Details<h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.formemail}</li>
        <li>Number: ${req.body.phone}</li>
        <li>City: ${req.body.city}</li>
        <li>I'm a: ${req.body.service}<li>
    <ul>

    <h1> Message </h1> 
    <p>${req.body.message} </p>
    
    `



    // async..await is not allowed in global scope, must use a wrapper
    async function main() {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "mail.yallabarista.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'no-reply@yallabarista.com', // generated ethereal user
                pass: 'admin1289' // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        });



        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `<${req.body.formemail}>`,
            to: "admin@yallabarista.com",
            subject: `${req.body.subject}`,
            html: output

        });





        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    }
    main().catch(console.error);

    res.redirect('back')
})

app.get('/forgot', function (req, res) {
    res.render('forgot');
});

app.post('/forgot', function (req, res, next) {

    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {

            let sql = `SELECT * FROM users WHERE email = ?`;
            let sql2 = `UPDATE users SET resetPasswordToken = ?, resetPasswordTokenExpires = ? Where email = ?`
            let data = req.body.email;
            let data2 = [
                token, Date.now() + 360000000, data
            ]


            connection.query(sql, data, function (err, user) {
                if (!user[0]) {
                    return (
                        req.flash('error', 'User doesn\'t exist'),
                        res.redirect('back')
                    )

                }
                connection.query(sql2, data2, (err) => {
                    done(err, token, user)
                    req.flash('success', 'Message Sent, Please check your email')
                });

            });



        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: "mail.yallabarista.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'no-reply@yallabarista.com', // generated ethereal user
                    pass: 'admin1289' // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            var mailOptions = {
                to: user[0].email,
                from: 'no-reply@yallabarista.com',
                subject: 'Yalla Barista Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                console.log('success', 'An e-mail has been sent to ' + user[0].email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

app.get('/reset/:token', function (req, res) {
    let sql = `SELECT * FROM users WHERE resetPasswordToken = ?`;
    let data = req.params.token

    connection.query(sql, data, function (err, user) {
        if (err || !user[0]) {
            req.flash('error', 'Invalid Token')
            res.redirect('/')
        }
        res.render('reset', { token: req.params.token });
    })
});

app.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            let sql = `SELECT * FROM users WHERE resetPasswordToken = ?`;
            let data = req.params.token
            connection.query(sql, data, function (err, user) {
                if (err || !user) {
                    res.redirect('/')
                }
                if (req.body.password === req.body.confirm) {

                    var newPassword = {
                        password: bcrypt.hashSync(req.body.password, null, null)
                    };
                    var insertQuery = `UPDATE users SET password = ? WHERE resetPasswordToken = ?`;
                    var sql2 = `UPDATE users SET resetPasswordToken = ?, resetPasswordTokenExpires =?  WHERE resetPasswordToken = ?`
                    var data2 = [
                        null, null, req.params.token
                    ]
                    connection.query(insertQuery, [
                        newPassword.password,
                        req.params.token
                    ], function (err, user) {
                        connection.query(sql2, data2, (err, results) => {
                            if (err) {
                                res.send(err)
                            }
                            res.render('changed')
                        })
                    })
                }

                else {
                    return res.redirect('/');
                }
            })

        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                host: "mail.yallabarista.com",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'no-reply@yallabarista.com', // generated ethereal user
                    pass: 'admin1289' // generated ethereal password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            console.log(user[0].email)
            var mailOptions = {
                to: user[0].email,
                from: 'no-reply@yallabarista.com',
                subject: 'Your password has been changed',
                text:
                    'This is a confirmation that the password for your account ' + user[0].email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                res.redirect('/success')
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/success');
    });
});

app.get('/payment', (req, res) => {
    res.render('payment')
});

app.post('/1x2e3c987xac78kl', (req, res) => {
    if (!req.user) {
        res.redirect('/')
    }

    if (req.user.is_business) {
        res.redirect('/contact-support')
    }

    if (req.user.is_candidate) {
        let sql = `UPDATE users 
            SET 
            premium = ?
            WHERE id = ?`;

        let data = [
            1, req.user.id
        ];

        // execute the UPDATE statement
        connection.query(sql, data, (err, results) => {
            if (err) {
                res.send(err);
            }
            req.flash('success', 'Payment Successful')
            res.redirect('/success')
        })
    }
});



//nodemailer functions 



function welcomeMessage() {
    var smtpTransport = nodemailer.createTransport({
        host: "mail.yallabarista.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'no-reply@yallabarista.com', // generated ethereal user
            pass: 'admin1289' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        to: req.user.email,
        from: 'no-reply@yallabarista.com',
        subject: 'Yalla Barista - Welcome',
        text: 'Thanks for signing up to Yalla Barista your one stop shop to finding great baristas to work in your cafe. Contact us on info@yallabarista.com if you have any enquiries.'
    }
    smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
    });
}


function pictureWarning() {
    var smtpTransport = nodemailer.createTransport({
        host: "mail.yallabarista.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'no-reply@yallabarista.com', // generated ethereal user
            pass: 'admin1289' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        to: userEmail,
        from: 'no-reply@yallabarista.com',
        subject: 'Yalla Barista - Display Picture Warning',
        text: `
        Your profile picture has been removed by admin as it has violated our terms and conditions. Please upload a new picture of yourself. 

        Regards,
        
        YallaBarista Team
        Info@yallabarista.com`
    }
    smtpTransport.sendMail(mailOptions, function (err) {
        console.log('mail sent');
        console.log('success', 'An e-mail has been sent to ' + user[0].email + ' with further instructions.');
        done(err, 'done');
    });
}


function likeNotification(x,y) {
    var smtpTransport = nodemailer.createTransport({
        host: "mail.yallabarista.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'no-reply@yallabarista.com', // generated ethereal user
            pass: 'admin1289' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        to: `admin@yallabarista.com`,
        from: 'no-reply@yallabarista.com',
        subject: 'Like Notification',
        text: `
        Business '${x[0].company_name}' has liked Barista '${y[0].fname} ${y[0].lname}'.

        Business details - ${x[0].company_name}
        Country          - ${x[0].country}
        Phone Number     - ${x[0].phone}
        Email            - ${x[0].email}



        Barista Name - ${y[0].fname} ${y[0].lname} 
        Country      - ${y[0].country}
        City         - ${y[0].city}
        Email        - ${y[0].email}
        Phone Number - ${y[0].phone}
        `
    }
    smtpTransport.sendMail(mailOptions, function (err) {
        console.log('mail sent');
        console.log('success', 'An e-mail has been sent to ' + user[0].email + ' with further instructions.');
        done(err, 'done');
    });
}



//nodemailer end ------------------

// function userRemover(){

//     let sql = `
//         DELETE FROM
//         users
//         WHERE 
//         coffee IS NULL
//         `
//     connection.query(sql,(err,found) => {
//         console.log(found)
//     });

// }

// userRemover()


app.get('/terms', (req, res) => {
    res.render('terms/terms')
})
app.get('/privacy', (req, res) => {
    res.render('terms/privacy')
})



app.get('*', function (req, res) {
    res.sendStatus(404)

});




app.listen(port, console.log(`server started on port ${port}`))