const express=require('express');
const app=express();
const path=require('path');
const session=require("express-session");
const mongoose=require('mongoose');
const passport=require('passport');
const localStrategy=require("passport-local");
const passportLocalMongoose=require('passport-local-mongoose');
const bodyParser=require('body-parser');
const multer=require('multer');

// passport config
app.use(session({
    secret:"Dhyey website",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

var slotSchema=new mongoose.Schema({
    username: String,
    imgurl:String,
    salonname:String,
    app_time: String,
    max_time:Number,
});

var userSchema=new mongoose.Schema({
    username: String,
    email:String,
    password:String,
    issalon:String,
    imgurl:String,
    address:String,
    website:String,
    slot:[slotSchema]
});
userSchema.plugin(passportLocalMongoose);

var User= mongoose.model("User", userSchema);
var slot=mongoose.model('slot',slotSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// multer
const storage=multer.diskStorage({
    destination:'./public/uploadas',
    filename : function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }   
});

const upload=multer({
    storage:storage
}).single('img-uploade');


app.get('/',function(req,res){
    res.render('index.ejs');
});

app.get('/about',function(req,res){
    res.render('about.ejs');
});

app.post('/feedback',function(req,res){
    console.log(`name : ${req.body.username}`);
    console.log(`email : ${req.body.email}`);
    console.log(`feedback : ${req.body.add}`);
    res.redirect('/');
});

app.get('/login',function(req,res){
    if(req.isAuthenticated()){
        if(req.user.issalon=="Salon"){
            res.redirect(`/${req.user.id}/editsalon`);
        }else{
            res.redirect(`/${req.user.id}/book`);
        }
    }else{
        res.render('login.ejs');
    }
});

app.post('/login',(req, res, next) => {
    passport.authenticate('local',
    (err, user, info) => {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.redirect('/login');
      }
  
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        if(user.issalon=="Salon"){
            return res.redirect(`/${user.id}/editsalon`);
        }else{
            return res.redirect(`/${user.id}/book`);
        }
      });
    })(req, res, next);
 });

app.post('/signup',function(req,res){
    upload(req,res,(err)=>{
        if(err){
            console.log(err);
            res.render('login.ejs');
        }else{
            let newUser=new User({
                email:req.body.email,
                imgurl:req.file.filename,
                username:req.body.username,
                issalon:req.body.issalon,
            });
            User.register(newUser,req.body.password,function(err,user){
                if(err){
                    console.log(err);
                    res.redirect('/login');
                }else{
                    passport.authenticate("local")(req,res,function(){
                        if(req.body.issalon == "Salon"){
                            res.redirect(`/${req.user.id}/editsalon`);
                        }else{
                            res.redirect(`/${req.user.id}/book`);
                        }
                    });    
                }
            });
        }
    });
});

app.get('/:id/editsalon',function(req,res){
    res.render('editsalon.ejs',{user:req.user});
});

app.post('/:id/savepro',function(req,res){
    let newUser={
        username:req.body.username,
        email:req.body.email,
        website:req.body.web,
        address:req.body.add
    };
    User.findByIdAndUpdate(req.params.id,newUser,function(err,user){
        if(err){
            console.log(err);
        }else{
            res.redirect(`/${req.user.id}/salonhome`);
        }
    });
});

app.get('/:id/salonhome',function(req,res){
    res.render('salonhome.ejs',{user:req.user});
});

app.get('/:id/:slotid/cnf',function(req,res){
    User.findById(req.params.id,function(err,user){
        for(let i=0;i<user.slot.length;i++){
            if(user.slot[i].id==req.params.slotid){
                user.slot.splice(i,1);
                user.save(function(err,us){
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect(`/${req.user.id}/salonhome`);
                    }
                });
                break;
            }
        }
    });
});



app.get('/:id/book',function(req,res){
    User.find({issalon:"Salon"},function(err,salons){
        if(err){
            console.log(err);
        }else{
            res.render('Book.ejs',{saloninfo:salons,user:req.user});
        }
    });
});

app.get('/book/:name',function(req,res){
    let salonname=req.params.name;
    User.find({username:salonname,issalon:"Salon"},function(err,findsalon){
        if(err){
            console.log(err);
        }else{
            console.log(findsalon);
            res.render('slot.ejs',{info:findsalon});
        }
    });
});

app.post('/book/:name',function(req,res){
    let salonname=req.params.name;
    let maximum_time=0;
    if(req.body.haircut==='on'){
        maximum_time=maximum_time+1;
    }
    if(req.body.shaving==='on'){
        maximum_time=maximum_time+1;
    }
    if(req.body.massage==='on'){
        maximum_time=maximum_time+1;
    }
    const new_req={
                     username:req.body.usname,
                     app_time:req.body.aptime,
                     max_time:maximum_time,
                     imgurl:req.user.imgurl
                 };
    User.find({username:salonname,issalon:"Salon"},function(err,findsalon){
        if(err){
                console.log(err);
        }else{
                findsalon[0].slot.push(new_req);
                findsalon[0].save(function(err,sa){
                    if(err){
                        console.log(err);
                    }
                });
                res.redirect(`/book/${salonname}`);
            }
    });    
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});





mongoose.connect('mongodb+srv://dhyey:dhyey510@cluster0-1954n.mongodb.net/test?retryWrites=true&w=majority',
        {useNewUrlParser: true,useUnifiedTopology: true},
        ()=>{
    console.log(`mongoose connect `);
});
mongoose.set('useCreateIndex', true);

app.listen(3000,function(){
    console.log(`listening on 3000 : `);
});

