angular.module('kraken.controllers')
.controller('historyController', ['$scope', 'krakenService', '$ionicLoading', 'configService', '$state',
    function ($scope, krakenService, $ionicLoading, configService, $state) {

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

        $scope.history = {};
        $scope.history.operations = [];

        $scope.updateHistory = function (reload) {
            $ionicLoading.show({template: "Loading..."});
            return krakenService.getTradeHistory(reload)
            .then(function (history) {
                $scope.history.operations = [];//history.trades;
                for (var id in history.trades) {
                    history.trades[id].id = id;
                    history.trades[id].datetime = new Date(Math.floor(history.trades[id].time) * 1000);
                    $scope.history.operations.push(history.trades[id]);
                }
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.updateHistory(false);

    }]);
