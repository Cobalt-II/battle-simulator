export let font = {
    size: 20,
    type: "Arial"
    };

    export let bulletLife = 180;
    export let rangerdist = 500;
    export let rolldist = 60;
    export let flamespread = 120;
    
    export let reloads = {
    ranger: 60,
    summoner: 60,
    commando: 20,
    flamer: 5
    };
    
    export let healercircle = {
    hp: 0.75,
    radius: 40,
    rushto: 0.75
    };
    
    export let base = {
    base:  {
    size: 10,
    health: 100,
    damage: 1,
    speed: 1
    },
    infect:  {
    size: 10,
    health: 75,
    damage: 1,
    speed: 1.5
    },
    healer:  {
    size: 10,
    health: 100,
    damage: 0.5,
    speed: 1.75
    },
    garg:  {
    size: 30,
    health: 1000,
    damage: 1.5,
    speed: 0.25
    },
    summoner:  {
    size: 10,
    health: 100,
    damage: 1,
    speed: 1
    },
    ranger:  {
    size: 10,
    health: 100,
    damage: 1,
    speed: 0.75
    },
    commando:  {
    size: 10,
    health: 500,
    damage: 5,
    speed: 1.75
    },
    bullet:  {
    size: 5,
    health: 5,
    damage: 15,
    speed: 15
    },
    flamer:  {
    size: 10,
    health: 300,
    damage: 5,
    speed: 0.75
    },
    bulletflame:  {
    size: 5,
    health: 5,
    damage: 15,
    speed: 3
    },
    };
    
    export let bulletptrs = {
    ranger: 'bullet',
    commando: 'bullet',
    flamer: 'bulletflame'
    };

    export let abilitytimers = {
    commando: 120
    };
    
    export let ents = ['healer', 'base', 'infect', 'garg', 'summoner', 'ranger', 'commando', 'flamer'];
