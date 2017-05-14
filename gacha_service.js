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