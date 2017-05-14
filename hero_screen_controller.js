iGAdv.controller('HeroDetailsController', function HeroDetailsController($scope, heroes) {
    $scope.getSelectedHeroName = function() {
        if (heroes.selectedHero != -1) {
            return heroes.curHeroes[heroes.selectedHero].name;
        }
        return "Select a Hero";
    }

    $scope.getSelectedHeroLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].level;
    }

    $scope.getSelectedHeroExperience = function() {
        return heroes.curHeroes[heroes.selectedHero].experience;
    }

    $scope.getSelectedHeroExperienceToLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].experienceToLevel;
    }

    $scope.getSelectedHeroRarity = function() {
        temp = heroes.curHeroes[heroes.selectedHero].rarity;

        rarityString = "";
        while (temp > 0) {
            rarityString += "*";
            temp--;
        }

        return rarityString;
    }

    $scope.getSelectedHeroCombat = function() {
        return heroes.curHeroes[heroes.selectedHero].combat;
    }

    $scope.getSelectedHeroCombatLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].combatLevel;
    }

    $scope.getSelectedHeroCombatExperience = function() {
        return heroes.curHeroes[heroes.selectedHero].combatExperience;
    }

    $scope.getSelectedHeroCombatExperienceToLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].combatExperienceToLevel;
    }

    $scope.getSelectedHeroMining = function() {
        return heroes.curHeroes[heroes.selectedHero].mining;
    }

    $scope.getSelectedHeroMiningLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].miningLevel;
    }

    $scope.getSelectedHeroMiningExperience = function() {
        return heroes.curHeroes[heroes.selectedHero].miningExperience;
    }

    $scope.getSelectedHeroMiningExperienceToLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].miningExperienceToLevel;
    }

    $scope.getSelectedHeroBuild = function() {
        return heroes.curHeroes[heroes.selectedHero].build;
    }

    $scope.getSelectedHeroBuildLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].buildLevel;
    }

    $scope.getSelectedHeroBuildExperience = function() {
        return heroes.curHeroes[heroes.selectedHero].buildExperience;
    }

    $scope.getSelectedHeroBuildExperienceToLevel = function() {
        return heroes.curHeroes[heroes.selectedHero].buildExperienceToLevel;
    }

    $scope.noHeroSelected = function() {
        if (heroes.selectedHero == -1) {
            return true;
        }
        return false;
    }
});