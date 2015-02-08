angular.module("kraken").factory("krakenService", ["krakenRestService", "tradablePairsService", "$q", function (krakenRestService, tradablePairsService, $q) {

        var _assets = null;
        var _balances = null;
        var _tradeHistory = null;
        var _tradeBalance = null;
        var _openOrders = null;
        var _closedOrders = null;

        var _service = {
            setApiKey: function (apiKey) {
                krakenRestService.setApiKey(apiKey);
            }
            ,
            setPrivateKey: function (privateKey) {
                krakenRestService.setPrivateKey(privateKey);
            }
            ,
            getServerTime: function () {
                console.log('krakenService.getServerTime()');
                return krakenRestService.get('/0/public/Time');
            }
            ,
            getAssets: function (reload) {
                console.log('krakenService.getAssets(' + reload + ')');
                if (_assets !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_assets);
                }
                console.log(' -> from server');
                return krakenRestService.get('/0/public/AssetPairs')
                .then(function (data) {
                    _assets = data.result;
                    return _assets;
                });
            }
            ,
            getTradableAssetPairs: function (reload) {
                console.log('krakenService.getTradableAssetPairs(' + reload + ')');
                return tradablePairsService.getTradableAssetPairs(reload);
            }
            ,
            getTradablePairById: function (tradablePairId) {
                console.log('krakenService.getTradablePairById(' + tradablePairId + ')');
                return tradablePairsService.getTradablePairById(tradablePairId);
            }
            ,
            getAccountBalances: function (reload) {
                console.log('krakenService.getAccountBalances(' + reload + ')');
                if (_balances !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_balances);
                }
                console.log(' -> from server');
                return krakenRestService.post('/0/private/Balance')
                .then(function (data) {
                    _balances = {};
                    for (var balance in data.result) {
                        var currency = balance.substring(1, 4);
                        _balances[currency] = data.result[balance];
                    }
                    return _balances;
                });
            }
            ,
            getTradeBalance: function (reload) {
                console.log('krakenService.getTradeBalance(' + reload + ')');
                if (_tradeBalance !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_tradeBalance);
                }
                console.log(' -> from server');
                return krakenRestService.post('/0/private/TradeBalance', null, {'asset': 'ZEUR'})
                .then(function (data) {
                    _tradeBalance = data.result;
                    return _tradeBalance;
                });
            }
            ,
            getLastTrade: function (pairId) {
                console.log('krakenService.getLastTrade(' + pairId + ')');
                return krakenRestService.get('/0/public/Ticker', {"pair": pairId})
                .then(function (data) {
                    for (var pair in data.result) {
                        return data.result[pairId].c[0];
                    }
                });
            }
            ,
            getTradeHistory: function (reload) {
                console.log('krakenService.getTradeHistory(' + reload + ')');
                if (_tradeHistory !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_tradeHistory);
                }
                console.log(' -> from server');
                return krakenRestService.post('/0/private/TradesHistory')
                .then(function (data) {
                    _tradeHistory = data.result;
                    return _tradeHistory;
                });
            }
            ,
            getOpenOrders: function (reload) {
                console.log('krakenService.getOpenOrders(' + reload + ')');
                if (_openOrders !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_openOrders);
                }
                console.log(' -> from server');
                return krakenRestService.post('/0/private/OpenOrders')
                .then(function (data) {
                    _openOrders = data.result.open;
                    return _openOrders;
                });
            }
            ,
            getClosedOrders: function (reload) {
                console.log('krakenService.getClosedOrders(' + reload + ')');
                if (_closedOrders !== null && reload !== true) {
                    console.log(' -> from cache');
                    return $q.when(_closedOrders);
                }
                console.log(' -> from server');
                return krakenRestService.post('/0/private/ClosedOrders')
                .then(function (data) {
                    _closedOrders = data.result.closed;
                    return _closedOrders;
                });
            }
            ,
            addOrder: function (assetPair, type, ordertype, price, volume, dryRun) {
                var validate = (dryRun === true) ? true : false;
                var orderInfos = {"pair": assetPair.id, "type": type, "ordertype": ordertype, "price": price, "volume": volume};
                if (validate === true) {
                    orderInfos.validate = true;
                }
                return krakenRestService.post(
                '/0/private/AddOrder'
                , null
                , orderInfos);
            }
        };

        return _service;

    }]);