angular.module('kraken')
.filter('tradablePairReadable', function () {
    return function (pair) {
        if (pair === undefined || pair === null || pair === '') {
            return 'unknown';
        }
        if (typeof (pair) === 'string') {
            if (pair.length === 8) {
                return pair.substring(1, 4) + ' / ' + pair.substring(5);
            }
            return pair.substring(0, 3) + ' / ' + pair.substring(3);
        }
        var base = pair.altname.substring(0, 3);
        var quote = pair.altname.substring(3);
        return base + ' / ' + quote;
    };
});

angular.module('kraken')
.filter('assetReadable', function () {
    return function (asset) {
        if (typeof (asset) === "string") {
            return asset.substring(1);
        }
    };
});

//angular.module('kraken')
//.filter('assetName', function () {
//    return function (asset) {
//        return asset.substring(1);
//    };
//});
