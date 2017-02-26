var myApp=angular.module('myApp',[]);


 myApp.controller('mycontroller',function($scope,$http,$filter){

	
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



/*contact information and transport choosen*/
$scope.submit=function(){
	        var transport=$scope.contact.transport;
            var cityFromName=$scope.contact.cityFromName;
            var cityToName=$scope.contact.cityToName;
            var cDate=$scope.contact.cDate
		    var convertDate = $filter('date')(cDate, "yyyy-MM-dd");//i converted the date string to only date
            var firstName=$scope.contact.firstName
            var lastName=$scope.contact.lastName
            var tele=$scope.contact.tele
            var email=$scope.contact.email
            var preferedtransportName=$scope.contact.preferedtransportName
            var code=$scope.contact.code
            $http.post('/contactinfo/'+transport+'/'+cityFromName+'/'+cityToName+'/'+convertDate+'/'+firstName+'/'+lastName+'/'+tele+'/'+email+'/'+preferedtransportName+'/'+code).success(function(response){
                   alert("inserted successfully")
		            $scope.contact.transport="";
		            $scope.contact.cityFromName="";
		            $scope.contact.cityToName="";
		            $scope.contact.cDate=""
		            $scope.contact.firstName=""
		            $scope.contact.lastName=""
		            $scope.contact.tele=""
		            $scope.contact.email=""
		            $scope.contact.preferedtransportName=""
		            $scope.contact.code=""

            })
}


/*owner transport*/


	$scope.ownerSubmit=function(){
		        var ownerTransportName=$scope.ownerTransportName;
		        var ownercityFromName=$scope.ownerCityFromName;
		        var ownerCityToName=$scope.ownerCityToName;
		        var ownerDate=$scope.ownerDate
		         var collectionDate = $filter('date')(ownerDate, 'date');
		         console.log(collectionDate)
		        var activeFromTo=$scope.activeFromTo
		        var numberOfSeats=$scope.numberOfSeats
		        var additionalInfo=$scope.additionalInfo
		        var ownerCode=$scope.ownerCode;
           $http.post('/transOwnerInfo/'+ownerTransportName+'/'+ownercityFromName+'/'+ownerCityToName+'/'+ownerDate+'/'+activeFromTo+'/'+numberOfSeats+'/'+additionalInfo+'/'+ownerCode).success(function(response){
			 		console.log(response);
			 		alert("successfully inserted")
			 	$scope.ownerTransportName="";
		        $scope.ownerCityFromName="";
		        $scope.ownerCityToName="";
		        $scope.ownerDate=""
		        $scope.activeFromTo=""
		        $scope.numberOfSeats=""
		        $scope.additionalInfo=""
		        $scope.ownerCode="";
 	          });
	}
/*contact to need translator
  insert contact who need translating 
     */

    $scope.submitContactTranslation=function(){
		        var firstName=$scope.contact.firstNameTranslating
		        var lastName=$scope.contact.lastNameTranslating
		        var tele=$scope.contact.teleTranslating
		        var email=$scope.contact.emailTranslating
		        var date=$scope.contact.dateTranslating
		        var timeFrom=$scope.contact.timeFromTranslating;
		        var collectionDate = $filter('date')(timeFrom, 'hh:mm');//convert timeFrom output to time stamp
		        var timeTo=$scope.contact.timeToTranslating
		         var collectionDate1 = $filter('date')(timeTo, 'hh:mm');//convert timeTo output to time stamp
		        var remark=$scope.contact.remarkTranslating
		        
	 	$http.post('/contactinfoTranslating/'+firstName+'/'+lastName+'/'+tele+'/'+email+'/'+remark+'/'+date+'/'+collectionDate+'/'+collectionDate1).success(function(response){
	 		alert("contact registered")
	 		$http.get('/getContactId/'+firstName+'/'+lastName+'/'+tele+'/'+email+'/'+remark).then(function(response){
	 			$scope.contactId=response.data[0].id;
	 			alert(firstName +'contact id is'+$scope.contactId)
		 		   $scope.contact.firstNameTranslating=""
			       $scope.contact.teleTranslating=""
			       $scope.contact.emailTranslating=""
			       $scope.contact.remarkTranslating=""
			       $scope.contact.dateTranslating=""
			       $scope.contact.timeFromTranslating=""
			       $scope.contact.timeToTranslating=""
	 		})
	 	});
	 	
    }

     /*translator
     insert translator who is ready to translate document 
     */
    $scope.submitTranslator=function(){
		        var firstName=$scope.translator.firstName
		        var lastName=$scope.translator.lastName
		        var tele=$scope.translator.tele
		        var email=$scope.translator.email
		        var remark=$scope.translator.remark
	 	$http.post('/translator/'+firstName+'/'+lastName+'/'+tele+'/'+email+'/'+remark).success(function(response){
	 		console.log(response);
	 		alert("successfully inserted")
	 		    $scope.translator.firstName="";
		        $scope.translator.lastName="";
		        $scope.translator.tele="";
		        $scope.translator.email="";
		        $scope.translator.remark="";
	 	});
    }
    $scope.showImage=function(){
    	var contactId=$scope.contactId
    	$http.get('/showImage/'+contactId).then(function(response){
    		$scope.mydata=response.data[0].fileName
    		console.log($scope.mydata)
		   
        })
    }
    // $scope.getImage=function(){
    // 	var filename=$scope.mydata
    // 	$http.get('/images/'+filename).then(function(response){
    // 		$scope.item=response.data
    // 		console.log($scope.item)
    // 	})
    // }
   
    /*
    translats the label to tigrigna ,english and dutch
    */
	$scope.tig=function(){
		document.getElementById("ltrasportTypeId").innerHTML="መጓዓዝያ"
		document.getElementById("lfromCityId").innerHTML="ካብ"
		document.getElementById("ltoCityId").innerHTML="ናብ"
		document.getElementById("ldateId").innerHTML="ዕለት"
		document.getElementById("lpreferedTrans").innerHTML="መጓዓዝያ ካልኣይ ምርጫ"
		document.getElementById("lfirstNameId").innerHTML="ስም"
		document.getElementById("llastNameId").innerHTML="ስም ኣቦ"
		document.getElementById("lteleId").innerHTML="ቴለፎን"
		document.getElementById("lemailId").innerHTML="ኢመይል"
		
		document.getElementById("iOwnTransport").innerHTML="መጓዓዝያ ኣላትኒ ንእግረመንገደይ ሰብ ክማላእላ ድሉው ኢየ።"
		document.getElementById("lcode").innerHTML="ኮድ ናይ ክትወስደካ ደሊኻ ዘለኻ መጓዓዝያ።"
		document.getElementById("submitId").value="ሓበሬታኻ ኣረክብ"
		document.getElementById("lownerTransportTypeId").innerHTML="ትውንና መጓዓዝያ"
		document.getElementById("lownerFromCityId").innerHTML="ካብ"
		document.getElementById("lownerToCityId").innerHTML="ናብ"
		document.getElementById("lownerDateId").innerHTML="ዕለት"
		document.getElementById("activeFromToId").innerHTML="ካብ ሰዓት ክንደይ ክሳብ ሰዓት ክንደይ ኣብ ስራሕ ኣላ "
		document.getElementById("lnumberOfSeatsId").innerHTML="ብዝሒ ኮፍ መበሊ ዘለዋ"
		document.getElementById("ladditionalInfoId").innerHTML="ተወሳኺ ሓበሬታ"
		document.getElementById("lownerCode").innerHTML="መለለዩ ኮድ"
		document.getElementById("ownerSubmitId").value="ሓበሬታኻ ኣረክብ"
	}
	$scope.eng=function(){
		document.getElementById("ltrasportTypeId").innerHTML="Transport type"
		document.getElementById("lfromCityId").innerHTML="From"
		document.getElementById("ltoCityId").innerHTML="To"
		document.getElementById("ldateId").innerHTML="Date"
		document.getElementById("lpreferedTrans").innerHTML="Preferable transport"
		document.getElementById("lfirstNameId").innerHTML="Name"
		document.getElementById("llastNameId").innerHTML="Last Nmae"
		document.getElementById("lteleId").innerHTML="Telephone"
		document.getElementById("lemailId").innerHTML="Email"
		document.getElementById("submitId").value="Submit"
		document.getElementById("iOwnTransport").innerHTML="I own a transport and I am ready for this job"
		document.getElementById("lcode").innerHTML="code of the transportation that you supposed to go with"
		document.getElementById("lownerTransportTypeId").innerHTML="Transport type"
		document.getElementById("lownerFromCityId").innerHTML="From"
		document.getElementById("lownerToCityId").innerHTML="To"
		document.getElementById("lownerDateId").innerHTML="Date"
		document.getElementById("activeFromToId").innerHTML="Active From-To "
		document.getElementById("lnumberOfSeatsId").innerHTML="Number of seats"
		document.getElementById("ladditionalInfoId").innerHTML="Aditional information"
		document.getElementById("lownerCode").innerHTML="code"
		document.getElementById("ownerSubmitId").value="Submit"
	}
	$scope.dutch=function(){
		document.getElementById("ltrasportTypeId").innerHTML="Vervoer-"
		document.getElementById("lfromCityId").innerHTML="Van"
		document.getElementById("ltoCityId").innerHTML="Naar"
		document.getElementById("ldateId").innerHTML="Datum"
		document.getElementById("lpreferedTrans").innerHTML="Geprefereerde transport"
		document.getElementById("lfirstNameId").innerHTML="Naam"
		document.getElementById("llastNameId").innerHTML="Achternaam"
		document.getElementById("lteleId").innerHTML="Telefoon"
		document.getElementById("lemailId").innerHTML="E-mail"
	    document.getElementById("submitId").value="Voorleggen"
		document.getElementById("iOwnTransport").innerHTML="Ik ben eigenaar van een transportbedrijf en ik ben klaar voor deze baan"
		document.getElementById("lcode").innerHTML="code van het vervoer dat je verondersteld om te gaan met"
		document.getElementById("lownerTransportTypeId").innerHTML="Vervoer"
		document.getElementById("lownerFromCityId").innerHTML="Van"
		document.getElementById("lownerToCityId").innerHTML="Naar"
		document.getElementById("lownerDateId").innerHTML="Datum"
		document.getElementById("activeFromToId").innerHTML="Actief t/m"
		document.getElementById("lnumberOfSeatsId").innerHTML="aantal zitplaatsen"
		document.getElementById("ladditionalInfoId").innerHTML="Extra informatie"
		document.getElementById("lownerCode").innerHTML="Code"
		document.getElementById("ownerSubmitId").value="Voorleggen"
	}

	$scope.translationtig=function(){
		document.getElementById("lfirstNameId").innerHTML="ስም"
		document.getElementById("lteleId").innerHTML="ቴለፎን"
		document.getElementById("iamtranslator").innerHTML="ተርጓማይ ኢየ።"
		document.getElementById("lemailId").innerHTML="ኢመይል"
		document.getElementById("lremarkId").innerHTML="ተወሳኺ ሓቤሬታ"
		document.getElementById("submitId").value="ሓበሬታኻ ኣረክብ"
		document.getElementById("btnloadDocument").value="ጸዓን"
		document.getElementById("lfirstNameIdTranslator").innerHTML="ስም"
		document.getElementById("llastNameIdTranslator").innerHTML="ስም ኣቦ"
		document.getElementById("lteleIdTranslator").innerHTML="ቴለፎን"
		document.getElementById("lemailIdTranslator").innerHTML="ኢመይል"
		document.getElementById("ldate").innerHTML="ን መዓስ ዕለት"
		document.getElementById("ltimeFrom").innerHTML="ካብ ሰዓት"
		document.getElementById("ltimeTo").innerHTML="ክሳብ ሰዓት"
		document.getElementById("lemailIdTranslator").innerHTML="ኢመይል"
		document.getElementById("lremarkIdTranslator").innerHTML="ተወሳኺ ሓቤሬታ"
		document.getElementById("documentLoader").innerHTML="ዝትርጎም ዶኩመንት ኣለኒ"
		document.getElementById("luploadurdoc").innerHTML="ዶኩመንትኻ ጸዓን"
		document.getElementById("submitIdTranslator").value="ሓበሬታኻ ኣረክብ"
	}
	$scope.translationeng=function(){
		document.getElementById("lfirstNameId").innerHTML="First Name"
		document.getElementById("lteleId").innerHTML="Telephone"
		document.getElementById("lemailId").innerHTML="Email"
		document.getElementById("ldate").innerHTML="When"
		document.getElementById("ltimeFrom").innerHTML="time from"
		document.getElementById("ltimeTo").innerHTML="time to"
		document.getElementById("iamtranslator").innerHTML="I am a translator"
		document.getElementById("lremarkId").innerHTML="Remark"
		document.getElementById("submitId").value="Submit"
		document.getElementById("btnloadDocument").value="Load"
		document.getElementById("lfirstNameIdTranslator").innerHTML="First Name"
		document.getElementById("llastNameIdTranslator").innerHTML="Last Name"
		document.getElementById("lteleIdTranslator").innerHTML="Telephone"
		document.getElementById("lemailIdTranslator").innerHTML="Email"
		document.getElementById("lremarkIdTranslator").innerHTML="Remark"
		document.getElementById("documentLoader").innerHTML="I have document to translate"
		document.getElementById("luploadurdoc").innerHTML="Upload your documents"
		document.getElementById("submitIdTranslator").value="Submit"
	}
	$scope.translationdutch=function(){
		document.getElementById("lfirstNameId").innerHTML="Naam"
		document.getElementById("lteleId").innerHTML="Telefoon"
		document.getElementById("lemailId").innerHTML="E-mail"
		document.getElementById("ldate").innerHTML="Wanneer"
		document.getElementById("ltimeFrom").innerHTML="tijd uit"
		document.getElementById("ltimeTo").innerHTML="tijd om"
		document.getElementById("iamtranslator").innerHTML="Ik ben vertalen"
		document.getElementById("lremarkId").innerHTML="opmerking"
		document.getElementById("submitId").value="Voorleggen"
	    document.getElementById("btnloadDocument").value="Laden"
		document.getElementById("lfirstNameIdTranslator").innerHTML="Naam"
		document.getElementById("llastNameIdTranslator").innerHTML="Achter Naam"
		document.getElementById("lteleIdTranslator").innerHTML="Telefoon"
		document.getElementById("lemailIdTranslator").innerHTML="E-mail"
		document.getElementById("lremarkIdTranslator").innerHTML="opmerking"
		document.getElementById("documentLoader").innerHTML="Ik heb document te vertalen"
		document.getElementById("luploadurdoc").innerHTML="upload uw documenten"
		document.getElementById("submitIdTranslator").value="Voorleggen"
	}
  


});
