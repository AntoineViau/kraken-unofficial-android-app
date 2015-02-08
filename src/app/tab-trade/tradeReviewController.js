angular.module('kraken.controllers')
.controller('tradeReviewController', ['$scope', 'tradeService', '$state', '$ionicLoading',
    function ($scope, tradeService, $state, $ionicLoading) {

        $scope.review = {};
        $scope.review.type = tradeService.getType();
        $scope.review.orderType = tradeService.getOrderType();
        $scope.review.tradedPair = tradeService.getPair();
        $scope.review.volume = tradeService.getVolume();
        $scope.review.price = tradeService.getPrice();
        $scope.review.totalCost = tradeService.getTotalCost();
        $scope.review.error = '';

        $scope.cancelOrder = function () {
            $state.go('tab.trade');
        };

        $scope.submitOrder = function () {
            $ionicLoading.show({template: "Processing..."});
            tradeService.addOrder()
            .then(function (data) {
                $state.go('tab.orders');
                $ionicLoading.hide();
            })
            .catch(function (error) {
                $ionicLoading.hide();
                $scope.review.error = error;
            });
        };

    }]);
