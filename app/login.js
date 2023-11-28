var app = angular.module("Login", []);

app.controller("LoginCtrl", ["$scope", "$window", function($scope, $window){
    $scope.email = "";
    $scope.password = "";

    $scope.HandleAction = function (e){
        e.preventDefault;
        
        var loginInfo = {
            email : $scope.email,
            password : $scope.password
        }

        $.ajax({
            type: "POST",
            url: "http://localhost/api/services/UserServices.php?service=authentication",
            data: JSON.stringify(loginInfo),
            success: function (response) {
                console.log(response);
            }
        });
    }
}]);

