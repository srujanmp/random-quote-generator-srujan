                                               
let express = require('express');
let app = express();
let mongoose = require('mongoose');
require('dotenv').config();
let bodyParser = require('body-parser');
app.use('/src',express.static(__dirname+'/src'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

mongoose.connect(process.env.MONGO_URI);
let max=34;let min=1;
let quoteSchema = new mongoose.Schema({   //created quote schema
    no: Number,
    quote: String
});

let quote = mongoose.model('quote', quoteSchema);  //created quote model
app.use(bodyParser.urlencoded({ extended: false })); //to get input from html body

app.get('/',async(req,res)=>{
    let randno=Math.floor(Math.random() * (max - min + 1)) + min;
    let getquote=await quote.findOne({ no: randno});
    res.render(__dirname+'/index.html',{quote:getquote.quote});
});

app.get('/json',async(req,res)=>{
    let randno=Math.floor(Math.random() * (max - min + 1)) + min;
    let getquote=await quote.findOne({ no: randno});
    res.json({quote:getquote.quote});
});









app.get('/post', (req, res) => {
    res.sendFile(__dirname + '/postquote.html');  //serves index.html at root
})
app.post('/postquote',async(req,res)=>{
    let quoteexist = await quote.findOne({ quote: req.body.quote });
    if(quoteexist){
        return res.send('quote aldready exists');
    }
    if(req.body.pin!=process.env.PIN){
        return res.sendFile(__dirname+'/index.html');
    }
    let newquote = new quote({ no: req.body.no, quote: req.body.quote });
    newquote.save().then((result) => {console.log("QUOTE SUBMITTED");}).catch((err) => {console.log(err);});
    
    res.sendFile(__dirname + '/postquote.html');
})


app.listen(8000);

