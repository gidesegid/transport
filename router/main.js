
var express=require('express');
var bodyParser=require('body-parser');
//var mysql=require('mysql');
const fs           = require('fs');
const path         = require('path');
const uuid         = require('node-uuid');
const md5  = require('md5');
const sha1 = require('sha1');
var multer = require('multer');
var db = require('../models/db.js');

// var bodyParser = require('body-parser');
var upload = multer({ dest: './public/userImage' });
// var connection=mysql.createConnection({
//   host:'localhost',
//   user:'root',
//   password:'wedisegid',
//   database:'transport'
// });
// connection.connect(function(error){
//   if(!!error){
//     console.log('Error');
//   }else{
//     console.log('connected');
//   }
// })


module.exports = function(app)
{
      app.get('/',function(req,res){
        res.render('login.html')
     });

   app.use(bodyParser.json());
  //loading images   
     var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './upload');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
      });

      var upload = multer({ //multer settings
                      storage: storage
                  }).single('file');

      /** API path that will upload the files */
      app.post('/upload', function(req, res) {
          upload(req,res,function(err){
              if(err){
                   res.json({error_code:1,err_desc:err});
                   return;
              }
               res.json({error_code:0,err_desc:null});
          });
      });
  //login
    const myPasswordHash = md5('transport-application');
    app.get('/login/:username/:password',function(req,res){
      var username=req.params.username;
      var password=sha1(req.params.password+'-'+username);
      console.log(db)
      db.connection ( function (error, connection) {
              connection("select username,name,password,id from users where username='"+username+"' and password='"+password+"'",function(error,row,fields){
              if(!!error){
                  console.log('error in query'+error)
                }else if(row.length>0){
                  
                   console.log(row);
                   res.json(row)
                  
                  
                  //res.redirect('/index.html')
                    
                }else{
                   res.send('no');
                  console.log("no result")
                }
      })
      })

    })
  //identify if the user is a client
     app.get('/clientId/:userId',function(req,res){
       var userId=req.params.userId;
       db.dbconnection.query("select Id from needtranslation where userId='"+userId+"'",function(error,row,fields){
              if(!!error){
                  console.log('error in query'+error)
                }else if(row.length>0){
                  
                   console.log(row);
                   res.json(row)
                  
                    
                }else{
                   res.json('not registered');
                  console.log("not registered")
                }
      })
    })
//identify if the user is professional   
   app.get('/professionId/:userId',function(req,res){
      var userId=req.params.userId;
       connection.query("select Id from translators where userId='"+userId+"'",function(error,row,fields){
            if(!!error){
                console.log('error in query'+error)
              }else if(row.length>0){
                
                 console.log(row);
                 res.json(row)
                
              }else{
                 res.json('not registered in professions');
                console.log("not registered in professions")
              }
        })
    })
//registering a user
    app.post('/register/:name/:username/:email/:password',function(req,res){
      var name=req.params.name;
      var username=req.params.username;
      var email=req.params.email;
      var password=sha1(req.params.password+'-'+username);
      console.log(password);
     
      connection.query("insert into users(name,username,email,password)values('"+name+"','"+username+"','"+email+"','"+password+"')",function(error,row,fields){
          if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                }
      })
    })
    //insert traveller contact information to contacts table
    app.post('/contactinfo',function(req,res){
          
            var userId=req.body.userId;
            var transport=req.body.transport;
            var cityFromName=req.body.cityFromName
            var cityToName=req.body.cityToName;
            var cDate=req.body.convertDate;
            var firstName=req.body.firstName;
            var lastName=req.body.lastName;
            var tele=req.body.tele;
            var email=req.body.email;
            var preferedtransportName=req.body.preferedtransportName;
            var code=req.body.code;
            connection.query("insert into contacts(userId,name,email,telephone,date,fromPlace,toPlace,preferedTransport,transportChoosed,code) values('"+userId+"'"+","+"'"+firstName+"'"+","+"'"+email+"'"+","+"'"+tele+"'"+","+"'"+cDate+"'"+","+"'"+cityFromName+"'"+","+"'"+cityToName+"'"+","+"'"+preferedtransportName+"'"+","+"'"+transport+"'"+","+"'"+code+"')",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                }
              });
      })
//insert transport owner information to the transporttype table
      app.post('/transOwnerInfo',function(req,res){
            var userId=req.body.userId
            var ownerTransportName=req.body.ownerTransportName;
            var ownercityFromName=req.body.ownercityFromName;
            var ownerCityToName=req.body.ownerCityToName;
            var ownerDate=req.body.ownerDate
            var activeFromTo=req.body.activeFromTo
            var numberOfSeats=req.body.numberOfSeats
            var additionalInfo=req.body.additionalInfo
            var ownerCode=req.body.ownerCode
            connection.query("insert into transporttype(userId,type,numberOfSeats,date,activeFromToTime,fromPlace,toPlace,additionalInfo,code) values('"+userId+"'"+","+"'"+ownerTransportName+"'"+","+"'"+numberOfSeats+"'"+","+"'"+ownerDate+"'"+","+"'"+activeFromTo+"'"+","+"'"+ownercityFromName+"'"+","+"'"+ownerCityToName+"'"+","+"'"+additionalInfo+"'"+","+"'"+ownerCode+"')",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                }
              });
      })
//look up for transportaion,transportLookUp
  app.get('/transportLookUp/:date/:cityFrom/:cityTo/:transportModel',function(req,res){
        var date=req.params.date
        var cityFrom=req.params.cityFrom;
        var cityTo=req.params.cityTo
        var transportModel=req.params.transportModel
        console.log(date)
        console.log(cityFrom)
        console.log(cityTo)
        console.log(transportModel)
        connection.query("SELECT   date, fromPlace, toPlace, COUNT(toPlace) AS numberOfPeople,transportChoosed FROM   contacts GROUP BY date, fromPlace, toPlace,transportChoosed HAVING   (date ='"+date+"')  AND (fromPlace = '"+cityFrom+"') AND (toPlace = '"+cityTo+"') AND (transportChoosed = '"+transportModel+"')",function(error,row,fields){
              if(!!error){
                res.json(error);
              }else{
                console.log("transportLookUp")
                res.json(row);
              }
        })
  })
//roughly transport lookup
    app.get('/roughTransportLookupTo/:date/:cityTo/:transportModel',function(req,res){
          var date=req.params.date
          var cityTo=req.params.cityTo
          var transportModel=req.params.transportModel
          connection.query("SELECT   toPlace, COUNT(toPlace) AS numberOfPeople, date, transportChoosed FROM   contacts GROUP BY toPlace, date, transportChoosed HAVING        (transportChoosed = '"+transportModel+"') AND (date = '"+date+"') AND (toPlace = '"+cityTo+"')",function(error,row,fields){
                if(!!error){
                  res.json(error);
                }else{
                  console.log("transportLookupTo")
                  res.json(row);
                }
          })
    })
//insert contacts who need translators or documents to translate To THE TABLE NEEDTRANSLATION
      app.post('/contactinfoTranslating',function(req,res){
            var userId=req.body.userId
            var firstName=req.body.firstName
            var tele=req.body.tele
            var email=req.body.email
           
            var livesIn=req.body.livesIn
           
            var profession="No Profession";
            var translated="No";
            var lookingFor=req.body.lookingFor;
           // this.insertedId;
            connection.query("insert into needtranslation(userId,name,email,telephone,livesIn,lookingFor) values('"+userId+"'"+","+"'"+firstName+"'"+","+"'"+email+"'"+","+"'"+tele+"'"+","+"'"+livesIn+"'"+","+"'"+lookingFor+"')",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                 
                   res.json(row.insertId);
                   console.log(row.insertId)
                }
              });
      });
//insert into contacttimeappointment table in the database 
  app.post('/contacttimeappointment',function(req,res){
          var contactId=req.body.contactId;
          var date=req.body.date
          var timeFrom=req.body.collectionDate
          var timeTo=req.body.collectionDate1
       connection.query("insert into contacttimeappointment(contactId,date,timeFrom,timeTo) values('"+contactId+"','"+date+"','"+timeFrom+"','"+timeTo+"')",function(error,row,fields){
          if(!!error){
              console.log('error in query'+error)
            }else{
               console.log('succesfully connected');
             
               res.json(row.insertId);
               console.log(row.insertId)
            }
       });
  })
//insert contact issue      
       app.post('/contactissues',function(req,res){
              var contactId=req.body.contactId;
              var remarks=req.body.remark
              var issue=req.body.issue
           connection.query("insert into contactissues(contactId,remarks,description) values('"+contactId+"','"+remarks+"','"+issue+"')",function(error,row,fields){
              if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                 
                   res.json(row.insertId);
                   console.log(row.insertId)
                }
           });
      })
//insert to professionalMonth 
      app.post('/professionalMonth',function(req,res){
              var contactId=req.body.contactId;
              var fromMonth=req.body.fromMonth;
              var toMonth=req.body.toMonth;
           connection.query("insert into professionalsworkingmonths(contactId,fromMonth,toMonth)values('"+contactId+"','"+fromMonth+"','"+toMonth+"')",function(error,row,fields){
                if(!!error){
                  res.json(error)
                }else{
                  res.json(row);
                  console.log(row)
                }
            });
      })
//insert to professionalDate 
      app.post('/professionalDate',function(req,res){
        var contactId=req.body.contactId
        var fromDate=req.body.fromDate;
        var toDate=req.body.toDate
           connection.query("insert into professionalworkingdate(contactId,fromDate,toDate)values('"+contactId+"','"+fromDate+"','"+toDate+"')",function(error,row,fields){
                    if(!!error){
                      res.json(error)
                    }else{
                      res.json(row);
                      console.log(row)
                    }
              });
      })
//insert to professionalworkstyle
      app.post('/professionworksession',function(req,res){
        var contactId=req.body.contactId
        var worksession=req.body.worksession
        console.log("work Session = "+worksession);
        console.log("contact id = "+contactId);
          connection.query("insert into professionalworksession(contactId,professionalworksin)values('"+contactId+"','"+worksession+"')",function(error,row,fields){
              if(!!error){
                res.json(error)
              }else{
                res.json(row);
                console.log(row)
              }
          });
      })
//getting contact id from needtranslation table 
      app.get('/userContactId/:userId',function(req,res){
        var userId=req.params.userId
           connection.query("select Id from needtranslation where userId='"+userId+"'",function(error,row,fields){
                    if(!!error){
                      res.json(error)
                    }else{
                      res.json(row);
                      console.log(row)
                    }
              });
      })
//Get information of contact who need translators
       app.get('/getContactId/:firstName/:lastName/:tele/:email/:remark',function(req,res){
            var firstName=req.params.firstName
            var lastName=req.params.lastName
            var tele=req.params.tele
            var email=req.params.email
            var remark=req.params.remark
            connection.query("select needtranslation.id from needtranslation where name='"+firstName+"'",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                  
                }
              });
      });
//Get professions
       app.get('/getProfession',function(req,res){
            connection.query("select Id,english,tigrigna,dutch from workprofessionslist",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                  
                }
              });
          });
//Get worktime type
       app.get('/getWorkTime',function(req,res){
            connection.query("select Id,english,tigrigna,dutch from professionalworktimeperiod",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                  
                }
              });
          });
//Get months from months table
       app.get('/getMonths',function(req,res){
            connection.query("select Id,MonthEnglish,werhiTigrigna,MaandDutch from months",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                  
                }
              });
          });
//Get months from months table
       app.get('/getAllContacts',function(req,res){
            connection.query("select Id,name,livesIn,lookingFor,remarks,description from contactissueview",function(error,row,fields){
                if(!!error){
                  console.log('error in query'+error)
                }else{
                   console.log('succesfully connected');
                   console.log(row);
                   res.json(row);
                  
                }
              });
          });
//insert translator information to the translators table
      app.post('/translator',function(req,res){
            var userId=req.body.userId
            var firstName=req.body.firstName
            var lastName=req.body.lastName
            var tele=req.body.tele
            var email=req.body.email
            var remark=req.body.remark
            var profession=req.body.profession
            var professionalLivesIn=req.body.professionalLivesIn
            
            connection.query("insert into translators(userId,name,email,telephone,remarks,profession,livesIn) values('"+userId+"'"+","+"'"+firstName+"'"+","+"'"+email+"'"+","+"'"+tele+"'"+","+"'"+remark+"'"+","+"'"+profession+"'"+","+"'"+professionalLivesIn+"')",function(error,row,fields){
                    if(!!error){
                      console.log('error in query '+error)
                    }else{
                       console.log('succesfully connected');
                       console.log(row.insertId);
                       res.json(row.insertId);
                    }
              });
           
        });
//inserting the information of the  connection between contact and translator
         app.post('/connectionreact',function(req,res){
                   var resultOfContactId=req.body.contactId;
                   var resultOfTranslatorId=req.body.translatorId;
                   var userId=req.body.userId
                   var userName=req.body.userName;
                   var message=userName +"  is requests u for help"
                   var date=Date.now()
                   var showedByUser=req.body.showedByUser;
                   console.log(showedByUser)
                   connection.query("insert into reactiontranslatorsandcontacts(contactId,translatorId)values('"+resultOfContactId+"'"+","+"'"+resultOfTranslatorId+"')",function(error,row,fields){
                                
                   });
                   //insert into notification table in the database
                   connection.query("insert into notificationtable(fromUserId,translatorId,message,timestamp,showedByUser)values('"+userId+"'"+","+"'"+resultOfTranslatorId+"'"+","+"'"+message+"'"+","+"'"+date+"'"+","+"'"+showedByUser+"')",function(error,row,fields){
                                  if(!!error){
                                    console.log('error in query'+error);
                                  }else{
                                     console.log('succesfully connected');
                                     console.log(row);
                                     res.json(row);
                                  }
                   });
         })
//insert contact documents information who need translators or need to translate documents into contactdocuments
    var upload=multer({dest:'./public/documentsForTranslation/'});
       app.post('/documentsForTranslation/',upload.single('myFile'),uploadInfoToDatabase2);
       function uploadInfoToDatabase2(req,res){
            // var widgetId=req.body.widgetId;
            // var width=req.body.width
            var userId=req.body.userId
            var file=req.file;
           
            var originalFileName=file.originalname;
            var filename=file.filename;
            var path=file.path;
            var size=file.size;
            var fileType=file.mimetype
            var destination=file.destination
           // res.send(userId)
           connection.query("insert into contactdocuments(userId,fileName,originalFileName,path,fileType,destination,size) values('"+userId+"'"+","+"'"+filename+"'"+","+"'"+originalFileName+"'"+","+"'"+path+"'"+","+"'"+fileType+"'"+","+"'"+destination+"'"+","+"'"+size+"')",function(error,row,fields){
              if(!!error){
                console.log('error in query'+error)
              }else{
                 console.log('succesfully connected');
                 console.log(row);
                // res.json(row);
              }
            });
      }
//insert cheapmarketing table
    var upload=multer({dest:'./public/cheapMarketingimages/'});
       app.post('/cheapMarketing/',upload.single('myFile'),uploadInfoToDatabase);
       function uploadInfoToDatabase(req,res){
            // var widgetId=req.body.widgetId;
            // var width=req.body.width
            var name=req.body.name;
            var price=req.body.price;
            var place=req.body.where;
            var telephone=req.body.telephone;
            var userId=req.body.userId
            var file=req.file;
            console.log(file)
            var originalFileName=file.originalname;
            var filename=file.filename;
            var path=file.path;
            var size=file.size;
            var fileType=file.mimetype
            var destination=file.destination
             var date=Date.now();
            res.send(file)

            connection.query("insert into cheapmarketing(userId,name,price,place,telephone,timestamp) values('"+userId+"'"+","+"'"+name+"'"+","+"'"+price+"'"+","+"'"+place+"'"+","+"'"+telephone+"'"+","+"'"+date+"')",function(error,row,fields){
              if(!!error){
                console.log('error in query'+error)
              }else{
                 console.log('succesfully connected');
                 console.log(row);
                // res.json(row);
              }
            });

           connection.query("insert into cheapmarketingdocuments(userId,fileName,originalFileName,path,fileType,destination,size,timestamp) values('"+userId+"'"+","+"'"+filename+"'"+","+"'"+originalFileName+"'"+","+"'"+path+"'"+","+"'"+fileType+"'"+","+"'"+destination+"'"+","+"'"+size+"'"+","+"'"+date+"')",function(error,row,fields){
              if(!!error){
                console.log('error in query'+error)
              }else{
                 console.log('succesfully connected');
                 console.log(row);
                // res.json(row);
              }
            });
       }
//upload things to sale...................................................................................
      var upload1=multer({dest:'./public/saleThingsImageCollector'});
       app.post('/putThingsToSaleHere/',upload1.single('myFile'),uploadInfoToDatabase1);
       function uploadInfoToDatabase1(req,res){
        var userId=req.body.userId;
        var name=req.body.name;
        var price=req.body.price;
        var place=req.body.place;
        var telephone=req.body.telephone;
        var materialId=req.body.materialId;
        var description=req.body.description;
        var file=req.file;
        var originalFileName=file.originalname;
        var fileName=file.filename;
        var path=file.path;
        var size=file.size;
        var fileType=file.mimetype;
        var destination=file.destination;
        var date=Date.now();
               connection.query("insert into salethingstable(userId,uploaderName,price,place,telephone,materialId,description,originalFileName,fileName,path,size,fileType,destination,date) values('"+userId+"'"+","+"'"+name+"'"+","+"'"+price+"'"+","+"'"+place+"'"+","+"'"+telephone+"'"+","+"'"+materialId+"'"+","+"'"+description+"'"+","+"'"+originalFileName+"'"+","+"'"+fileName+"'"+","+"'"+path+"'"+","+"'"+fileType+"'"+","+"'"+destination+"'"+","+"'"+size+"'"+","+"'"+date+"')",function(error,row,fields){
                  if(!!error){
                    console.log('error in query'+error)
                  }else{
                     console.log('succesfully connected');
                     console.log(row);
                    // res.json(row);
                  }
                });

               

               fs.readFile('./public/saleThingsImageCollector/'+fileName, function(err, data) {
                          if (err) throw err; // Fail if the file can't be read.
                         
                            res.writeHead(200, {'Content-Type': 'image/jpeg'});
                            res.write(data);
                            res.end() 
               })

       }
//getting or showing the document of the contact from contactdocuments
   app.get('/showImage/:contactId',function(req,res){
            var contactId=req.params.contactId
            connection.query("select fileName from contactdocuments where contactId='"+contactId+"'",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(RowDataPacket.fileName)
              }
             })
       })
//getting the image
       app.get('/images/:filename',function(req,res){
            
          var filename=req.params.filename;
            

               fs.readFile('./uploads/'+filename, function(err, data) {
                          if (err) throw err; // Fail if the file can't be read.
                         
                            res.writeHead(200, {'Content-Type': 'image/jpeg'});
                            res.write(data);
                            res.end() 
                    })
       })
//getting the salers name
       app.get('/salers/:name',function(req,res){
            var name=req.params.name;
            connection.query("select fileName from salethingstable where uploaderName='"+name+"'",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(RowDataPacket.name)
              }
             })
       })
//getting images that are to be sold.
       app.get('/public/saleThingsImageCollector/:filename', function (req, res) {
           var filename=req.params.filename;
           fs.readFile('./public/saleThingsImageCollector/'+filename, function(err, data) {
                  if (err) throw err; // Fail if the file can't be read.
                 
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.write(data);
                    res.end() 
            })
       });
//list of all translators
        app.get('/listOfTranslators',function(req,res){
            
             connection.query("select Id,name,livesIn,profession from translators",function(row,error,fields){
                if(!!error){
                    res.json(error)
                    console.log(error)
                }else{
                    res.json(row)
                    console.log(RowDataPacket.name)
                }
             })
       })
//list of all translators with a profession        
         app.get('/listOfTranslatorsProfession',function(req,res){
                 var profession=req.body.profession
                 console.log("profession ="+profession)
             connection.query("select Id,name,profession from translators where profession='"+profession+"'",function(row,error,fields){
                if(!!error){
                    res.json(error)
                    console.log(error)
                }else{
                    res.json(row)
                    console.log(RowDataPacket.name)
                }
             })
       })
//list of all translators according to their lives        
         app.get('/listOfTranslatorsLivesIn',function(req,res){
                 var livesIn=req.body.livesIn
             connection.query("select Id,name,livesIn from translators where livesIn='"+livesIn+"'",function(row,error,fields){
                if(!!error){
                    res.json(error)
                    console.log(error)
                }else{
                    res.json(row)
                    console.log(RowDataPacket.name)
                }
             })
       })
//list of all translators according to their lives        
         app.get('/listOfTranslatorsWorkingSession',function(req,res){
                 var workingSession=req.body.workingSession
             connection.query("select Id,name,professionalworksin from professionalwhoworkspermanently where professionalworksin='"+workingSession+"'",function(row,error,fields){
                if(!!error){
                    res.json(error)
                    console.log(error)
                }else{
                    res.json(row)
                    console.log(RowDataPacket.name)
                }
             })
         })

//notification from client to prefessional
       app.post('/notificationFromClient',function(req,res){
                var userId=req.body.userId
                var contactId=req.body.contactId
                var professionalId=req.body.professionId
                var message=req.body.message
                var date=Date.now();
                 var showedByUser=req.body.showedByUser
           
            connection.query("insert into notificationtable(userId,fromId,toId,message,timestamp,showedByUser)values('"+userId+"','"+contactId+"','"+professionalId+"','"+message+"','"+date+"','"+showedByUser+"')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else if(row.length===null){
                   res.send("NoNotifications")
                  console.log("NoNotifications")
                }else{
                   res.json(row)
                  console.log(row)
                }
             })
                
       })
//notification from professional to client
       app.post('/notificationFromProfessional',function(req,res){
                var userId=req.body.userId
                var contactId=req.body.contactId
                var professionId=req.body.professionId
                var message=req.body.message
                var date=Date.now();
                var showedByUser=req.body.showedByUser
                 console.log("contactId="+contactId)
                 console.log("professional id = "+professionId)
           
            connection.query("insert into notificationtable(userId,fromId,toId,message,timestamp,showedByUser)values('"+userId+"','"+professionId+"','"+contactId+"','"+message+"','"+date+"','"+showedByUser+"')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else if(row.length===null){
                   res.send("NoNotifications")
                  console.log("NoNotifications")
                }else{
                   res.json(row)
                  console.log(row)
                }
           })
       })
//get number of notification       
      app.get('/userNotifications/:id',function(req,res){
            var id=req.params.id;
            connection.query("SELECT   toId, showedByUser, COUNT(toId) AS numberOfNotifications FROM    notificationtable GROUP BY toId, showedByUser        HAVING        (toId ='"+id+"') AND (showedByUser = 'No')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else if(row.length===null){
                   res.send("NoNotifications")
                  console.log("NoNotifications")
                }else{
                   res.json(row)
                  console.log(row)
                }
             })
       })
      //get number of user agreement notifications     
      app.get('/numberOfUserNotificationsForAgreement/:id',function(req,res){
            var id=req.params.id;
            connection.query("SELECT   toId, showedByUser, userNoticedForAgreement, COUNT(toId) AS numberOfNotifications FROM     notificationtable GROUP BY toId, showedByUser, userNoticedForAgreement  HAVING        (toId =')"+id+"'  AND (userNoticedForAgreement IS NULL)",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else if(row.length===null){
                   res.send("NoNotifications")
                  console.log("NoNotifications")
                }else{
                   res.json(row)
                  console.log(row)
                }
             })
       })
//get the agreement of the professional to client of intended contact        
      app.get('/getProfessionalAgreement/:id',function(req,res){
            var id=req.params.id;
            connection.query("SELECT   notificationtable.Id AS Id,notificationtable.fromId AS fromId, translators.name AS name, notificationtable.toId AS toId, notificationtable.showedByUser AS showedByUser, notificationtable.agreed AS agreed, notificationtable.userNoticedForAgreement AS userNoticedForAgreement FROM            notificationtable INNER JOIN translators ON notificationtable.toId = translators.Id where showedByUser='Yes' and userNoticedForAgreement is null and fromId='"+id+"'",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
           
       })
//get the agreement of the contact to professional of intended professional        
      app.get('/getContactAgreement/:id',function(req,res){
            var id=req.params.id;
            
             connection.query("SELECT        notificationtable.Id AS Id,notificationtable.fromId AS fromId, notificationtable.toId AS toId, needtranslation.name AS name, notificationtable.showedByUser AS showedByUser, notificationtable.agreed AS agreed, notificationtable.userNoticedForAgreement AS userNoticedForAgreement FROM            notificationtable INNER JOIN needtranslation ON notificationtable.toId = needtranslation.Id where showedByUser='Yes' and userNoticedForAgreement is null and toId=124",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
                  
              }
             })
       })
 //get notification       
      app.get('/getTheUserNotifications/:id',function(req,res){
            var id=req.params.id;
            connection.query("select Id,fromId,message from notificationtable where toId='"+id+"'"+"  AND showedByUser='No'",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
   //update the no to yes at the notification table on the database       
      app.put('/updateNoToYes/:id',function(req,res){
            var id=req.params.id;
            console.log("this is the id of the message  "+ id)
            connection.query("UPDATE notificationtable SET showedByUser='Yes' WHERE Id="+id+"",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
       //user noticed for the agreement if it was agreed or not agreed       
      app.put('/userNoticedForAgreement/:id',function(req,res){
            var id=req.params.id;
            console.log("this is the id of the message  "+ id)
            connection.query("UPDATE notificationtable SET userNoticedForAgreement='Yes' WHERE Id="+id+"",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
       //update the agreement column in notification table to No      
      app.put('/updateAgreementToNo/:id',function(req,res){
            var id=req.params.id;
            console.log("this is the id of the message  "+ id)
            connection.query("UPDATE notificationtable SET agreed='No' WHERE Id="+id+"",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
       //update the agreement column in notification table to yes      
      app.put('/updateAgreementToYes/:id',function(req,res){
            var id=req.params.id;
            console.log("this is the id of the message  "+ id)
            connection.query("UPDATE notificationtable SET agreed='Yes' WHERE Id="+id+"",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
       //get professional details      
      app.get('/getDetailsOfProfessional/:id',function(req,res){
            var id=req.params.id;
            connection.query("select name,profession,livesIn,email from translators where Id="+id+"",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
      //get contact  details      
      app.get('/getDetailsOfContact/:id',function(req,res){
            var id=req.params.id;
            console.log("contact id ="+id)
            connection.query("SELECT   needtranslation.Id AS Id, needtranslation.name AS name, needtranslation.email AS email, needtranslation.livesIn AS livesIn, needtranslation.lookingFor AS lookingFor, contactissues.remarks AS remarks, contactissues.description AS description FROM            needtranslation INNER JOIN  contactissues ON needtranslation.Id = contactissues.contactId  WHERE        (needtranslation.Id = '"+id+"')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })
      
//user task insertion to usertask table in a database
        app.post('/userTask',function(req,res){
            var userId=req.body.userId;
            var taskName=req.body.taskName;
            var startingDate=req.body.taskStartingDate;
            var startingTime=req.body.startingTime;
            var endingDate=req.body.taskEndingDate;
            var endingTime=req.body.endingTime;
            connection.query("insert into usertask(userId,taskName,startingDate,startingTime,endingDate,endingTime)values('"+userId+"'"+","+"'"+taskName+"'"+","+"'"+startingDate+"'"+","+"'"+startingTime+"'"+","+"'"+endingDate+"'"+","+"'"+endingTime+"')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
       })

//insert computer maintenace information to the computer maintenance table in the database 
           app.post('/computermaintenance',function(req,res){
              
                 var userId=req.body.userId
                 var name=req.body.name;
                 var tele=req.body.tele;
                 var address=req.body.address;
                 var description=req.body.description;
             connection.query("insert into computermaintenance(userId,name,tele,address,description)values('"+userId+"'"+","+"'"+name+"'"+","+"'"+tele+"'"+","+"'"+address+"'"+","+"'"+description+"')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
           })
//news
           app.post('/news',function(req,res){
                 var userId=req.body.userId
                 var newsprovidername=req.body.newsprovidername;
                 var newsprovidertele=req.body.newsprovidertele;
                 var newstitle=req.body.newstitle;
                 var newsdescription=req.body.newsdescription;
                 var newshappeningtime=req.body.newshappeningtime;
                 var news=req.body.news;
                  var date=Date.now();
             connection.query("insert into newstable(userId,newsprovidername,newsprovidertele,newstitle,newsdescription,newshappeningtime,news,timestamp)values('"+userId+"'"+","+"'"+newsprovidername+"'"+","+"'"+newsprovidertele+"'"+","+"'"+newstitle+"'"+","+"'"+newsdescription+"'"+","+"'"+newshappeningtime+"'"+","+"'"+news+"'"+","+"'"+date+"')",function(row,error,fields){
              if(!!error){
                  res.json(error)
                  console.log(error)
              }else{
                  res.json(row)
                  console.log(row)
              }
             })
           })
}
      

