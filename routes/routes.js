const nodemailer = require("nodemailer");

module.exports = function (app, passport) {


    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/success',
        failureRedirect: '/success',
        failureFlash: true
    }),
        function (req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });


    app.post('/startform', welcomeMessageBarista , passport.authenticate('local-signup', {
        successRedirect: '/success',
        failureRedirect: '/success',
        failureFlash: true
    }))

    app.post('/business_signup', welcomeMessageBusiness, passport.authenticate('business-signup', {
        successRedirect: '/success',
        failureRedirect: '/success',
        failureFlash: true

    }));


    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    })
};


function welcomeMessageBusiness(req,res,next) {
    var smtpTransport = nodemailer.createTransport({
        host: "mail.yallabarista.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'mailer@yallabarista.com',
            pass: 'admin1289' 
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        to: req.body.email,
        from: 'mailer@yallabarista.com',
        subject: 'Yalla Barista - Welcome',
        text: 'Thanks for signing up to Yalla Barista your one stop shop to finding great baristas to work in your cafe. Contact us on info@yallabarista.com if you have any enquiries'
    }
    smtpTransport.sendMail(mailOptions, function (err) {
        
    });

    next()
}

function welcomeMessageBarista(req,res,next) {
    var smtpTransport = nodemailer.createTransport({
        host: "mail.yallabarista.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'no-reply@yallabarista.com',
            pass: 'admin1289' 
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions = {
        to: req.body.email,
        from: 'mailer@yallabarista.com',
        subject: 'Yalla Barista - Welcome',
        text: 'Thanks for signing up to Yalla Barista your one stop shop to finding great baristas to work in your cafe. Contact us on info@yallabarista.com if you have any enquiries'
    }
    smtpTransport.sendMail(mailOptions, function (err) {
        
    });

    next()
}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}