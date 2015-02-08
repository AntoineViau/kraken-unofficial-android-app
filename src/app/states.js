angular.module('kraken')
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('splashscreen', {
        url: '/splashscreen',
        templateUrl: 'app/app/splashscreen.html',
        controller: 'splashScreenController'
    })
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "app/tabs/tabs.html"
    })

    .state('tab.dash', {
        url: '/dash',
        views: {
            'tab-dash': {
                templateUrl: 'app/tab-dash/tab-dash.html',
                controller: 'dashboardController'
            }
        }
    })

    .state('tab.orders', {
        url: '/orders',
        views: {
            'tab-dash': {
                templateUrl: 'app/tab-orders/tab-orders.html',
                controller: 'ordersController'
            }
        }
    })

    .state('tab.history', {
        url: '/history',
        views: {
            'tab-dash': {
                templateUrl: 'app/tab-history/tab-history.html',
                controller: 'historyController'
            }
        }
    })

    .state('tab.trade', {
        url: '/trade',
        views: {
            'tab-trade': {
                templateUrl: 'app/tab-trade/tab-trade.html',
                controller: 'tradeController'
            }
        }
    })
    .state('tab.tradeReview', {
        url: '/tradeReview',
        views: {
            'tab-trade': {
                templateUrl: 'app/tab-trade/tradeReview.html',
                controller: 'tradeReviewController'
            }
        }
    })

    .state('tab.parameters', {
        url: '/parameters',
        views: {
            'tab-parameters': {
                templateUrl: 'app/tab-parameters/tab-parameters.html',
                controller: 'parametersController'
            }
        }
    })

    .state('tab.informations', {
        url: '/informations',
        views: {
            'tab-informations': {
                templateUrl: 'app/tab-informations/tab-informations.html',
                controller: 'informationsController'
            }
        }
    });

    $urlRouterProvider.otherwise('/splashscreen');

});

