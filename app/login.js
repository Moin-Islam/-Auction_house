var app = angular.module("Login", []);

app.controller("LoginCtrl", ["$scope", "$window", function($scope, $window){
    $scope.email = "";
    $scope.password = "";
    let userId;

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
                userId = response.user_id;
                if(!sessionStorage.getItem("user_id"))
                {
                    sessionStorage.setItem("user_id", userId)
                }
                console.log(sessionStorage.getItem("user_id"));
                window.location.href = "index.html";
            }
        });
    }
}]);

