iGAdv.controller('GachaController', function GachaController($scope, gacha, heroes, currencies) {
    $scope.getGacha = function(number) {
        return gacha.gachaList[number];
    }

    $scope.getSelectedGacha = function() {
        return gacha.selectedGacha;
    }

    $scope.getGachaMessage = function() {
        return gacha.gachaMessage;
    }

    $scope.rollHero = function(selectedGacha) {
        if(currencies.coins >= gacha.gachaList[selectedGacha].cost) {
            currencies.coins -= gacha.gachaList[selectedGacha].cost;
            rarityRoll = Math.floor(Math.random()*100);

            for(i = 0; i < gacha.gachaList[selectedGacha].rates.length; i++) {
                rarityRoll -= gacha.gachaList[selectedGacha].rates[i].chance;
                if (rarityRoll < 0) {
                    i++;
                    break;
                }
            }

            matchedHeroes = gacha.gachaList[selectedGacha].heroList.filter(function(allHeroes) {
                return allHeroes.rarity == i;
            });

            hero = Math.floor(Math.random()*matchedHeroes.length);
            newHero = {
                id: heroes.nHeroes,
                number: matchedHeroes[hero].number,
                name: matchedHeroes[hero].name,
                level: 1,
                experience: 0,
                experienceToLevel: 100,
                rarity: matchedHeroes[hero].rarity,
                combat: matchedHeroes[hero].combat,
                combatLevel: 1,
                combatExperience: 0,
                combatExperienceToLevel: 100,
                mining: matchedHeroes[hero].mining,
                miningLevel: 1,
                miningExperience: 0,
                miningExperienceToLevel: 100,
                build: matchedHeroes[hero].build,
                buildLevel: 1,
                buildExperience: 0,
                buildExperienceToLevel: 100,
                setTo: 0
            }
            heroes.nHeroes++;
            heroes.curHeroes.push(newHero);

            gacha.gachaMessage = "You rolled (" + newHero.rarity + "*) " + newHero.name + "!";
        }
    }
});