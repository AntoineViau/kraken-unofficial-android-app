angular.module('kraken.controllers')
.controller('dashboardController', ['$scope', '$state', 'krakenService', '$ionicLoading', 'configService',
    function ($scope, $state, krakenService, $ionicLoading, configService) {

        console.log("Entering dashboard controller...");

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

        var _updateBalances = function (reload) {
            console.log('_updateBalances');
            return krakenService.getAccountBalances(reload)
            .then(function (balances) {
                $scope.balances = balances;
            })
            .then(function () {
                return krakenService.getTradeBalance();
            })
            .then(function (result) {
                $scope.tradeBalance = result.tb;
            });
        };

        $scope.update = function (reload) {
            $ionicLoading.show({template: "Loading..."});
            return _updateBalances(reload)
            .then(function () {
                console.log('hide ionicloading');
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })
            .catch(function (error) {
                $scope.error = error;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.error = '';
        $scope.update();

    }]);
