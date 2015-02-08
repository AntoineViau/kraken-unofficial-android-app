/**
 * configService acts as a data container and a load/save service.
 * All setters and getters are synchronous.
 * Load and save are asynchronous and thus return promises.
 */
angular.module("kraken").factory("configService", ["$q", function ($q) {

        var _apiKey = null;
        var _privateKey = null;
        var _loaded = false;

        _service = {
            setApiKey: function (apiKey) {
                _apiKey = apiKey;
            }
            ,
            setPrivateKey: function (privateKey) {
                _privateKey = privateKey;
            }
            ,
            getApiKey: function () {
                if (_apiKey !== '' && typeof (_apiKey) !== 'undefined' && _apiKey !== null) {
                    return _apiKey;
                }
                return null;
            }
            ,
            getPrivateKey: function () {
                if (_privateKey !== '' && typeof (_privateKey) !== 'undefined' && _privateKey !== null) {
                    return _privateKey;
                }
                return null;
            }
            ,
            load: function () {
                console.log("configService.load()");
                var promiseManager = $q.defer();
                _apiKey = window.localStorage.getItem('apiKey');
                _privateKey = window.localStorage.getItem('privateKey');
                promiseManager.resolve();
                return promiseManager.promise;
            }
            ,
            isLoaded: function () {
                return _loaded;
            }
            ,
            save: function () {
                console.log("configService.save()");
                var promiseManager = $q.defer();
                window.localStorage.setItem('apiKey', _service.getApiKey());
                window.localStorage.setItem('privateKey', _service.getPrivateKey());
                promiseManager.resolve();
                return promiseManager.promise;
            }

        };
        return _service;

    }]);