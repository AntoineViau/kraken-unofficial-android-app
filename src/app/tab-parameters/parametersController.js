angular.module('kraken.controllers')
.controller('parametersController', ['$scope', 'configService', 'keysScannerService', 'krakenService', '$ionicActionSheet', '$timeout', '$ionicLoading', '$state',
    function ($scope, configService, keysScannerService, krakenService, $ionicActionSheet, $timeout, $ionicLoading, $state) {

        // For debug purpose :
        if (ionic.Platform.isWebView( ) === false) {
            configService.load();
            krakenService.setApiKey(configService.getApiKey());
            krakenService.setPrivateKey(configService.getPrivateKey());
        }

        $scope.parameters = {};
        $scope.parameters.apiKey = configService.getApiKey();
        $scope.parameters.privateKey = configService.getPrivateKey();
        $scope.parameters.keysNotInitialized = configService.getApiKey() === null || configService.getPrivateKey() === null;

        $scope.onApiKeyChange = function () {
            configService.setApiKey($scope.parameters.apiKey);
            krakenService.setApiKey($scope.parameters.privateKey);
        };

        $scope.onPrivateKeyChange = function () {
            configService.setPrivateKey($scope.parameters.privateKey);
            krakenService.setPrivateKey($scope.parameters.privateKey);
        };

        $scope.keysNowInitialized = function () {
            return configService.getApiKey() !== '' && configService.getPrivateKey() !== '';
        };

        $scope.scanKeys = function () {
            keysScannerService.scan()
            .then(function (keys) {
                if (keys !== false) {
                    configService.setApiKey(keys.apiKey);
                    configService.setPrivateKey(keys.privateKey);
                    krakenService.setApiKey(keys.apiKey);
                    krakenService.setPrivateKey(keys.privateKey);
                    $scope.parameters.apiKey = keys.apiKey;
                    $scope.parameters.privateKey = keys.privateKey;
                } else {
                    // Does not work... ?
                    $state.go('tab.parameters');
                }
            });
        };

        $scope.testKeys = function () {
            $ionicLoading.show({template: "Testing..."});
            krakenService.getAccountBalances()
            .then(function (data) {
                $ionicLoading.hide();
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: '<b>Success !</b>'}
                    ]
                });
                $timeout(function () {
                    hideSheet();
                }, 2000);
            })
            .catch(function (error) {
                $ionicLoading.hide();
                var hideSheet = $ionicActionSheet.show({
                    destructiveText: '<b>Oups, theses keys did not work...</b>'
                });
                $timeout(function () {
                    hideSheet();
                }, 2000);
            });
        };

    }]);
