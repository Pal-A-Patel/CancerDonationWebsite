var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose")

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}))

app.listen(3000, 'localhost', function () {
    console.log("server is running on http://localhost:3000");
})

mongoose.connect('mongodb://localhost:27017/project');
var db = mongoose.connection;

db.on('error', ()=>console.log("Error in Conencting to the Database."));
db.once('open', ()=> console.log("Connected to Database"));

app.post("/signup", (req,res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var loginid = req.body.loginid;
    var password = req.body.password;
    var loginas = req.body.loginas;

    var data = {
        "firstname": firstname,
        "lastname": lastname,
        "loginid": loginid,
        "password": password,
        "loginas": loginas
    }

    db.collection('signup').insertOne(data, (err,collection) =>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successffully");
    });

    return res.redirect('signup.html');

})


