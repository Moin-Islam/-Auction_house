var app = angular.module("fSingleItem", []);

app.controller("fSingleItemCtrl", [
  "$scope",
  "$interval",
  "$window",
  function ($scope, $interval) {
    const QuerySearch = window.location.search;
    const UrlParams = new URLSearchParams(QuerySearch);
    const AuctionId = UrlParams.get("productId");

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

    FetchActiveAuctions().then(function () {
      records.forEach((record) => {
        record.item_image = constructImageUrl(record.item_image);
      });
      $scope.ActiveAuctions = records;
      $scope.$applyAsync();
      console.log($scope.ActiveAuctions);
    });

    let FetchHighestBid = function()
    {
        $.ajax({
            type: "POST",
            url: "http://localhost/api/services/BidServices.php?service=FetchHighestBid",
            data: JSON.stringify(AuctionInfo)
        }).then(function (response) {
            $scope.HighestBid = response.highest_bid;
            console.log($scope.HighestBid);
            $scope.$applyAsync();
        })
    }

    FetchHighestBid();

  },
]);
