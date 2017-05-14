var iGAdv = angular.module('iGAdv', []);

iGAdv.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                $(element).tooltip('show');
            }, function(){
                $(element).tooltip('hide');
            });
        }
    };
});

iGAdv.service('gacha', function() {
    this.gachaList = [{
            id: 0,
            name: 'Default Gacha',
            cost: 10,
            description: 'This is the place to start! You can get characters ranging from 1* to 3* in the Default Gacha.',
            rates: [{
                    rarity: 1,
                    chance: 75
                }, {
                    rarity: 2,
                    chance: 20
                }, {
                    rarity: 3,
                    chance: 5
                }
            ],
            heroList: [{
                    number: 0,
                    name: 'Miner Joe',
                    rarity: 1,
                    combat: 1,
                    mining: 3,
                    build: 1
                }, {
                    number: 1,
                    name: 'Knight Ted',
                    rarity: 1,
                    combat: 3,
                    mining: 1,
                    build: 1
                }, {
                    number: 2,
                    name: 'Builder Bob',
                    rarity: 1,
                    combat: 1,
                    mining: 1,
                    build: 3
                }, {
                    number: 3,
                    name: 'Worker Tom',
                    rarity: 2,
                    combat: 1,
                    mining: 4,
                    build: 5
                }, {
                    number: 4,
                    name: 'Muscle Pat',
                    rarity: 2,
                    combat: 7,
                    mining: 2,
                    build: 1
                }, {
                    number: 5,
                    name: 'Jack',
                    rarity: 3,
                    combat: 5,
                    mining: 5,
                    build: 5
                }
            ]
        }
    ];

    this.selectedGacha = 0;

    this.gachaMessage = "You haven't rolled yet.";
});

iGAdv.service('heroes', function() {
    this.nHeroes = 0;
    this.curHeroes = [];

    this.selectedHero = -1;
});

iGAdv.service('currencies', function() {
    this.coins = 30;
    this.gold = 0;
});

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
                rarity: matchedHeroes[hero].rarity,
                combat: matchedHeroes[hero].combat,
                combatLevel: 1,
                combatExperience: 0,
                mining: matchedHeroes[hero].mining,
                miningLevel: 1,
                miningExperience: 0,
                build: matchedHeroes[hero].build,
                buildLevel: 1,
                buildExperience: 0,
                setTo: 0
            }
            heroes.nHeroes++;
            heroes.curHeroes.push(newHero);

            gacha.gachaMessage = "You rolled (" + newHero.rarity + "*) " + newHero.name + "!";
        }
    }
});

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

iGAdv.controller('HeroController', function HeroController($scope, gacha, heroes, currencies) {
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
});

iGAdv.controller('CurrencyController', function CurrencyController($scope, currencies) {
    $scope.getCoins = function() {
        return currencies.coins;
    }

    $scope.getGold = function() {
        return currencies.gold;
    }
});