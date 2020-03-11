const express=require('express');
const app=express();

var bodyParser=require('body-parser');
const mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
    name: String,
    app_time: String,
    max_time:Number,
    imgurl:String
});

var salonSchema=new mongoose.Schema({
    name: String,
    address: String,
    website: String,
    img: String,
    slotusers:[userSchema]
});
var salon= mongoose.model("Salon", salonSchema);


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));


app.get('/',function(req,res){
    res.render('index.ejs');
});

app.get('/login',function(req,res){
    res.render('login.ejs');
});

app.get('/book',function(req,res){
    salon.find({},function(err,salons){
        if(err){
            console.log(err);
        }else{
            res.render('Book.ejs',{saloninfo:salons});
        }
    });
});

app.get('/book/:name',function(req,res){
    let salonname=req.params.name;
    salon.find({name:salonname},function(err,findsalon){
        if(err){
            console.log(err);
        }else{
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
                     name:req.body.usname,
                     app_time:req.body.aptime,
                     max_time:maximum_time,
                     imgurl:"/Img/unnamed.jpg"
                 };
    salon.find({name:salonname},function(err,findsalon){
        if(err){
                console.log(err);
        }else{
                findsalon[0].slotusers.push(new_req);
                findsalon[0].save(function(err,sa){
                    if(err){
                        console.log(err);
                    }
                });
                res.redirect(`/book/${salonname}`);
            }
    });    
});

mongoose.connect('mongodb+srv://dhyey:dhyey510@cluster0-1954n.mongodb.net/test?retryWrites=true&w=majority',
        {useNewUrlParser: true,useUnifiedTopology: true},
        ()=>{
    console.log(`mongoose connect `);
});


app.listen(3000,function(){
    console.log(`listening on 3000 : `);
});

