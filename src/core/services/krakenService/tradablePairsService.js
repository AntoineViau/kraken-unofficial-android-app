angular.module("kraken").factory("tradablePairsService", ["krakenRestService", "$q", function (krakenRestService, $q) {

        var _tradablePairs = null;

        var _service = {
            getTradableAssetPairs: function (reload) {
                console.log('tradablePairsService.getTradablePairs(' + reload + ')');
                if (_tradablePairs !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_tradablePairs);
                }
                console.log(' -> from server');
                return krakenRestService.get('/0/public/AssetPairs')
                .then(function (data) {
                    _tradablePairs = data.result;
                    for (var pair in _tradablePairs) {
                        _tradablePairs[pair].id = pair;
                    }
                    return _tradablePairs;
                });
            }
            ,
            getTradablePairById: function (tradablePairId) {
                return _service.getTradableAssetPairs()
                .then(function (assetsPairs) {
                    return assetsPairs[tradablePairId];
                });
            }
        };

        return _service;

    }]);