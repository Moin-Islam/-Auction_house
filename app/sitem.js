var app = angular.module("SingleItem", []);

app.controller("SingleItemCtrl", [
  "$scope",
  "$interval",
  "$window",
  function ($scope, $interval) {
    const QuerySearch = window.location.search;
    const UrlParams = new URLSearchParams(QuerySearch);
    const AuctionId = UrlParams.get("productId");
    $scope.associatedTimeRemaining = new Map();
    let OngoingBidInfo;

    let AuctionInfo = {
      auction_id: AuctionId,
    };

    let FetchAuctionDetail = function () {
      $.ajax({
        type: "POST",
        url: "http://localhost/api/services/AuctionServices.php?service=FetchItemDetails",
        data: JSON.stringify(AuctionInfo),
      }).then(function (response) {
        $scope.AuctionDetail = response;
        const segments = $scope.AuctionDetail.item_image.split("/");
        const imageIdSegment = segments[5];
        const constructImageUrl = `https://drive.google.com/uc?id=${imageIdSegment}`;
        $scope.AuctionDetail.item_image = constructImageUrl;
        console.log($scope.AuctionDetail.item_image);
        console.log($scope.AuctionDetail);
        $scope.$applyAsync();
      });
      console.log("hello");
    };

    FetchAuctionDetail();

    let FetchOngoingBid = function () {
      $.ajax({
        type: "POST",
        url: "http://localhost/api/services/BidServices.php?service=FetchOngoingBid",
        data: JSON.stringify(AuctionInfo),
      }).then(function (response) {
        OngoingBidInfo = response;
        $scope.OngoingBid = response.bid_amount;
        console.log(OngoingBidInfo);
        $scope.$applyAsync();
      });
    };
    FetchOngoingBid();

    let FetchBidHistory = function () {
      $.ajax({
        type: "POST",
        url: "http://localhost/api/services/BidServices.php?service=FetchBidHistory",
        data: JSON.stringify(AuctionInfo),
      }).then(function (response) {
        $scope.BidHistory = response[0].records;
        $scope.TotalBid = response.total_bid_placed;
        console.log($scope.BidHistory);
        $scope.$applyAsync();
      });
    };
    FetchBidHistory();

    $scope.PlaceBid = function () {
      alert("Are you sure you want to place a bid?");
      if (sessionStorage.getItem("user_id")) {
        const UserId = sessionStorage.getItem("user_id");
        if (UserId != OngoingBidInfo.bidder_id) {
          let newBid = parseInt($scope.OngoingBid) + 500;
          let NewBidInfo = {
            auction_id: AuctionId,
            bidder_id: UserId,
            bid_amount: newBid,
          };

          $.ajax({
            type: "POST",
            url: "http://localhost/api/services/BidServices.php?service=NewBid",
            data: JSON.stringify(NewBidInfo),
          }).then(function (response) {
            console.log(response);
          });
          console.log(AuctionId, UserId, newBid);
          location.reload();
        } else {
            alert("The last bid belongs to you, can't place a new bid again");
        }
      } else {
        alert("Please Log in to place your bid");
      }
    };

    let FetchActiveAuctions = function () {
      return $.ajax({
        type: "GET",
        url: "http://localhost/api/services/AuctionServices.php?service=ActiveAuctions",
      }).then(function (response) {
        records = response.records;
        console.log(records, "aa");
        return records;
      });
    };

    let constructImageUrl = function (imageUrl) {
      const segments = imageUrl.split("/");
      const imageIdSegment = segments[5];
      const constructedImageUrl = `https://drive.google.com/uc?id=${imageIdSegment}`;
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
        if ($scope.associatedTimeRemaining.get(end_time)) {
          $scope.associatedTimeRemaining.set(end_time, x);
          $scope.DaysLeft = $scope.associatedTimeRemaining.get(end_time).days;
          $scope.HoursLeft = $scope.associatedTimeRemaining.get(end_time).hours;
          $scope.Minutesleft =
            $scope.associatedTimeRemaining.get(end_time).minutes;
          $scope.SecondsLeft =
            $scope.associatedTimeRemaining.get(end_time).seconds;
        } else {
          $scope.associatedTimeRemaining.set(end_time, x);
        }
      }, 1000);
    };

    FetchActiveAuctions().then(function () {
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

    $scope.DirecttoProduct = function (ProductId) {
      console.log(ProductId);
      var url = new URL("http://127.0.0.1:5501/sitem.html");
      url.searchParams.append("productId", ProductId);
      window.location.href = url;
    };
  },
]);
