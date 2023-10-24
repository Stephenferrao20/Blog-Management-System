const express = require("express");
const admin_route = express();
const bodyParser = require("body-parser");


admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

const session = require("express-session");

const config = require("../config/config");

admin_route.use(session({
    secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}));

admin_route.set("view engine" , "ejs");
admin_route.set("views" , "./views");

const multer = require("multer");
const path = require("path");

admin_route.use(express.static("public"));

const storage = multer.diskStorage({
    destination:(req , res , cb) => {
        cb(null , path.join(__dirname,"../public/images"));
    },
    filename:(req , file , cb) => {
        const name = Date.now()+"-"+ file.originalname;
        cb(null , name);
    }
});

const upload = multer({storage:storage});

const adminController = require("../controllers/adminController");

const adminLoginAuth = require("../middleware/adminLoginAuth");


admin_route.get("/blog-setup" , adminLoginAuth.isLogin , adminController.blogSetup);
admin_route.post("/blog-setup" ,upload.single("blog_image"), adminController.blogSetupSave);

admin_route.get("/dashboard", adminController.dashboard);

admin_route.get("/create-post"  , adminController.loadPostDashboard);
admin_route.post("/create-post"  , adminController.addPost);

admin_route.post('/upload-post-image' , upload.single("image") , adminController.uploadPostImage);
admin_route.post('/delete-post' , adminController.deletePost);

admin_route.get("/edit-post/:id" , adminController.loadEditPost);

admin_route.post('/update-post' , adminController.updatePost);

admin_route.get("/settings" , adminController.loadSettings);

admin_route.post("/settings" , adminController.saveSettings);



module.exports = admin_route;