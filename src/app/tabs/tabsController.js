angular.module('kraken.controllers')
.controller('tabsController', ['$scope', 'configService', '$state',
    function ($scope, configService, $state) {

        console.log("Entering tabsController...");

        // Needed if we want to bypass the view history stack
        // (since nav-clear does not affect ion-tab)
        $scope.goTo = function (tabId) {
            $state.go(tabId);
        };

        $scope.saveConfig = function () {
            configService.save();
        };

    }]);
