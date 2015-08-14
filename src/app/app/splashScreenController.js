angular.module('kraken.controllers')
.controller('splashScreenController', ['$scope', 'configService', 'krakenService', '$state', '$timeout', '$ionicActionSheet',
    function ($scope, configService, krakenService, $state, $timeout, $ionicActionSheet) {

        console.log("Entering splashScreenController...");

        $scope.app = {};
        $scope.app.readyToGo = true; // TODO : Pour tester l'héritage de scope

        var _wait = function () {
            console.log("Wait a little bit...");
            return $timeout(function () {
                console.log("wait done");
            }, 500);
        };

        var _checkConnection = function () {
            console.log("Check connection with Kraken");
            $scope.app.infos = "Contacting Kraken...";
            return krakenService.getServerTime()
            .catch(function () {
                var hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: 'Try again'}
                    ],
                    destructiveText: 'Quit',
                    titleText: 'Could not connect to Kraken !',
                    buttonClicked: function (index) {
                        console.log("try again");
                        _checkConnection();
                        return true;
                    }
                    , destructiveButtonClicked: function () {
                        if (ionic.Platform.isWebView() === true) {
                            ionic.Platform.exitApp();
                        } else {
                            console.log('quit');
                        }
                        return true;
                    }
                });
            });
        };

        var _loadConfig = function () {
            $scope.app.infos = "Loading configuration...";
            console.log("loadConfig()");
            return configService.load();
        };

        var _initialize = function () {
            krakenService.setApiKey(configService.getApiKey());
            krakenService.setPrivateKey(configService.getPrivateKey());
        };

        var _goToDashboard = function () {
            $scope.app.infos = "Configuration complete !";
            console.log("goToDash()");
            $state.go('tab.dash');
        };

        _checkConnection()
        .then(_wait)
        .then(_loadConfig)
        .then(_wait)
        .then(_initialize)
        .then(_wait)
        .then(_goToDashboard);
    }]);
