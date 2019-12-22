require('./db');//加载db.js
var T = require("./tools");    
var vcode = ""; 
var mongoose = require('mongoose'); //引入对象
var TodoModel = mongoose.model('user');//引入模型

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.render('index');
    });
    app.get('/index',(req,res)=> {
        res.render('index');
    });  
    app.get('/Library',(req,res)=> {
        res.render('Library');
    });
    app.get('/Statuses',(req,res)=> {
        res.render('Statuses');
    });
    app.get('/ContentDetail',(req,res)=> {
        res.render('ContentDetail');
    });
    app.get('/Forum',(req,res)=> {
        res.render('Forum');
    });
    app.get('/BookDetail',(req,res)=> {
        res.render('BookDetail');
    });
    app.get('/login',(req,res)=> {
        res.render('login');
    });
    app.get('/register',(req,res)=> {
        res.render('register');
    });

    //注册邮箱+验证码
    app.get('/email', (req, res) => {
        //判断邮箱是否已经注册
        TodoModel.find({email: req.query.email}).exec(function(err, aa) {
            if (!aa.length == 0) {
                res.send("IsSignedEmail");
            }
            else {
                // 生成验证码
                vcode = T.CreateVCode();
                console.log('vertifyCode:'+vcode);
                // 发送邮件
                T.sendMail(vcode, req.query.email);
            }
        });
    });

    //注册信息项校验
    app.post('/signupProcess', function(req, res) {
        if (!T.CheckMail(req.body.email)) { 
            res.send("邮箱错误");           
        }
        else if (!T.CheckPwd(req.body.pwd,req.body.cfmpwd)) {
            res.send("密码错误");
        }
        else {
            //存入jason文件            
            T.writetojason(req.body);        
            //存入数据库
            new TodoModel({ //实例化对象，新建数据
                email: req.body.email,
                password: req.body.pwd,
                updated_at: Date.now()
            }).save();            
            res.send("recieved your request!");
        }
    });

    //登录判断
    app.post('/login', function(req,res) {
        //是否已注册
        TodoModel.find({email: {$eq: req.body.email}}).exec(function(err, rs) {    
            if (!rs.length == 0) {
                if (rs[0].password == req.body.password) {
                    res.render('index', {username: req.body.email});
                }
                else {
                    res.send("密码错误");
                }
            }
            else {
                res.redirect('login'); 
            }
        });
    });

    app.get('/errpage', (req, res) => {
        res.send("邮箱错误");
    });
};

