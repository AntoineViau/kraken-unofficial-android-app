angular.module("kraken").factory("tradeService", ['krakenService', function (krakenService) {

        var _type; // buy/sell
        var _orderType; // market/limit
        var _pair;
        var _volume;
        var _amount;
        var _price;
        var _totalCost;

        var _service = {
            setType: function (type) {
                _type = type;
            }
            ,
            getType: function () {
                return _type;
            }
            ,
            setOrderType: function (orderType) {
                _orderType = orderType;
            }
            ,
            getOrderType: function () {
                return _orderType;
            }
            ,
            setPair: function (pair) {
                _pair = pair;
            }
            ,
            getPair: function () {
                return _pair;
            }
            ,
            setVolume: function (volume) {
                _volume = volume;
            }
            ,
            getVolume: function () {
                return _volume;
            }
            ,
            setAmount: function (amount) {
                _amount = amount;
            }
            ,
            getAmount: function () {
                return _amount;
            }
            ,
            setPrice: function (price) {
                _price = price;
            }
            ,
            getPrice: function () {
                return _price;
            }
            ,
            setTotalCost: function (totalCost) {
                _totalCost = totalCost;
            }
            ,
            getTotalCost: function () {
                return _totalCost;
            }
            ,
            addOrder: function () {
                var pair = _service.getPair();
                var type = _service.getType() === 'Buy' ? 'buy' : 'sell';
                var orderType = _service.getOrderType() === 'Market' ? 'market' : 'limit';
                var price = _service.getPrice();
                var volume = _service.getVolume();
                return krakenService.getTradablePairById(pair.id)
                .then(function (pair) {
                    return krakenService.addOrder(pair, type, orderType, price, volume);
                });
            }
        };

        return _service;

    }]);