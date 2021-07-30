import { Request, Response } from 'express';

const emisor = "leandro.marrero03@gmail.com";
const passwordEmisor = "4918981-5";

export const enviarMail = async (email: string, subject: string, password: string) => {
    // recibo el email del usuario, el tipo(si es crear usuario, recuperar pass, etc) y la pass generada de form random
    
// Le digo que template utilizar
    var template: string;
    if(subject === "Forgot password")
      template = 'ForgotPassword.html'  
    else
        template = 'Verify.html'
    
    var nodemailer = require("nodemailer");
    var handlebars = require("handlebars");
    var smtpTransport = require('nodemailer-smtp-transport');

    var fs = require("fs");

    var readHTMLFile = function (path:any, callback:any) {
        fs.readFile(path, { encoding: "utf-8" }, function (err:any, html:any) {
            if (err) {
                throw err;
                callback(err);
            }
            else {
                callback(null, html);
            }
        });
    };

    //Creamos el objeto de transporte
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      Host: 'smtp.gmail.com',
      auth: {
        user: emisor,
        pass: passwordEmisor
      }
    }));

    const remplacement = {
        verificar: "https://www.google.com",
        password: password
    }
    readHTMLFile(__dirname + '/views/'+template, function (err:any, html:any) {
        var template = handlebars.compile(html);
        var htmlToSend = template(remplacement);
        console.log(htmlToSend);
         var mailOptions = {
         from: emisor,
         to: email,
         subject: subject,
         html: htmlToSend
     };
        transporter.sendMail(mailOptions, function (error:any, response:any) {
            if (error) {
                console.log(error);
            }
        });
    });

}