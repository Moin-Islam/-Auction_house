var app = angular.module("Registration", []);

app.controller("RegistrationCtrl",["$scope", "$window", function($scope, $window) {
    $scope.email ="";
    $scope.password = "";
    $scope.username = "";
    $scope.first_name = "";
    $scope.last_name = "";
    $scope.phone_number = "";
    $scope.address = "";

    $scope.HandleAction = function (e){
        e.preventDefault();

        var UserInfo = {
            username : $scope.username,
            email : $scope.email,
            password : $scope.password,
            first_name : $scope.first_name,
            last_name : $scope.last_name,
            phone_number : $scope.phone_number,
            address : $scope.address
        };

        $.ajax({
            type: "POST",
            url: "http://localhost/api/services/UserServices.php?service=CreateUser",
            data: JSON.stringify(UserInfo),
            success: function (response) {
                console.log(response);
            }
        });
    }
}]);