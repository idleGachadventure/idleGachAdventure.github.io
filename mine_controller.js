iGAdv.controller('MineController', function CurrencyController($scope, mine, currencies) {
    $scope.getSelectedHero = function() {
        return mine.selectedHero;
    }
});