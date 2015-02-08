angular.module('kraken.controllers', []);
angular.module('kraken.services', []);

angular.module('kraken', ['ionic', 'kraken.controllers', 'kraken.services'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function (configService) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});

