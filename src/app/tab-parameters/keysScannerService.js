angular.module("kraken").factory("keysScannerService", ["$q", function ($q) {

        var _header = "kraken://apikey?";
        var _codeString;
        var _keys = {apiKey: "", privateKey: ""};
        var _promiseManager = null;

        var _extractKeys = function () {
            var valuesString = _codeString.substring(_header.length);
            var vars = valuesString.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] === "key") {
                    _keys.apiKey = pair[1];
                }
                if (pair[0] === "secret") {
                    _keys.privateKey = pair[1];
                }
            }
        };
        _scan = function () {
            cordova.plugins.barcodeScanner.scan(
            function (result) {
                if (result.cancelled === true) {
                    _promiseManager.resolve(false);
                    return;
                }
                _codeString = result.text;
                if (_codeString.indexOf(_header) !== 0) {
                    _promiseManager.reject()("Invalid code !");
                    return;
                }
                _extractKeys();
                _promiseManager.resolve(_keys);
            },
            function (error) {
                $q.reject()(error);
            }
            );
        };
        return {
            scan: function () {
                _promiseManager = $q.defer();
                if (ionic.Platform.isWebView() === true) {
                    _scan();
                } else {
                    _keys.apiKey = "";
                    _keys.privateKey = "";
                    _promiseManager.resolve(_keys);
                }
                return _promiseManager.promise;
            }
        };
    }]);