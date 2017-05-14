var iGAdv = angular.module('iGAdv', []);

iGAdv.controller('MainController', function MainController($scope, $interval, heroes, currencies) {
    var timer = $interval(function () {
        currencies.coins++;
    }, 1000, 0);

    var saveGame = function() {
        localStorage.setItem('version', 1);
        localStorage.setItem('nHeroes', heroes.nHeroes);
        localStorage.setItem('curHeroes', heroes.curHeroes);
        localStorage.setItem('coins', currencies.coins);
        localStorage.setItem('gold', currencies.gold);
        localStorage.setItem('stone', currencies.stone);
        localStorage.setItem('wood', currencies.wood);
    }

    //var autoSave = $interval(saveGame, 15000, 0);

    var loadGame = function() {
        if (localStorage.getItem('version') == 1) {
            heroes.nHeroes = localStorage.getItem('nHeroes');
            heroes.curHeroes = localStorage.getItem('curHeroes');
            currencies.coins = localStorage.getItem('coins');
            currencies.gold = localStorage.getItem('gold');
            currencies.stone = localStorage.getItem('stone');
            currencies.wood = localStorage.getItem('wood');
        }
    }

    loadGame();
});

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