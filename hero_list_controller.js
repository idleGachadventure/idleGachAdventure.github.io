iGAdv.controller('HeroController', function HeroController($scope, gacha, heroes, currencies, mine) {
    $scope.getHeroList = function() {
        return heroes.curHeroes;
    }

    $scope.setGachaDetails = function(gachaId) {
        gacha.selectedGacha = gachaId;
    }

    $scope.getGachaList = function() {
        return gacha.gachaList;
    }

    $scope.selectHero = function(heroId) {
        heroes.selectedHero = heroId;
    }

    $scope.selectHeroMine = function(heroId) {
        mine.selectedHero = heroId;
    }
});