var express= require('express');
var app=express();
var MongoClient = require('mongodb').MongoClient
var bodyParser=require('body-parser')
var expressValidator=require('express-validator');
var json2table = require('json-to-table');
var tableify = require('tableify');
app.use(expressValidator());
var urlEncoderParser=bodyParser.urlencoded({extended:false})
var URL = 'mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb'


app.get("/", function(req, resp){
  console.log("homepage")
  resp.sendFile(__dirname+"/"+"page.html");
});

app.get("/index.html", function(req, resp){
  resp.sendFile(__dirname+"/"+"index.html");
});

app.get("/Update.html", function(req, resp){
  resp.sendFile(__dirname+"/"+"Update.html");
});

app.get("/delete.html", function(req, resp){
  resp.sendFile(__dirname+"/"+"delete.html");
});



app.get("/response", function(req, resp){
  req.checkBody("name", "invalid").isAlpha().isEmpty();

  var name=req.query.name;  
  var branch=req.query.branch;
  var sport=req.query.sport;
  var USN=req.query.USN;
  console.log(name+branch+USN+sport);

  
  MongoClient.connect(URL, function(err, db){
    var collection =db.collection('sportD');
    collection.insert({"name":name, "_id":USN, "branch":branch, "sport":sport}, function(err, val){
      if(err) console.log(err);
      else {
        //resp.send(val);
        var output="<html><h1>You just added the following values:</h1><body>Name:"+name+ "<br>USN:"+USN+"<br>Branch:"+branch+"<br>Sport:"+sport+"</body><br><a href=/>Back</a></html>";
        resp.send(output);
      }

          
    });
    db.close();

  })
  // backLink="http://localhost:5000"
  // resp.end("<a href="+backLink+">Back</a>");
  
});

app.get("/updateForm", function(req, resp){
  req.checkBody("name", "invalid").isAlpha().isEmpty();
  var name=req.query.name;  
  var branch=req.query.branch;
  var sport=req.query.sport;
  var USN=req.query.USN;
  console.log(name+branch+USN+sport);

  
  MongoClient.connect(URL, function(err, db){
    var collection =db.collection('sportD');
    
    collection.update({"name":name}, {$set: {"name":name, "_id":USN, "branch":branch, "sport":sport}} , function(err, val){
     if(err) console.log(err);
     else {
       if(val.result['nModified']!=0){
          var output="<html><h1>We just updated the value to:</h1><body>Name:"+name+ "<br>USN:"+USN+"<br>Branch:"+branch+"<br>Sport:"+sport+"</body><br><a href=/>Back</a></html>";
          resp.end(output);
        }
        else {
          var newUrl=("/response?"+req.url.split('?')[1]);
          console.log(newUrl);
          var output="<h1>Do you want to add this to DB</h1><br><a href="+newUrl+">Click me </a><br><a href=/>Back</a>";
          
          console.log(output)
          resp.end(output);
        }
     } 

          
    });
    db.close();

  })
  // backLink="http://localhost:5000"
  // resp.end("<a href="+backLink+">Back</a>");
  
});

app.get("/deleteForm", function(req, resp){
  req.checkBody("USN", "invalid").isAlpha().isEmpty();
  
  var USN=req.query.USN;
  

  
  MongoClient.connect(URL, function(err, db){
    var collection =db.collection('sportD');
    
    collection.remove({"_id":USN},  function(err, val){
     if(err) console.log(err);
     else resp.end("<h1>value deleted</h1><br><a href=/>Back</a>");

          
    });
    db.close();

  })
  // backLink="http://localhost:5000"
  // resp.end("<a href="+backLink+">Back</a>");
  
});

app.get("/display1.html", function(req, resp){
  
  
  MongoClient.connect(URL, function(err, db){
    if(err) throw err;
    var collection =db.collection('sportD');
    var a=collection.find().toArray(function(err, i){
      if(err){console.log('err') }
      else{
        var d=i;
        var data=json2table(d);
        
        resp.send(tableify(data))
      }
    });
    console.log(a);
    
    db.close();
          
    });
    

})
 
  


var server=app.listen(5000, function(){
  var host=server.address().address;
  var port=server.address().port;
})

