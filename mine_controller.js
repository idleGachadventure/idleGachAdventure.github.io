iGAdv.controller('MineController', function CurrencyController($scope, mine, currencies, heroes) {
    $scope.getSelectedHero = function() {
        return mine.selectedHero;
    }

    $scope.getStonePerSecond = function() {
        return mine.stonePerSecond;
    }

    $scope.getWoodPerSecond = function() {
        return mine.woodPerSecond;
    }

    $scope.getSelectedHeroName = function() {
        if (mine.selectedHero != -1) {
            return heroes.curHeroes[mine.selectedHero].name;
        }
        return "Select a Hero";
    }

    $scope.getSelectedHeroMining = function() {
        if (mine.selectedHero != -1) {
            return heroes.curHeroes[mine.selectedHero].mining;
        }
    }
});