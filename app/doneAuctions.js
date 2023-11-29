var app = angular.module("DoneAuctions", []);

app.controller("DoneAuctionsCtrl", [
  "$scope",
  "$window",
  "$interval",
  function ($scope, $interval) {
    $scope.ActiveAuctions = [];
    $scope.associatedTimeRemaining = new Map();

    $scope.FetchActiveAuctions = function () {
      return $.ajax({
        type: "GET",
        url: "http://localhost/api/services/AuctionServices.php?service=FetchCompletedAuctions",
      }).then(function (response) {
        records = response.records;
        //console.log(records, "aa");
        return records;
      });
    };

    let constructImageUrl = function (imageUrl) {
      const segments = imageUrl.split("/");
      const imageIdSegment = segments[5];
      //imageId = imageIdSegment.substring(2);
      //console.log(imageIdSegment);
      const constructedImageUrl = `https://drive.google.com/uc?id=${imageIdSegment}`;
      console.log(constructedImageUrl);
      return constructedImageUrl;
    };

   /* let calculateTimeRemaining = function (end_time) {
      let intervalId = $interval(function () {
        const deadline = new Date(end_time).getTime();
        const now = new Date().getTime();
        const timeRemaining = deadline - now;

        if (timeRemaining <= 0) {
          console.log("Time remaining has reached zero.");
          $interval.cancel(intervalId);
          return;
        }

        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        let hours = Math.floor(
          (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        let minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        let x = {
          days: days,
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        };
        
        let a = [];
        if ($scope.associatedTimeRemaining.get(end_time)) {
          $scope.associatedTimeRemaining.set(end_time, x);
        } else {
          $scope.associatedTimeRemaining.set(end_time, x);
        }
      }, 1000);
    };*/

    $scope.FetchActiveAuctions().then(function () {
      records.forEach((record) => {
        record.item_image = constructImageUrl(record.item_image);
      });

      $scope.ActiveAuctions = records;
      /*$scope.ActiveAuctions.forEach((item) => {
        let timeRemaining = calculateTimeRemaining(item.end_date);
      });*/
      $scope.$applyAsync();
      console.log($scope.ActiveAuctions);
    });

    $scope.DirecttoProduct = function (ProductId) {
      console.log(ProductId);
      var url = new URL("http://127.0.0.1:5501/finishedItem.html");
      url.searchParams.append("productId", ProductId);
      window.location.href = url;
    };
  },
]);
