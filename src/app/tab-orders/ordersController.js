angular.module('kraken.controllers')
.controller('ordersController', ['$scope', '$ionicLoading', 'krakenService', 'configService', '$state',
    function ($scope, $ionicLoading, krakenService, configService, $state) {

        console.log("Entering ordersController...");

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

        $scope.orders = {};
        $scope.orders.openOrders = {};
        $scope.orders.noOpenOrders = true;
        $scope.orders.closedOrders = {};
        $scope.orders.noClosedOrders = true;

        var _updateOrders = function (reload) {
            return krakenService.getOpenOrders(reload)
            .then(function (orders) {
                $scope.orders.openOrders = [];
                for (var id in orders) {
                    orders[id].id = id;
                    orders[id].openDateTime = new Date(Math.floor(orders[id].opentm) * 1000);
                    $scope.orders.openOrders.push(orders[id]);
                }
            })
            .then(function () {
                return krakenService.getClosedOrders(reload);
            })
            .then(function (orders) {
                $scope.orders.closedOrders = [];
                for (var id in orders) {
                    orders[id].id = id;
                    orders[id].closedDateTime = new Date(Math.floor(orders[id].closetm) * 1000);
                    $scope.orders.closedOrders.push(orders[id]);
                }
            });
        };

        $scope.updateOrders = function (reload) {
            $ionicLoading.show({template: "Loading..."});
            _updateOrders(reload)
            .then(function () {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })
            .catch(function () {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $state.go('tab.dash');
            });
        };

        $scope.updateOrders(true);

    }]);
