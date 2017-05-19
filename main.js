var iGAdv = angular.module('iGAdv', []);

iGAdv.controller('MainController', function MainController($scope, $interval, heroes, currencies, mine, town) {
    var timer = $interval(function () {
        mine.mineThings();
        town.buildStuff();
    }, 1000, 0);

    var saveGame = function() {
        localStorage.setItem('version', 1);

        localStorage.setItem('nHeroes', heroes.nHeroes);
        localStorage.setItem('curHeroes', heroes.curHeroes);

        localStorage.setItem('coins', currencies.coins);
        localStorage.setItem('tokens', currencies.tokens);
        localStorage.setItem('stone', currencies.stone);
        localStorage.setItem('wood', currencies.wood);
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

    this.findNumber = function(hero) {
        if (hero.number == this) {
            return true;
        }
        return false;
    }
});

iGAdv.service('heroes', function() {
    this.selectedHero = -1;

    this.nHeroes = 0;
    this.curHeroes = [];

    this.grantExperience = function(hero, value) {
        hero.experience += value;
        if (hero.experience >= hero.experienceToLevel) {
            hero.experience -= hero.experienceToLevel;
            hero.experienceToLevel *= 2;
            hero.level += 1;
            hero.mining = hero.baseMining * hero.level * hero.miningLevel;
            hero.combat = hero.baseCombat * hero.level * hero.combatLevel;
            hero.build = hero.baseBuild * hero.level * hero.buildLevel;
        }
    }

    this.grantMiningExperience = function(hero, value) {
        hero.miningExperience += value;
        if (hero.miningExperience >= hero.miningExperienceToLevel) {
            hero.miningExperience -= hero.miningExperienceToLevel;
            hero.miningExperienceToLevel *= 2;
            hero.miningLevel += 1;
            hero.mining = hero.baseMining * hero.level * hero.miningLevel;
        }
    }
});

iGAdv.service('currencies', function() {
    this.coins = 30;
    this.tokens = 0;
});

iGAdv.service('mine', function(heroes) {
    this.selectedHero = -1;
    this.mineralStock = [0, 0];
    this.minerals = [{
        id: 0,
        name: "Stone",
        difficulty: 5
    }, {
        id: 1,
        name: "Wood",
        difficulty: 5
    }];

    this.findId = function(mineral) {
        if (mineral.id == this) {
            return true;
        }
        return false;
    }

    this.mineralPerSecond = function(mineralId) {
        var mineralPerSec = 0;
        var difficulty = this.minerals.find(this.findId, mineralId).difficulty;
        var totalEfficiency = 0;

        for (var i = 0; i < heroes.curHeroes.length; i++) {
            if (heroes.curHeroes[i].setTo == 1 && heroes.curHeroes[i].subJob == mineralId) {
                totalEfficiency += heroes.curHeroes[i].mining;
            }
        }

        mineralPerSec = totalEfficiency / difficulty;
        return mineralPerSec;
    }

    this.giveMiningExperience = function() {
        for (var i = 0; i < heroes.curHeroes.length; i++) {
            if (heroes.curHeroes[i].setTo == 1) {
                if (heroes.curHeroes[i].subJob != -1) {
                    var difficulty = this.minerals.find(this.findId, heroes.curHeroes[i].subJob).difficulty;
                    if (heroes.curHeroes[i].miningLevel < difficulty) {
                        heroes.grantMiningExperience(heroes.curHeroes[i], 1);
                    }
                    else {
                        heroes.grantMiningExperience(heroes.curHeroes[i], this.minerals[heroes.curHeroes[i].subJob].difficulty / heroes.curHeroes[i].miningLevel);
                    }
                }
            }
        }
    }

    this.mineThings = function() {
        for (var i = 0; i < this.minerals.length; i++) {
            this.mineralStock[i] += this.mineralPerSecond(i);
            this.mineralStock[i] = Math.round(this.mineralStock[i] * 100)/100;
        }
        this.giveMiningExperience();
    }
});

iGAdv.service('town', function(heroes) {
    this.currentArea = 10;
    this.currentProgression = 0;
    this.currentlyBuilding = -1;
    this.currentlyUpgrading = -1;
    this.buildings = [{
        id: 0,
        name: "Town Center",
        level: 1,
        amount: 1,
        maxAmount: 1,
        toUpgrade: [{
            mineral: "Stone",
            value: 50    
        }, {
            mineral: "Wood",
            value: 50
        }],
        powerToUpgrade: 500,
        toBuild: [],
        powerToBuild: 0
    }, {
        id: 1,
        name: "House",
        level: 1,
        amount: 1,
        maxAmount: 100,
        toUpgrade: [{
            mineral: "Stone",
            value: 100
        }, {
            mineral: "Wood",
            value: 100
        }],
        powerToUpgrade: 1000,
        toBuild: [{
            mineral: "Stone",
            value: 10
        }, {
            mineral: "Wood",
            value: 10
        }],
        powerToBuild: 100
    }]

    this.buildPerSecond = function() {
        var buildPerSec = 0;

        for (var i = 0; i < heroes.curHeroes.length; i++) {
            if (heroes.curHeroes[i].setTo == 2) {
                buildPerSec += heroes.curHeroes[i].build;
            }
        }

        return buildPerSec;
    }

    this.buildStuff = function() {
        if (this.currentlyBuilding != -1 || this.currentlyUpgrading != -1) {
            this.currentProgression += this.buildPerSecond();
        }
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
            findHero = heroes.curHeroes.find(gacha.findNumber, matchedHeroes[hero].number)
            if (findHero == undefined) {
                newHero = {
                    id: heroes.nHeroes,
                    number: matchedHeroes[hero].number,
                    name: matchedHeroes[hero].name,
                    level: 1,
                    experience: 0,
                    experienceToLevel: 100,
                    rarity: matchedHeroes[hero].rarity,
                    baseCombat: matchedHeroes[hero].combat,
                    combat: matchedHeroes[hero].combat,
                    combatLevel: 1,
                    combatExperience: 0,
                    combatExperienceToLevel: 100,
                    baseMining: matchedHeroes[hero].mining,
                    mining: matchedHeroes[hero].mining,
                    miningLevel: 1,
                    miningExperience: 0,
                    miningExperienceToLevel: 100,
                    baseBuild: matchedHeroes[hero].build,
                    build: matchedHeroes[hero].build,
                    buildLevel: 1,
                    buildExperience: 0,
                    buildExperienceToLevel: 100,
                    subJob: -1,
                    setTo: 0
                }
                heroes.nHeroes++;
                heroes.curHeroes.push(newHero);
            }
            else {
                heroes.grantExperience(heroes.curHeroes[findHero.id], 100);
            }

            gacha.gachaMessage = "You rolled (" + matchedHeroes[hero].rarity + "*) " + matchedHeroes[hero].name + "!";
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
        heroes.curHeroes[heroes.selectedHero].subJob = -1;
    }
});

iGAdv.controller('CurrencyController', function CurrencyController($scope, currencies) {
    $scope.getCoins = function() {
        return Math.round(currencies.coins*100000)/100000;
    }

    $scope.getTokens = function() {
        return Math.round(currencies.tokens*100000)/100000;
    }
});

iGAdv.controller('ResourceController', function ResourceController($scope, mine) {
    $scope.getMineralList = function() {
        return mine.minerals;
    }

    $scope.getMineralStock = function() {
        return mine.mineralStock;
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
        if (subJob == -1) {
            return "Nothing";
        }
        else {
            return mine.minerals[subJob].name;
        }
    }

    $scope.getMineralPerSecond = function(mineralId) {
        return mine.mineralPerSecond(mineralId);
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

iGAdv.controller('TownController', function TownController($scope, town) {
    $scope.getBuildings = function() {
        return town.buildings;
    }

    $scope.getCurrentlyBuilding = function() {
        return town.currentlyBuilding;
    }

    $scope.setCurrentlyBuilding = function(buildId) {
        if (town.currentlyBuilding == -1 && town.currentlyUpgrading == -1) {
            town.currentlyBuilding = buildId;
        }
    }

    $scope.getCurrentlyUpgrading = function() {
        return town.currentlyUpgrading;
    }

    $scope.setCurrentlyUpgrading = function(buildId) {
        if (town.currentlyBuilding == -1 && town.currentlyUpgrading == -1) {
            town.currentlyUpgrading = buildId;
        }
    }

    $scope.getBuildPerSec = function() {
        return town.buildPerSecond();
    }

    $scope.getCurrentProgression = function() {
        return town.currentProgression;
    }
});