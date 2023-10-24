const blogSetting = require("../models/blogSettingModel");

const isBlog = async(req , res , next)=>{
    try{

       const blog_setting = await blogSetting.find({});
       if (blog_setting.length == 0 && req.originalUrl != "/blog-setup") {
        res.redirect("/blog-setup");
        
       }else{
        next();
       }
    } catch(error){
        console.log(error.message);
    }
}

module.exports = {
    isBlog
}