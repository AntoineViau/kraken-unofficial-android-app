angular.module('kraken.controllers')
.controller('tradeController', ['$scope', 'configService', 'krakenService', '$ionicModal', 'tradeService', '$state', '$ionicLoading',
    function ($scope, configService, krakenService, $ionicModal, tradeService, $state, $ionicLoading) {

        // For debug purpose :
        if (ionic.Platform.isWebView( ) === false) {
            configService.load();
            krakenService.setApiKey(configService.getApiKey());
            krakenService.setPrivateKey(configService.getPrivateKey());
        }

        if (configService.getApiKey() === null || configService.getPrivateKey() === null) {
            $state.go('tab.parameters');
            return;
        }

        $scope.trade = {};

        $scope.setBuying = function () {
            $scope.isBuying = true;
            $scope.isSelling = false;
        };
        $scope.setSelling = function () {
            $scope.isBuying = false;
            $scope.isSelling = true;
        };

        $scope.setLimit = function () {
            $scope.isLimit = true;
            $scope.isMarket = false;
            $scope.calculateTotalCost();

        };
        $scope.setMarket = function () {
            $scope.isLimit = false;
            $scope.isMarket = true;
            $scope.trade.price = NaN;
            $scope.calculateTotalCost();
        };

        $ionicModal.fromTemplateUrl('app/tab-trade/selectAssetPair.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            krakenService.getTradableAssetPairs()
            .then(function (pairs) {
                $scope.trade.tradablePairs = pairs;
            });
        });

        $scope.selectTradablePair = function () {
            $scope.modal.show();
        };

        $scope.selectTradablePairDone = function (ok) {
            $scope.modal.hide();
            $ionicLoading.show({template: "Loading..."});
            krakenService.getTradablePairById($scope.trade.tradablePairId)
            .then(function (pair) {
                $scope.trade.tradablePair = pair;
                return krakenService.getLastTrade(pair.id);
            })
            .then(function (value) {
                $scope.trade.tradablePairValue = value;
                $ionicLoading.hide();
                $scope.calculateTotalCost();
            });
        };

        $scope.calculateTotalCost = function () {
            $scope.trade.totalCost = NaN;
            if ($scope.isMarket === true && !isNaN($scope.trade.volume)) {
                $scope.trade.totalCost = $scope.trade.volume * $scope.trade.tradablePairValue;
            } else {
                if ($scope.trade.price > 0 && !isNaN($scope.trade.volume) && !isNaN($scope.trade.price)) {
                    $scope.trade.totalCost = $scope.trade.volume * $scope.trade.price;
                }
            }
        };

        $scope.onVolumeChange = function () {
            $scope.calculateTotalCost();
        };

        $scope.onPriceChange = function () {
            $scope.calculateTotalCost();
        };

        $scope.goToReview = function () {
            tradeService.setType($scope.isBuying === true ? 'Buy' : 'Sell');
            tradeService.setOrderType($scope.isMarket === true ? 'Market' : 'Limit');
            tradeService.setPair($scope.trade.tradablePair);
            tradeService.setVolume($scope.trade.volume);
            tradeService.setPrice($scope.isMarket === true ? $scope.trade.tradablePairValue : $scope.trade.price);
            tradeService.setTotalCost($scope.trade.totalCost);
            $state.go('tab.tradeReview');
        };

        $scope.pricePlaceHolder = "Price";
        $scope.trade.volume = NaN;
        $scope.trade.price = NaN;
        $scope.totalCost = 0;
        $scope.setBuying();
        $scope.setMarket();

    }]);
