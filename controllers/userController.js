const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const config = require("../config/config");
const { name } = require("ejs");

const sendResetPasswordMail = async(name , email , token) =>{
    try {
        
        const transport = nodemailer.createTransport( {
            host : "smtp.gmail.com",
            port: 587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
        });

        const mailOptions = {
            from:config.emailUser,
            to: email,
            subject:"Reset Password",
            html:'<p> HII  '+name+', Please click here to <a href="http://localhost:3000/reset-password?token='+token+'">Reset</a> your Password '
        }
        transport.sendMail(mailOptions , function (error , info) {
            if(error){
                console.log(error);
            } else {
                console.log("Email has been sent: - " , info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }

    
}


const loadLogin = async (req,res) => {
    try {
        res.render("login");
    } catch (error) {
       console.log(error.message); 
    }
}

const verifyLogin = async(req,res)=>{
    try {
        
        const email = req.body.email;
        const password = req.body.password;

       const userData = await User.findOne({email:email});

       if (userData) {
        
        const passwordMatch = await bcrypt.compare(password,userData.password);

          if (passwordMatch) {
            
            req.session.user_id = userData._id;
            req.session.user_id = userData.is_admin;
            if (userData.is_admin == 1) {
                res.redirect("/dashboard");
            } else {
                res.redirect("/profile"); 
            }
          } else {
        res.render('login' , {message:"Email and Password are incorrect"});
            
          }
       } else {
        res.render('login' , {message:"Email and Password are incorrect"});
       }

    } catch (error) {
        console.log(error.message);
    }
}

const profile = async (req,res) => {
    try {
        res.send("hi profile here");
    } catch (error) {
       console.log(error.message); 
    }
}

const logout = async(req,res)=>{
    try {
        
        req.session.destroy();
        res.redirect("/login");


    } catch (error) {
        console.log(error.message);
    }
}

const forgetLoad = async(req,res) => {
    try {
        
        res.render("forget-password");

    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordVerify = async(req,res) =>{
    try {
        
        const email = req.body.email;
       const userData = User.findOne({email:email});
       if (userData) {
        
        const randomString = randomstring.generate();

        await User.updateOne( {
            email:email
        } , {
            $set:{ token : randomString}
        });
        sendResetPasswordMail(userData.name , userData.email , randomString);
        res.render('forget-password', {message : "Please check your mail to reset your Password!"});

    
       } else {
           res.render("forget-password" , {message : "User Email is Incorrect!"});
       }

    } catch (error) {
        console.log(error.message);
    }
    
}
module.exports = {
    loadLogin,
    verifyLogin,
    profile,
    logout,
    forgetLoad,
    forgetPasswordVerify
}