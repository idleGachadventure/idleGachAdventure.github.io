var iGAdv = angular.module('iGAdv', []);

iGAdv.controller('MainController', function MainController($scope, $interval, heroes, currencies, mine) {
    var timer = $interval(function () {
        currencies.coins++;
        mine.mineThings();
    }, 1000, 0);

    var saveGame = function() {
        localStorage.setItem('version', 1);

        localStorage.setItem('nHeroes', heroes.nHeroes);
        localStorage.setItem('curHeroes', heroes.curHeroes);

        localStorage.setItem('coins', currencies.coins);
        localStorage.setItem('tokens', currencies.tokens);
        localStorage.setItem('stone', currencies.stone);
        localStorage.setItem('wood', currencies.wood);

        localStorage.setItem('miningHeroes', mine.miningHeroes);
    }

    //var autoSave = $interval(saveGame, 15000, 0);

    var loadGame = function() {
        if (localStorage.getItem('version') == 1) {
            heroes.nHeroes = localStorage.getItem('nHeroes');
            heroes.curHeroes = localStorage.getItem('curHeroes');

            currencies.coins = localStorage.getItem('coins');
            currencies.tokens = localStorage.getItem('tokens');
            currencies.stone = localStorage.getItem('stone');
            currencies.wood = localStorage.getItem('wood');

            mine.miningHeroes = localStorage.getItem('miningHeroes');
        }
    }

    loadGame();
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
    this.selectedHero = -1;

    this.nHeroes = 0;
    this.curHeroes = [];
});

iGAdv.service('currencies', function() {
    this.coins = 30;
    this.tokens = 0;

    this.stone = 0;
    this.wood = 0;
});

iGAdv.service('mine', function(heroes, currencies) {
    this.selectedHero = -1;

    this.stonePerSecond = function() {
        var stonePerSec = 0;
        var difficulty = 5;
        var totalEfficiency = 0;

        for (var i = 0; i < heroes.curHeroes.length; i++) {
            if (heroes.curHeroes[i].subJob == 1) {
                totalEfficiency += heroes.curHeroes[i].mining;
            }
        }

        stonePerSec = totalEfficiency / difficulty;
        return stonePerSec;
    }

    this.woodPerSecond = function() {
        var woodPerSec = 0;
        var difficulty = 5;
        var totalEfficiency = 0;

        for (var i = 0; i < heroes.curHeroes.length; i++) {
            if (heroes.curHeroes[i].subJob == 2) {
                totalEfficiency += heroes.curHeroes[i].mining;
            }
        }

        woodPerSec = totalEfficiency / difficulty;
        return woodPerSec;
    };

    this.mineThings = function() {
        currencies.stone += this.stonePerSecond();
        currencies.wood += this.woodPerSecond();
    }
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
                subJob: 0,
                setTo: 0
            }
            heroes.nHeroes++;
            heroes.curHeroes.push(newHero);

            gacha.gachaMessage = "You rolled (" + newHero.rarity + "*) " + newHero.name + "!";
        }
    }
});

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

iGAdv.controller('HeroDetailsController', function HeroDetailsController($scope, heroes, mine) {
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

    $scope.setHeroTo = function(jobId) {
        heroes.curHeroes[heroes.selectedHero].setTo = jobId;
        heroes.curHeroes[heroes.selectedHero].subJob = 0;
    }
});

iGAdv.controller('CurrencyController', function CurrencyController($scope, currencies) {
    $scope.getCoins = function() {
        return Math.round(currencies.coins*100000)/100000;
    }

    $scope.getTokens = function() {
        return Math.round(currencies.tokens*100000)/100000;
    }

    $scope.getStone = function() {
        return Math.round(currencies.stone*100000)/100000;
    }

    $scope.getWood = function() {
        return Math.round(currencies.wood*100000)/100000;
    }
});

iGAdv.controller('MineController', function CurrencyController($scope, mine, currencies, heroes) {
    $scope.getSelectedHero = function() {
        return mine.selectedHero;
    }

    $scope.setSubJob = function(heroId, subJobId) {
        heroes.curHeroes[heroId].subJob = subJobId;
    }

    $scope.getCurrentSubJob = function() {
        var subJob = heroes.curHeroes[mine.selectedHero].subJob;
        if (subJob == 0) {
            return "Nothing";
        }
        else if (subJob == 1) {
            return "Stone";
        }
        else if (subJob == 2) {
            return "Wood";
        }
        else {
            return "Oops, something went wrong. If you're seeing this message, please report.";
        }
    }

    $scope.getStonePerSecond = function() {
        return mine.stonePerSecond();
    }

    $scope.getWoodPerSecond = function() {
        return mine.woodPerSecond();
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