 var myApp=angular.module('myApp',[]);
    myApp.controller('mycontroller',function($scope,$http){
         $scope.showImage=function(){
            var contactId=$scope.contactId
            $http.get('/public/saleThingsImageCollector/'+contactId).then(function(response){
                $scope.mydata=response.data[0].fileName
                console.log($scope.mydata)
               
            })
    }

    })