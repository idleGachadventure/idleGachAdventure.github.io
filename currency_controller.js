iGAdv.controller('CurrencyController', function CurrencyController($scope, currencies) {
    $scope.getCoins = function() {
        return currencies.coins;
    }

    $scope.getGold = function() {
        return currencies.gold;
    }
});