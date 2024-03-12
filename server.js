
'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mysql');
const e = require('express');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const con = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Baroda123',
    database: 'project'

})

con.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
    
  });

  app.post('/postsignup', (req,res) => {
      var loged_in_as = req.body.loginas;
      if (loged_in_as == 'Staff'){
          let command1 = `INSERT INTO staff (firstname, lastname, loginid, password) VALUES ('${req.body.firstname}','${req.body.lastname}','${req.body.loginid}','${req.body.password}');`
          con.query(command1, (err) => {
              if(err){
                  console.log(err);
              }
              else{
                  console.log("New entry added to staff...");
              }
          })
      }

      else if ( loged_in_as == 'Donor'){
          let command2 = `INSERT INTO donor (firstname, lastname, loginid, password) VALUES ('${req.body.firstname}','${req.body.lastname}','${req.body.loginid}','${req.body.password}');`
          con.query(command2, (err) => {
              if(err){
                  console.log(err);
              }
              else{
                  console.log("New entry added to donor....")
              }
          })
      }
      
      else if (loged_in_as == 'Patient'){
          let command3 = `INSERT INTO patient (firstname, lastname, loginid, password) VALUES ('${req.body.firstname}','${req.body.lastname}','${req.body.loginid}','${req.body.password}');`
          con.query(command3, (err) =>{
              if(err){
                  console.log(err);
              }
              else{
                  console.log("New entry added to patient....");
              }
          })
      }
      
      let command = `INSERT INTO signup (firstname, lastname, loginid, password, loginas) VALUES ('${req.body.firstname}','${req.body.lastname}','${req.body.loginid}','${req.body.password}','${req.body.loginas}');`
      con.query(command, (err) =>{
          if(err){
              console.log(err);
          }
          else{
              console.log("New entry added....");
          }
      })
  })


  app.post('/update', (req,res) => {
	
    var user_or_staff = req.body.user_or_staff
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;
    var update_what = req.body.update_what;
    console.log(update_what,"of",username);
    
    if (user_or_staff=='donor' && update_what=="password"){
        
        var sql= "UPDATE donor SET password= '"+password+"' WHERE loginid= '"+username+"'";
        var sql1= "SELECT EXISTS(SELECT * from donor WHERE loginid='"+username+"')";
    }
    else if (user_or_staff=='donor' && update_what=="name"){
        var sql1= "SELECT EXISTS(SELECT * from donor WHERE loginid='"+username+"')";
        var sql= "UPDATE donor SET firstname= '"+name+"' WHERE loginid= '"+username+"'";
    }
    else if (user_or_staff=='donor' && update_what=="name_password"){
        var sql1= "SELECT EXISTS(SELECT * from donor WHERE  loginid='"+username+"')";			
        var sql= "UPDATE donor SET firstname= '"+name+"', password= '"+password+"' WHERE loginid= '"+username+"'";
    }
    else if (user_or_staff=='staff' && update_what=="password"){
        var sql1= "SELECT EXISTS(SELECT * from staff WHERE loginid='"+username+"')";
        var sql= "UPDATE staff SET password= '"+password+"' WHERE loginid= '"+username+"'";
    }
    else if (user_or_staff=='staff' && update_what=="name"){
        var sql1= "SELECT EXISTS(SELECT * from staff WHERE loginid='"+username+"')";
        var sql= "UPDATE staff SET firstname= '"+name+"' WHERE loginid= '"+username+"'";
    }
    else if (user_or_staff=='staff' && update_what=="name_password"){
        var sql1= "SELECT EXISTS(SELECT * from staff WHERE loginid='"+username+"')";
        var sql= "UPDATE staff SET firstname= '"+name+"', password= '"+password+"' WHERE loginid= '"+username+"'";
    }
    
    else{
        res.send("please select if you're updating a user profile or a staff profile and choose which fields to update");
        return;
    }
    

    
        con.query(sql1, function (err1, result1) {
            if (err1) {
                throw err1;
            }
            const data=Object.values(JSON.parse(JSON.stringify(result1)))[0];
            var firstKey = Object.keys(data)[0];
            if (data[firstKey]==1){
            
                con.query(sql, function (err, result) {
                    if (err) {
                        throw err;
                    }
                    else{
                         console.log("an account is updated");
                         res.send("Account updated successfully");
                         }
                })
            }
            else{
                
                res.send("the username you selected is invalid, please select another one")
            }
        })
    
});

  app.post('/DeleteAccount', (req,res) => {
		
    console.log("route found");
    
    var loginas = req.body.loginas;
    var loginid = req.body.loginid;
    
    if (loginas=='donor'){
        var sql = "DELETE FROM donor WHERE loginid='"+loginid+"'"; 
        var sql2 = "DELETE FROM signup WHERE loginid='"+loginid+"'";
        con.query(sql, function (err, result) {
            if (err) {
                console.log("donor account deletion failed ");
            }
            else{
                console.log("a customer account is deleted");}
        })
        con.query(sql2, (err, result) => {
            if(err){
                console.log("donor account deletion failed.");
            }
            else{
                console.log("donor account is deleted.")
            }
        })

            res.send("Account DELETED successfully");
    }
    
    else if (loginas=='staff'){
        var sql = "DELETE FROM staff WHERE loginid='"+loginid+"'";
        var sql2 = "DELETE FROM signup WHERE loginid='"+loginid+"'";
        con.query(sql, (err, result) => {
            if (err) {
                console.log("staff account deletion failed ");
            }
            else{
                console.log("a staff account was deleted.");}
            })
            con.query(sql2, (err, result) => {
                if(err){
                    console.log("donor account deletion failed.");
                }
                else{
                    console.log("donor account is deleted.")
                }
            })
            res.send("Account DELETED successfully");
        }
    
    else if (loginas == 'patient'){
        var sql = "DELETE FROM patient WHERE loginid='"+loginid+"'";
        var sql2= "DELETE FROM signup WHERE loginid = '"+loginid+"'";
        con.query(sql, (err, result) => {
            if (err) {
                console.log("patient account deletion failed ");
            }
            else{
                console.log("a patient account was deleted.");}
            })
        con.query(sql,  (err, result) => {
            if (err){
                console.log("staff account deletion failed")
            }
            else{
                console.log("a staff account was deleted.")
            }
        })
            res.send("Account DELETED successfully");
        }
    
        else{
        res.send("please select if you're a user or staff");
    }
});

        

  app.get('/getlogin', (req,res) => {
      let command = 'SELECT * FROM signup;'
      con.query(command, (err, result) => {
          if(err){
              console.log(err);
          }
          else{
              res.send(result);
          }
      }) 
  })

  app.post('/login', (req,res) => {
	console.log("checking credentials of ");
	
		var loginas = req.body.loginas
		var username = req.body.username;
		var password = req.body.password;
		
		
		if (loginas=='donor'){
			console.log("user credentials");
			var sql= "SELECT EXISTS(SELECT * from donor WHERE loginid='"+username+"' AND password='"+password+"')";
		}
		
		else if (loginas=='staff'){
			console.log("staff credentials");
			var sql= "SELECT EXISTS(SELECT * from staff WHERE loginid='"+username+"' AND password='"+password+"')";

		}
        else if (loginas == 'patient'){
            console.log("staff credentials");
            var sql = "SELECT EXISTS(SELECT * from patient WHERE loginid='"+username+"' AND password='"+password+"')";
        }
		else{
			res.send("please select if you're a donor/staff or user.");
			return;
		}
		

    	con.query(sql, function (err, data) {
    		if (err) throw err;
    		
    		const result=Object.values(JSON.parse(JSON.stringify(data)))[0];
    		var firstKey = Object.keys(result)[0];
    		  		
    		if (result[firstKey]==1){
  				console.log("identity verified");
  				res.send("verified");	
  			}
  			else{
  				console.log("not found");
				res.send("not found");
  			}
  		});
        
    });

    var sorted;

    app.post('/sortMessages', (req, res) => {
        if (req.body.order === "ascending"){
            sorted = `SELECT * FROM signup ORDER BY ${req.body.column} ASC;`
        } else if (req.body.order === "descending"){
            sorted = `SELECT * FROM signup ORDER BY ${req.body.column} DESC;`
        } else {
            sorted = 'SELECT * FROM signup;'
        }
    })
    
    app.get('/sortedLogs', (req, res) => {
        con.query(sorted, function (err, result) {
            if (err) {
                throw err
            }
            res.send(result);
        })
    })

    app.get("/donations", (req,res) => {
        let sql6 = 'SELECT * FROM donate;'
        con.query(sql6, (err, result) => {
            if(err){
                console.log(err);
            }
            else{
                res.send(result);
            }
        })
    })

    app.post("/donate", (req,res) => {
        let sql1 = `INSERT INTO donate (firstname, lastname, loginid, amount) VALUES ('${req.body.firstname}','${req.body.lastname}','${req.body.loginid}','${req.body.amount}');`
        con.query(sql1, (err,result) => {
            if(err){
                console.log(err);
            }
            else{
                console.log("New entry added..");
            }
        })
        
    })



app.use('/', express.static('./'));

app.listen(3000, 'localhost', function () {
    console.log("server is running on http://localhost:3000");
})
