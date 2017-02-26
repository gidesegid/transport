  var myApp=angular.module('myApp',['ngRoute','ngFileUpload']);
  myApp.directive('fileModel', ['$parse', function ($parse) {
    return {
       restrict: 'A',
       link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(event){
             scope.$apply(function(){
                var files = event.target.files;
                /* 
                    Writing the selected file name below the Upload image
                */  
                angular.element( document.querySelector( '#selectedFile' )).html(files[0].name);
                modelSetter(scope, element[0].files[0]);
             });
          });
       }
    };
}]);
 
 //login controller      
    myApp.controller('logincontroller',function($scope,$http,$window,srvShareData, $location){
          $scope.dataToShare = [];
        $scope.submitLogin=function(){
              var username=$scope.username;
              var password=$scope.password;
            $http.get('/login/'+username+'/'+password).then(function(response){
              $scope.result2=response.data
             $scope.result1=response.data[0].username;
             $scope.id=response.data[0].id
             console.log($scope.result2)
            if($scope.result2==="no"){
             alert("wrong user name or password or you are not yet registerd ")
            }else{
            $scope.result=[]
            myValue=response.data[0].id
            myValue2=response.data[0].name
            //check the user if he registered at needtranslation(client table in database) is registered
            $http.get('/clientId/'+myValue).then(function(response){
              $scope.clientId=response.data[0].Id
              console.log($scope.clientId)
              $scope.result.push($scope.clientId)
               $scope.dataToShare=$scope.result
               $scope.dataToShare2=$scope.result
              // console.log($scope.dataToShare2)
            })
            //check the user if he registed at translators(profession table in a database) is registered
             $http.get('/professionId/'+myValue).then(function(response){
              $scope.professionId=response.data[0].Id
            $scope.result.push($scope.professionId)
           console.log($scope.dataToShare)
          
               srvShareData.addData($scope.dataToShare);
           $window.location.href = "index.html";

            })
            $scope.result.push(myValue,myValue2)
            $scope.dataToShare=$scope.result
            }
         
          })
        }
     })
//top bar controller
      myApp.controller('homePageController', function($scope,$http,srvShareData) {
        $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.nameUser=$scope.sharedDataUserName[1];
        $scope.idUser=$scope.sharedDataUserName[0]
         $scope.contactId=$scope.sharedDataUserName[2]
          $scope.professionId=$scope.sharedDataUserName[3]
$scope.allNotifications=function(){
  $scope.totalNotifications;
   if($scope.contactId==undefined){
        //alert("he is professional")
            $http.get('/userNotifications/'+$scope.professionId).then(function(response){
                    $scope.notificationResultOne=response.data[0].numberOfNotifications
                     alert("contact replay number of notifications "+$scope.notificationResultOne)
                   if($scope.notificationResult==undefined){
                    console.log("no notification")
                   }
            })
             //get notification
        $http.get('/getTheUserNotifications/'+$scope.professionId).then(function(response){
          $scope.userNotificationMessages=response.data
          if($scope.userNotificationMessages==undefined){
            console.log("no messages")
          }
        })
      }else if($scope.professionId==undefined){
      //alert("he is contact")
          $http.get('/userNotifications/'+$scope.contactId).then(function(response){
                  $scope.notificationResultOne=response.data[0].numberOfNotifications
                  alert("contact replay number of notifications "+$scope.notificationResultOne)
                  if($scope.notificationResult==undefined){
                       console.log("no notification")
                  }
          })
           //get notification
        $http.get('/getTheUserNotifications/'+$scope.contactId).then(function(response){
           $scope.userNotificationMessages=response.data
          if($scope.userNotificationMessages){
            console.log("no notification")
          }
        })
      }else{
        alert("this user is not yet registered ")
      }

       if($scope.contactId==undefined){
        //alert("he is professional")
            $http.get('/numberOfUserNotificationsForAgreement/'+$scope.professionId).then(function(response){
                    $scope.notificationResultTwo=response.data[0].numberOfNotifications
                   if($scope.notificationResult==undefined){
                    console.log("no notification")
                   }
            })
             //get notification
        $http.get('/getTheUserNotifications/'+$scope.professionId).then(function(response){
          $scope.userNotificationMessages=response.data
          if($scope.userNotificationMessages==undefined){
            console.log("no messages")
          }
        })
      }else if($scope.professionId==undefined){
      //alert("he is contact")
          $http.get('/numberOfUserNotificationsForAgreement/'+$scope.contactId).then(function(response){
                  $scope.notificationResultTwo+=response.data[0].numberOfNotifications
                  if($scope.notificationResult==undefined){
                       console.log("no notification")
                  }
          })
           //get notification
        $http.get('/getTheUserNotifications/'+$scope.contactId).then(function(response){
           $scope.userNotificationMessages=response.data
          if($scope.userNotificationMessages){
            console.log("no notification")
          }
        })
      }else{
        alert("this user is not yet registered ")
      }
       $scope.totalNotifications=$scope.notificationResultTwo+$scope.notificationResultOne
}
$scope.allNotifications=new $scope.allNotifications()
     
   //get the agreement of the professional to client of intended contact 
      if($scope.contactId==undefined){
             $http.get('/getContactAgreement/'+$scope.professionId).then(function(response){
                     $scope.whatIsTheAgreement=response.data[0].agreed
                     $scope.nameOfApproval=response.data[0].name
                     $scope.agreementMessageId=response.data[0].Id
                     console.log("message id ="+$scope.agreementMessageId)
                    if($scope.whatIsTheAgreement=='Yes'){
                        $scope.agreementMessage=$scope.nameOfApproval+" has accepted your requested"
                    }else if($scope.whatIsTheAgreement=='No'){
                             $scope.agreementMessage="Sorry! "+$scope.nameOfApproval+" did not accepted your requests"
                    }else{
                       $scope.agreementMessage="No notification"
                    }
          })
     //get the agreement of the contact to professional of intended professional       
      }else if($scope.professionId==undefined){
          $http.get('/getProfessionalAgreement/'+$scope.contactId).then(function(response){
                    $scope.whatIsTheAgreement=response.data[0].agreed
                    $scope.agreementMessageId=response.data[0].Id
                   console.log("message id ="+$scope.agreementMessageId)
                     $scope.nameOfApproval=response.data[0].name
                    
                    if($scope.whatIsTheAgreement=='Yes'){
                        $scope.agreementMessage=$scope.nameOfApproval+" has accepted your requested"
                        console.log($scope.agreementMessage)
                    }else if($scope.whatIsTheAgreement=='No'){
                             $scope.agreementMessage="Sorry! "+$scope.nameOfApproval+" did not accepted your requests"
                             console.log($scope.agreementMessage)
                    }else{
                           $scope.agreementMessage="No notification";
                    }
            })
         
      }else{
        alert("this user is not yet registered ")
      }
     $scope.okThanks=function(id){
      $scope.agreementMessageId=id
            $http.put('/userNoticedForAgreement/'+$scope.agreementMessageId).then(function(response){
               alert("client noticed for your agreement")
            })
    }
       
       //see applicant details that has asked a request
       $scope.applicantDetails=function(id,fromId){
             $scope.fromId=fromId;
             $scope.messageId=id
             //updating the notification when the user sees the notification
            $http.put('/updateNoToYes/'+$scope.messageId).then(function(response){
             //alert("updated")
            })
            //get details of the contact or the professional
               if($scope.contactId==undefined){
                  $http.get('/getDetailsOfContact/'+$scope.fromId).then(function(response){
                    $scope.details=response.data[0]
                    console.log($scope.details)
                  })
               }else if($scope.professionId==undefined){
                      $http.get('/getDetailsOfProfessional/'+$scope.fromId).then(function(response){
                        $scope.details=response.data[0]
                        console.log($scope.details)
                      })
               }else{

               }
       }
       //agree for the request
       $scope.agree=function(id){
           $scope.agreeId=id
           $http.put('/updateAgreementToYes/'+$scope.agreeId).then(function(response){
             alert("you agreed to the job")
            })
       }
       //not agree for the request
        $scope.NotAgree=function(id){
           $scope.agreeId=id
           $http.put('/updateAgreementToNo/'+$scope.agreeId).then(function(response){
             alert("you did not agree for the requests")
            })
       }
      });
//task controller
   myApp.controller('taskController',function($scope,$http,$filter,srvShareData){
        $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
     $scope.submitTask=function(){
          var taskName=$scope.taskName
          var taskStartingDate=$scope.startingDate
          var startingTime=$filter('date')($scope.startingTime, 'hh:mm');
          var taskEndingDate=$scope.endingDate
          var endingTime=$filter('date')($scope.endingTime, 'hh:mm');
          $scope.task={
            userId:$scope.idUser,
            taskName:$scope.taskName,
            taskStartingDate:taskStartingDate,
            startingTime:startingTime,
            taskEndingDate:taskEndingDate,
            endingTime:endingTime

          }
          $http.post('/userTask',$scope.task).then(function(response){
             $scope.mydata=response.data
              alert("registered")
             
          })
      }
   })
  //things to sale controller 
    myApp.controller('thingsToSaleController',function($scope,$http,srvShareData){
       $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
         $scope.upload=function(){
           
            $http.get('/public/saleThingsImageCollector/'+idUser).then(function(response){
                $scope.mydata=response.data[0].fileName
                console.log($scope.mydata)
               
            })
          }

    })
  //computer maintenance controller  
     myApp.controller('computerMaintenanceController',function($scope,$http,srvShareData){
        $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
        $scope.maintenance=function(){
                          
                           $scope.data={
                            userId:$scope.idUser,
                            name:$scope.name,
                            tele:$scope.tele,
                            address:$scope.address,
                            description:$scope.description
                           }
            $http.post('/computermaintenance',$scope.data).success(function(response){
              alert('inserted successfully')
            })
        }

    })
  //cheap marketing controller
     myApp.controller('cheapmarketingcontroller',function($scope,$http,srvShareData){
       $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
    })
  //news controller
      myApp.controller('newscontroller',function($scope,$http,srvShareData){
       $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
        $scope.submitNews=function(){
          
          $scope.newsdata={
                  userId:$scope.idUser,
                  newsprovidername:$scope.newsprovidername,
                  newsprovidertele:$scope.newsprovidertele,
                  newstitle:$scope.newstitle,
                  newsdescription:$scope.newsdescription,
                  newshappeningtime:$scope.newshappeningtime,
                  news:$scope.news
          }
          $http.post('/news',$scope.newsdata).success(function(response){
            alert('successfully inserted');
          })
        }
    })
  //notification
       myApp.controller('notificationcontroller',function($scope,$http,srvShareData){
       $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
        $scope.userName=$scope.sharedDataUserName[1]
        $scope.clientId=$scope.sharedDataUserName[2];
        $scope.professionId=$scope.sharedDataUserName[3];
        $scope.see=function(){
          
              $scope.notificationdata={
                      userId:$scope.idUser,
                      userName:$scope.userName,
                      clientId:$scope.clientId,
                      professionId:$scope.professionId
              }
        
              console.log("userId "+$scope.notificationdata.userId)
              console.log("user name "+$scope.notificationdata.userName)
              console.log("user client id "+$scope.notificationdata.clientId)
              console.log("user profession id "+$scope.notificationdata.professionId)
              if($scope.notificationdata.clientId===null){
                   $http.get('/notificationProfessionId',$scope.notificationdata).success(function(response){
                      
                   })
              }else{
                   $http.get('/notificationClientId',$scope.notificationdata).success(function(response){
                    
                  })
              }
        }
    })
//contact information for transport
  myApp.controller('transportAndTranslationContactController',function($scope,$http,$filter,srvShareData){
        $scope.sharedData = srvShareData.getData();
        $scope.sharedDataUserName=$scope.sharedData[0];
        $scope.idUser=$scope.sharedDataUserName[0]
        $scope.contactId=$scope.sharedDataUserName[2]
        $scope.translatorId=$scope.sharedDataUserName[3]
 //populating drop boxess.....................................................        
        //get the professions
             $http.get('/getProfession').then(function(response){
                 var workProfessions=JSON.stringify((response.data).map(function(obj){ return obj.english }))
                 $scope.workProfessionDatas=JSON.parse(workProfessions);
             })
        //get work time
         $http.get('/getWorkTime').then(function(response){
           $scope.workTime=response.data
            var workTime=JSON.stringify((response.data).map(function(obj){ return obj.english }))
                 $scope.workTimeDatas=JSON.parse(workTime);
        })
        //get months
         $http.get('/getMonths').then(function(response){
            var months=JSON.stringify((response.data).map(function(obj){ return obj.MonthEnglish }))
                 $scope.monthsDatas=JSON.parse(months);
                 console.log($scope.months)
        })
   //end of populating dropboxess............................................................
         
    var transportationArray=["Train","Bus","Tax","Metro","brommer","Vlietuig","Schip","Boat","Vrachtwagen","Fiets"]
    $scope.transports=transportationArray;

    var allCities=["Assen","Coevorden","Emmen","Hoogeveen","Meppel","Almere","Lelystad","Emmeloord","Biddinghuizen",
                "Bolsward","Dokkum","Drachten","Franeker","Harlingen","Heerenveen","Hindeloopen","IJlst","Leeuwarden",
                "Sloten","Sneek","Stavoren","Workum","Apeldoorn","Arnhem","Bredevoort","Buren","Culemborg","Deil","Dieren",
                "Doetinchem","Ede","Enspijk","Gendt","Groenlo","Harderwijk","Hattem","Heukelum","Huissen","Nijkerk","Nijmegen",
                "Tiel","Wageningen","Wijchen","Winterswijk","Zaltbommel","Zevenaar","Zutphen","Appingedam","Delfzijl","Groningen",
                "Hoogezand-Sappemeer","Stadskanaal","Winschoten","Veendam","Geleen","Gennep","Heerlen","Kerkrade","Kessel",
                "Landgraaf","Maastricht","Montfort","Nieuwstadt","Roermond","Sittard","Schin op Geul","Stein","Thorn",
                "Valkenburg","Venlo","Weert","Bergen op Zoom","Breda","s-Hertogenbosch","Eindhoven","Geertruidenberg",
                "Grave","Helmond","Heusden","Klundert","Oosterhout","Oss","Ravenstein","Roosendaal","Sint-Oedenrode",
                "Tilburg","Valkenswaard","Veldhoven","Waalwijk","Willemstad","Woudrichem","Alkmaar","Amstelveen","Amsterdam",
                "Den Helder","Edam","Enkhuizen","Haarlem","Heerhugowaard","Hilversum","Hoofddorp","Hoorn","Laren","Purmerend",
                "Medemblik","Monnickendam","Muiden","Naarden","Schagen","Velsen","Weesp","Zaanstad","Almelo","Blokzijl","Deventer",
                "Enschede","Genemuiden","Hasselt","Hengelo","Kampen","Oldenzaal","Steenwijk","Vollenhove","Zwolle","Alphen aan den Rijn",
                "Delft","Dordrecht","Gorinchem","Gouda","Leiden","Rotterdam","Spijkenisse","Den Haag","Zoetermeer","Amersfoort",
                "Nieuwegein","Utrecht","Veenendaal","Arnemuiden","Goes","Hulst","Middelburg","Sluis","Terneuzen","Veere",
                 "Vlissingen","Zierikzee"]
     $scope.cities=allCities;

  $scope.contactTransportSubmition=function(){

              var cDate=$scope.contact.cDate
              var convertDate = $filter('date')(cDate, "yyyy-MM-dd");//i converted the date string to only date
              $scope.contactTransport={
                userId:$scope.idUser,
                transport:$scope.contact.transport,
                cityFromName:$scope.contact.cityFromName,
                cityToName:$scope.contact.cityToName,
                convertDate:$filter('date')(cDate, "yyyy-MM-dd"),
                firstName:$scope.contact.firstName,
                lastName:$scope.contact.lastName,
                tele:$scope.contact.tele,
                email:$scope.contact.email,
                preferedtransportName:$scope.contact.preferedtransportName,
                code:$scope.contact.code
              }
          $http.post('/contactinfo',$scope.contactTransport).success(function(response){
                  alert("inserted successfully")
                  $scope.inseteddataId=response.data
                  console.log($scope.inseteddataId)
                  $scope.contact.transport="";
                  $scope.contact.cityFromName="";
                  $scope.contact.cityToName="";
                  $scope.contact.cDate="";
                  $scope.contact.firstName=""
                  $scope.contact.lastName=""
                  $scope.contact.tele=""
                  $scope.contact.email=""
                  $scope.contact.preferedtransportName=""
                  $scope.contact.code=""
              })
  }

  $scope.ownerSubmit=function(){
            var ownerDate=$scope.ownerDate
             var collectionDate = $filter('date')(ownerDate, 'date');
              $scope.transportOwners={
              userId:$scope.idUser,
              ownerTransportName:$scope.ownerTransportName,
              ownercityFromName:$scope.ownerCityFromName,
              ownerCityToName:$scope.ownerCityToName,
              ownerDate:$scope.ownerDate,
              collectionDate: $filter('date')(ownerDate, 'date'),
              activeFromTo:$scope.activeFromTo,
              numberOfSeats:$scope.numberOfSeats,
              additionalInfo:$scope.additionalInfo,
              ownerCode:$scope.ownerCode
            }
           $http.post('/transOwnerInfo',$scope.transportOwners).success(function(response){
              console.log(response);
              alert("successfully inserted");
              $scope.ownerTransportName="";
                  $scope.ownerCityFromName="";
                  $scope.ownerCityToName="";
                  $scope.ownerDate="";
                  $scope.activeFromTo="";
                  $scope.numberOfSeats="";
                  $scope.additionalInfo="";
                  $scope.ownerCode="";
            });
  }
   $scope.detailTravelInfo=function(){
       var date=$scope.date;
       var convertDate = $filter('date')(date, "yyyy-MM-dd")
       var cityFrom=$scope.cityFrom
       var cityTo=$scope.cityTo
       var transportModel=$scope.transportModel
        $http.get('/transportLookUp/'+convertDate+'/'+cityFrom+'/'+cityTo+'/'+transportModel).then(function(response){
            $scope.result=response.data;
            console.log($scope.result);
             alert("you are in detail")
        })
      }
      $scope.roughTravelInfo=function(){
                   var  date=$scope.date
                  var convertDate = $filter('date')(date, "yyyy-MM-dd")
                  var cityTo=$scope.cityTo
                  console.log(cityTo)
                  var transportModel=$scope.transportModel
                  // console.log($scope.roughTravelInfoData)
        $http.get('/roughTransportLookupTo/'+convertDate+'/'+cityTo+'/'+transportModel).then(function(response){
            $scope.result2=response.data
            console.log($scope.result2)
             alert("you are in rough")
        })          
      }
  /*contact to need translator
  insert contact who need translating 
     */
     $scope.basicInfo=function(){
       $scope.contactTranslation={
                userId:$scope.idUser,
                firstName:$scope.contact.firstNameTranslating,
                lastName:$scope.contact.lastNameTranslating,
                tele:$scope.contact.teleTranslating,
                email:$scope.contact.emailTranslating,
                livesIn:$scope.livesIn,
                lookingFor:$scope.myProfessionDropDown
          }
           $http.post('/contactinfoTranslating',$scope.contactTranslation).then(function(response){
              $scope.newContactId=response.data
               alert("registered successfully")


              });

     }

    $scope.submitContactTranslation=function(){
         $scope.contactId=$scope.newContactId
        // alert($scope.contactId)
      var timeFrom=$scope.contact.timeFromTranslating;
      var timeTo=$scope.contact.timeToTranslating;
         
          $scope.contactTranslationTime={ 
                contactId:$scope.contactId,
                date:$scope.contact.dateTranslating,
                collectionDate:$filter('date')(timeFrom, 'hh:mm'),//convert timeFrom output to time stamp
                timeTo:$scope.contact.timeToTranslating,
                collectionDate1 : $filter('date')(timeTo, 'hh:mm'),//convert timeTo output to time stamp}
                 lookingFor:$scope.myProfessionDropDown
              }
              alert($scope.contactTranslationTime.contactId)
              $scope.contactIssues={
                  contactId:$scope.contactId,
                 remark:$scope.contact.remarkTranslating,
                issue:$scope.issue
              }
          
            
              if($scope.contactTranslationTime.lookingFor==='Translator'){
                 $http.post('/contacttimeappointment',$scope.contactTranslationTime).then(function(response){
                      alert("translator is inserted");
                 })
              }else if($scope.contactTranslationTime.lookingFor==='Doctor'){
                 $http.post('/contacttimeappointment',$scope.contactTranslationTime).then(function(response){
                      alert("doctor is inserted");
                 })
              }
             
               $http.post('/contactissues',$scope.contactIssues).then(function(response){
                      alert("issue is inserted");
                })
             
    }

   /*translator
   insert translator who is ready to translate document 
   */
   $scope.saveProfession=function(){
    var professionalId=$scope.professionalId;
    alert(professionalId)
        $scope.professionalWorkMonths={
           contactId:$scope.professionalId,
           fromMonth:$scope.fromMonth,
            toMonth:$scope.toMonth
        }
        $scope.professionalWorkDate={
            contactId:$scope.professionalId,
           fromDate:$scope.fromDate,
            toDate:$scope.toDate
        }
         $scope.professionalWork={
           contactId:$scope.professionalId,
           worksession:$scope.myWorkTimeDropDown
        }
        // $http.post('/professionworksession',$scope.professionalWork).then(function(response){
        //   alert("successfully inserted");
        // })
        if($scope.myWorkTimeDropDown=='Job for a month'){
           $http.post('/professionalMonth',$scope.professionalWorkMonths).then(function(response){
             alert("months")
           })
        }else if($scope.myWorkTimeDropDown==' Job for a days'){
            $http.post('/professionalDate',$scope.professionalWorkDate).then(function(response){
                 alert("dates")
           })
        }else{
            $http.post('/professionworksession',$scope.professionalWork).then(function(response){
              alert("successfully inserted from permanenty");
            })
        }

   }
    $scope.submitTranslator=function(){
        $scope.translators={
          userId:$scope.idUser,
           firstName:$scope.translator.firstName,
            lastName:$scope.translator.lastName,
            tele:$scope.translator.tele,
            email:$scope.translator.email,
            remark:$scope.translator.remark,
            profession:$scope.professionalsProfession,
            professionalLivesIn:$scope.professionalLivesIn
        }
       
       
          $http.post('/translator',$scope.translators).then(function(response){
            $scope.professionalId=response.data;
            alert($scope.professionalId)
          });
    }
     $scope.submitTask=function(){
          var taskName=$scope.taskName
          var taskStartingDate=$scope.startingDate
          var startingTime=$filter('date')($scope.startingTime, 'hh:mm');
          var taskEndingDate=$scope.endingDate
          var endingTime=$filter('date')($scope.endingTime, 'hh:mm');
          $scope.task={
            userId:$scope.idUser,
            taskName:$scope.taskName,
            taskStartingDate:taskStartingDate,
            startingTime:startingTime,
            taskEndingDate:taskEndingDate,
            endingTime:endingTime

          }
          $http.post('/userTask',$scope.task).then(function(response){
             $scope.mydata=response.data
              alert("registered")
             
          })
      }
});
//translators and contacts transaction
 myApp.controller('translatorsContactsTransactionController',function($scope,$http,srvShareData){
          $scope.sharedData = srvShareData.getData();
          $scope.sharedDataUserName=$scope.sharedData[0];
          $scope.idUser=$scope.sharedDataUserName[0];
          $scope.userName=$scope.sharedDataUserName[1]
          $scope.clientId=$scope.sharedDataUserName[2];
          $scope.professionId=$scope.sharedDataUserName[3];

//get contact id          
           $http.get('/userContactId/'+$scope.idUser).then(function(response){
            $scope.userContactId=response.data[0].Id
           })
//get professional id           
            $http.get('/getProfession').then(function(response){
                 var workProfessions=JSON.stringify((response.data).map(function(obj){ return obj.english }))
                 $scope.workProfessionDatas=JSON.parse(workProfessions);
             })
//get work time            
            $http.get('/getWorkTime').then(function(response){
                   $scope.workTime=response.data
                var workTime=JSON.stringify((response.data).map(function(obj){ return obj.english }))
                 $scope.workTimeDatas=JSON.parse(workTime);
            })
            //all cities in netherlands
             var allCities=["Assen","Coevorden","Emmen","Hoogeveen","Meppel","Almere","Lelystad","Emmeloord","Biddinghuizen",
                "Bolsward","Dokkum","Drachten","Franeker","Harlingen","Heerenveen","Hindeloopen","IJlst","Leeuwarden",
                "Sloten","Sneek","Stavoren","Workum","Apeldoorn","Arnhem","Bredevoort","Buren","Culemborg","Deil","Dieren",
                "Doetinchem","Ede","Enspijk","Gendt","Groenlo","Harderwijk","Hattem","Heukelum","Huissen","Nijkerk","Nijmegen",
                "Tiel","Wageningen","Wijchen","Winterswijk","Zaltbommel","Zevenaar","Zutphen","Appingedam","Delfzijl","Groningen",
                "Hoogezand-Sappemeer","Stadskanaal","Winschoten","Veendam","Geleen","Gennep","Heerlen","Kerkrade","Kessel",
                "Landgraaf","Maastricht","Montfort","Nieuwstadt","Roermond","Sittard","Schin op Geul","Stein","Thorn",
                "Valkenburg","Venlo","Weert","Bergen op Zoom","Breda","s-Hertogenbosch","Eindhoven","Geertruidenberg",
                "Grave","Helmond","Heusden","Klundert","Oosterhout","Oss","Ravenstein","Roosendaal","Sint-Oedenrode",
                "Tilburg","Valkenswaard","Veldhoven","Waalwijk","Willemstad","Woudrichem","Alkmaar","Amstelveen","Amsterdam",
                "Den Helder","Edam","Enkhuizen","Haarlem","Heerhugowaard","Hilversum","Hoofddorp","Hoorn","Laren","Purmerend",
                "Medemblik","Monnickendam","Muiden","Naarden","Schagen","Velsen","Weesp","Zaanstad","Almelo","Blokzijl","Deventer",
                "Enschede","Genemuiden","Hasselt","Hengelo","Kampen","Oldenzaal","Steenwijk","Vollenhove","Zwolle","Alphen aan den Rijn",
                "Delft","Dordrecht","Gorinchem","Gouda","Leiden","Rotterdam","Spijkenisse","Den Haag","Zoetermeer","Amersfoort",
                "Nieuwegein","Utrecht","Veenendaal","Arnemuiden","Goes","Hulst","Middelburg","Sluis","Terneuzen","Veere",
                 "Vlissingen","Zierikzee"]
     $scope.cities=allCities;
  //saving the selection of a contact to a translator he needs
    $scope.save=function(){
          $http.post('/connectionreact/'+$scope.resultOfContactId+'/'+$scope.resultOfTranslatorId).then(function(response){

                 alert("successfully done")
          })
    }
    //list of all translators
     $scope.translatorsList=function(){
          $scope.professionalData={
             profession:$scope.showProfessionals,
             livesIn:$scope.showProfessionalsLivesIn,
             workingSession:$scope.showProfessionalsWorkPeriod
          }
         
         $http.get('/listOfTranslators').then(function(response){
          $scope.listOfTranslators=response.data
          console.log($scope.listOfTranslators)
        })
     }

   //getting the id of a translator 
   $scope.getTranslatorId=function(id){
    $scope.translatorId=id;

    var theMessage=$scope.userName+" is invited you to work"
    var showedByUser="No"
      $scope.requestProfessionalData={
                userId:$scope.idUser,
                contactId:$scope.clientId,
                professionId:$scope.translatorId,
                showedByUser:showedByUser,
                message:theMessage
      }
     
                 $http.post('/notificationFromClient',$scope.requestProfessionalData).success(function(response){
                         alert("request has been send to the professional")
                   })
        
   }
   //get contact id
   $scope.getContactId=function(id){
    $scope.resultOfContactId=id
    var professionId=$scope.professionId
    alert(professionId)
     var theMessage=$scope.userName+" would like to work with you at your works"
    var showedByUser="No"
      $scope.requestProfessionalData={
                userId:$scope.idUser,
                professionId:$scope.professionId,
                contactId:$scope.resultOfContactId,
                showedByUser:showedByUser,
                message:theMessage
      }
     
                 $http.post('/notificationFromProfessional',$scope.requestProfessionalData).success(function(response){
                         alert("request has been send to the professional")
                   })
   }
  
   $scope.loadAllContacts=function(){
        $http.get('/getAllContacts').then(function(response){
          $scope.allcontacts=response.data
        })
   }
});
//service...............................................................
      myApp.service('srvShareData', function($window) {
        var KEY = 'App.SelectedValue';
        //adding name and id of the user to the sessionStorage
        var addData = function(newObj) {
            var mydata = $window.sessionStorage.getItem(KEY);
            if (mydata) {
                mydata = JSON.parse(mydata);
            } else {
                mydata = [];
            }
            mydata=[]//clearing the array at every page load, other wise commet this to add things to the array at every page load
            mydata.push(newObj);
            $window.sessionStorage.setItem(KEY, JSON.stringify(mydata));
        };


        var getData = function(){
            var mydata = $window.sessionStorage.getItem(KEY);
            if (mydata) {
                mydata = JSON.parse(mydata);
            }
            return mydata || [];
        };

        return {
            addData: addData,
            getData: getData
        };
    });
    