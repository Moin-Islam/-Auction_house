var app = angular.module("Index", []);

app.controller("IndexCtrl", [
  "$scope",
  "$window",
  "$interval",
  function ($scope, $window, $interval) {
    let HttpResponse;
    let records = [];
    $scope.ActiveAuctions = [];
    $scope.associatedTimeRemaining = new Map();

    $scope.FetchActiveAuctions = function () {
      return $.ajax({
        type: "GET",
        url: "http://localhost/api/services/AuctionServices.php?service=ActiveAuctions",
      }).then(function (response) {
        records = response.records;
        console.log(records);
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

    let calculateTimeRemaining = function (end_time) {
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
        /*let existingRecord = {
          auctionId: end_time,
          timeRemaining: x,
        };*/
        let a = [];
        if ($scope.associatedTimeRemaining.get(end_time)) {
          $scope.associatedTimeRemaining.set(end_time, x);
          //console.log(typeof($scope.associatedTimeRemaining));
          console.log($scope.associatedTimeRemaining);
          
          /*for (i = 0; i< $scope.associatedTimeRemaining.size;i++)
          {
            //a.push
          }*/

        } else {
          $scope.associatedTimeRemaining.set(end_time, x);
          //console.log($scope.associatedTimeRemaining);
        }

        //$scope.associatedTimeRemaining.push(existingRecord);
        //console.log($scope.associatedTimeRemaining);
      }, 1000);
    };

    $scope.FetchActiveAuctions().then(function () {
      records.forEach((record) => {
        record.item_image = constructImageUrl(record.item_image);
      });

      $scope.ActiveAuctions = records;
      $scope.ActiveAuctions.forEach((item) => {
        let timeRemaining = calculateTimeRemaining(item.end_date);
      });
      $scope.$applyAsync();
      console.log($scope.ActiveAuctions);
    });

    console.log($scope.associatedTimeRemaining);
  },
]);



/*
app.directive("auctionTimer", function () {
  return {
    restrict: "EA",
    scope: {
      auction: "=auction",
      associatedTimeRemaining: '=associatedTimeRemaining'
    },
    link: function (scope, element) {
      const timerData = associatedTimeRemaining[scope.auction.end_date];
      const updateTimerDisplay = () => {
        if (timerData) {
          const timeLeft = timerData.timeRemaining;
          element.text(
            `${timeRemaining.day} days, ${timeRemaining.hours} hours, ${timeRemaining.minutes} minutes, ${timeRemaining.seconds} seconds`
          );
        } else {
          element.text("Time remaining unavailable");
        }
      };
      const timerIntervalId = $interval(updateTimerDisplay, 1000);
      $scope.on ('$destroy', () => {
        $interval.cancel(timerIntervalId);
      })
    },
  };
});*/
