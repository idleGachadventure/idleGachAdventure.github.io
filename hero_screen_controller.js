iGAdv.controller('HeroDetailsController', function HeroDetailsController($scope, heroes) {
    $scope.getSelectedHeroName = function() {
        if (heroes.selectedHero != -1) {
            return heroes.curHeroes[heroes.selectedHero].name;
        }
        return "Select a Hero";
    }

    $scope.noHeroSelected = function() {
        if (heroes.selectedHero == -1) {
            return true;
        }
        return false;
    }
});