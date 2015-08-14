angular.module("kraken").factory("krakenRestService", ["$http", "$q", function ($http, $q) {

        var _apiKey = "";
        var _privateKey = "";
        var _url = 'https://api.kraken.com';

        var _headers = {
        };

        var _getMessageSignature = function (path, nonce, postData) {
            var postdata = nonce;
            for (var key in postData) {
                postdata += (postdata === nonce ? '' : '&') + key + '=' + postData[key];
            }
            postdata += (postdata === nonce ? '' : '&') + 'nonce=' + nonce;
            var hash_digest = CryptoJS.SHA256(postdata);
            var debase64PrivateKey = CryptoJS.enc.Base64.parse(_privateKey);
            var message = CryptoJS.enc.Hex.stringify(CryptoJS.enc.Latin1.parse(path)) + hash_digest.toString();
            var hmac_digest = CryptoJS.HmacSHA512(CryptoJS.enc.Hex.parse(message), debase64PrivateKey);
            var signature = CryptoJS.enc.Base64.stringify(hmac_digest);
            return signature;
        };

        var _service = {
            setApiKey: function (apiKey) {
                console.log('krakenService.setApiKey(' + apiKey + ')');
                _apiKey = apiKey;
            }
            ,
            setPrivateKey: function (privateKey) {
                console.log('krakenService.setPrivateKey(' + privateKey + ')');
                _privateKey = privateKey;
            }
            ,
            get: function (path, params, data) {
                return $http({
                    method: 'GET'
                    , url: _url + path
                    , params: params
                    , headers: _headers
                })
                .then(
                function (result) {
                    return result.data;
                },
                function (result) {
                    return $q.reject(result);
                }
                );

            },
            post: function (path, params, dataAsJson) {
                var nonce = new Date() * 1000;
                _headers['API-Key'] = _apiKey;
                _headers['API-Sign'] = _getMessageSignature(path, nonce, dataAsJson);
                _headers['Content-Type'] = "application/x-www-form-urlencoded";
                if (typeof (dataAsJson) === "undefined") {
                    dataAsJson = {};
                }
                dataAsJson.nonce = nonce;
                var dataString = '';
                for (var key in dataAsJson) {
                    dataString += (dataString === '' ? '' : '&') + key + "=" + dataAsJson[key];
                }
                return $http({
                    method: 'POST'
                    , url: _url + path
                    , params: params
                    , data: dataString
                    , headers: _headers
                })
                .then(
                function (result) {
                    if (result.data.error.length > 0) {
                        return $q.reject(result.data.error[0]);
                    }
                    return result.data;
                }
                ,
                function (result) {
                    return $q.reject(result);
                }
                );
            }
        };
        return _service;

    }]);