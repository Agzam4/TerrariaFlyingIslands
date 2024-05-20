class FlyingWorld {


	static create(config) {
		let flyingWorld = new FlyingWorld(config);
		return flyingWorld.world;
	}

	constructor(config) {
		let scalex = 1;
		let scaley = 1;
		let width = config.width;//Mathf.floor(4200/scalex);
		let height = config.height;//Mathf.floor(1200/scaley);

		// Progress.amax(width/3 + height/1.5); 	// islands
		Progress.amax('islands', 		ProgressTimes.islands(width/300 + height/150)); 	
		Progress.amax('hives', 			ProgressTimes.hives); 	
		Progress.amax('honey', 			ProgressTimes.honey); 	
		Progress.amax('phyramid', 		ProgressTimes.phyramid); 	
		Progress.amax('jungleTmple', 	ProgressTimes.jungleTmple); 	
		Progress.amax('macrostructures',ProgressTimes.macrostructures(width, height)); 	
		Progress.amax('dirt',			ProgressTimes.dirt(width, height)); 	
		Progress.amax('dungeon', 		ProgressTimes.dungeon(width)); 	
		Progress.amax('grass', 			ProgressTimes.grass(width, height)); 	
		Progress.amax('ores', 			ProgressTimes.ores(width, height)); 	
		Progress.amax('waterfalls', 	ProgressTimes.waterfalls(width, height)); 	
		Progress.amax('fixing', 		ProgressTimes.fixing(width, height));

		console.log(Progress.steps);

		//
		this.megaIslands = [];
		this.miniIslands = [];
		this.islandsLefts = [];
		this.islandsRights = [];
		this.orbPoints = [];
		//

		let seed = 0;
    	for (let c of (config.seed+"")) {
    	    seed = 31*seed + c.charCodeAt(0);
    	}
    	console.log('Real seed:', seed);


		;//new Date() - 1;//-6928655865754102681;
		let random = new Random(seed); // seed

		this.random = random;
		this.simplexSeed = random.nextInt();
		this.simplexGapSeed = random.nextInt();
		let world = new World(width, height);
		world.gamemode = config.mode;
		this.world = world;
		this.width = world.width;
		this.height = world.height;
		
    	for (var i = 7; i < world.guid.length; i++) {
    		world.guid[i] = (((new Date()-1) << i)%255+255)%255;
    	}
    	world.worldId = random.nextInt();
    	world.creationTime = new Date() - 1;

		world.title = config.name;
		world.seed = "" + config.seed;
		world.groundLevel = this.height-(this.height/2.5)-100;//700;
		world.rockLevel = this.height-(this.height/2.5);
		world.spawn.x = this.width/2;	
		world.spawn.y = this.height*1/3;
		console.log("Generating flying world... (" + world.width + "x" + world.height + ")");
		Debug.time("Distribution");
		let biomes = new Array(6);
		
		if(random.nextBoolean()) { // right dungeon 
			let avalible = [];
			for (var i = 0; i < 3; i++) avalible.push(i);
			for (var i = 0; i < 3; i++) biomes[i] = avalible.splice(random.nextInt(0, avalible.length), 1)[0];
			for (var i = 3; i < 5; i++) avalible.push(i);
			for (var i = 3; i < 5; i++) biomes[i] = avalible.splice(random.nextInt(0, avalible.length), 1)[0];
			biomes[5] = 5;
		} else { // left dungeon
			biomes[0] = 5;
			let avalible = [3,4];
			for (var i = 1; i < 3; i++) biomes[i] = avalible.splice(random.nextInt(0, avalible.length), 1)[0];
			avalible = [0,1,2];
			for (var i = 3; i < 6; i++) biomes[i] = avalible.splice(random.nextInt(0, avalible.length), 1)[0];
		}

		let bimesSize = this.width/7;

		this.jungle = {}; 
		this.desert = {}; 
		this.snow = {}; 
		this.evil = {}; 
		this.dungeon = {}; 
		this.granite = {x:-999,y:-999}; 
		this.marble = {x:-999,y:-999}; 

		let points = [this.jungle, this.desert, null, this.snow, this.evil, this.dungeon];
		
		let ks = [1, 2, 3, 5, 6, 7];

		for (var i = 0; i < points.length; i++) {
			if(points[i] == null) continue;
			let center = this.width*ks[biomes.indexOf(i)]/8;
			points[i].x = center - bimesSize/2;
			points[i].y = center + bimesSize/2;
		}

		world.dungeon.x = (this.dungeon.x + this.dungeon.y)/2;	
		world.dungeon.y = world.groundLevel-50;//world.spawn.y;	
		
		world.isCrimson = this.random.nextBoolean();
		if(config.evil == 'corruption') world.isCrimson = false;
		if(config.evil == 'crimsone') world.isCrimson = true;
		
		let dy = 150;
		let dx = 300;

		world.spawn.x /= dx;
		world.spawn.x *= dx;
		
		world.spawn.y /= dy;
		world.spawn.y *= dy;

		this.createCluster(world.spawn.x, world.spawn.y, 300, 50, 360/15, 1, 1, 1);

		let hasSpawnY = false;
		for (var y = dy; y < this.height; y+=dy) {
			let hasSpawnX = false;
			for (var x = 0; x < this.width; x+=dx) {
				let spawnY = false;
				let spawnX = false;
				if(x >= this.world.spawn.x && !hasSpawnX) {
					spawnX = true;
					hasSpawnX = true;
				}
				if(y >= this.world.spawn.y && !hasSpawnY) {
					spawnY = true;
					hasSpawnY = true;
				}
				
				let sx = 100;
				let sy = 25;
				
				if(spawnY) {
					sy = 50;
					sx = 120;
					if(spawnX && spawnY) {
						sx = 50;
						sx = 200;
						continue;
					}
				}
				let ix = x;// + this.random.nextInt(dx/-2, dx/2); FIXME
				let iy = y;// + this.random.nextInt(dy/-2, dy/2); FIXME
				let smoothness = 1;
				
				let wk = 1;
				let hk = 1;

				if(this.isJungleBiome(ix)) {
					// iy = iy*3/4;
					smoothness = 1.5;
					hk = .5;
					wk = 3.5;
					sx += this.random.nextInt(50, 200);
				}
				if(this.isDesertBiome(ix, iy)) {
					// iy = iy*3/4;
					smoothness = 2;
					hk = 1.5;
					wk = 1;
					sy += this.random.nextInt(10, 25);
				}
				if(this.isSnowBiome(ix)) {
					sx += this.random.nextInt(25, 100);
					smoothness = 4;
					wk = 1.5;
					hk = .75;
				}
				if(this.isEvilBiome(ix)) {
					if(this.world.isCrimson) {
						sx += this.random.nextInt(50, 100);
						sy += this.random.nextInt(25, 50);
						smoothness = 1.25;
						wk = 1;
						hk = 1.5;
					} else {
						sy += this.random.nextInt(75, 100);
						smoothness = 2;
						wk = 1;
						hk = 2;
					}
				}
				if(this.isHellBiome(ix, iy)) {
					// iy = y + this.random.nextInt(dy/-2, dy/2);
					sx = 100 + this.random.nextInt(50, 100);
					sy = this.random.nextInt(25, 50);
					smoothness = 1.5;
					wk = 3.5;
					hk = .75;//.5;
				}
				this.createCluster(ix, iy, sx, sy, this.random.nextInt(6, 25), smoothness, wk, hk);
			}
		}

		var phyramid = this.takeMegaIsland(i => this.isDesertBiome(i.cx, i.cy));
		var shimmer = this.takeMegaIsland(i => this.isSnowBiome(i.cx, i.cy) && !this.isHellBiome(i.cx, i.cy) && i.cy > world.spawn.y);

		var granite = this.takeMegaIsland(i => !this.isDesertBiome(i.cx, i.cy) 
				&& !this.isDungeonBiome(i.cx, i.cy) 
				&& !this.isHellBiome(i.cx, i.cy) 
				&& !this.isEvilBiome(i.cx, i.cy)
				&& !this.isJungleBiome(i.cx, i.cy)
				&& !this.isSnowBiome(i.cx, i.cy)
				&& i.cy > world.spawn.y);

		var marble = this.takeMegaIsland(i => !this.isDesertBiome(i.cx, i.cy) 
				&& !this.isDungeonBiome(i.cx, i.cy) 
				&& !this.isHellBiome(i.cx, i.cy) 
				&& !this.isEvilBiome(i.cx, i.cy)
				&& !this.isJungleBiome(i.cx, i.cy)
				&& !this.isSnowBiome(i.cx, i.cy)
				&& i.cy > world.spawn.y);
		this.granite.smoothness = 5;
		this.marble.smoothness = 5;
		if(granite == null) {
			this.granite = {x:-999, y:-999};
		} else {
			this.granite = {x:granite.cx, y:granite.cy};
		}
		if(marble == null) {
			this.marble = {x:-999, y:-999};
		} else {
			this.marble = {x:marble.cx, y:marble.cy};
		}

		let hives = [];
		for (var h = 0; h < 5; h++) {
			var hive = this.takeMegaIsland(i => this.isJungleBiome(i.cx, i.cy) && !this.isHellBiome(i.cx, i.cy));
			if(hive == null) break;
			hives.push(hive);
		}
		// mini hives
		for (var h = 0; h < 3; h++) {
			var hive = this.takeMiniIsland(i => this.isJungleBiome(i.cx, i.cy) && !this.isHellBiome(i.cx, i.cy));
			if(hive == null) break;
			hives.push(hive);
		}

		for (var mushrooms = 0; mushrooms < 5; mushrooms++) {
			var mushroom = this.takeMegaIsland(i => !this.isDesertBiome(i.cx, i.cy) 
					&& !this.isDungeonBiome(i.cx, i.cy) 
					&& !this.isHellBiome(i.cx, i.cy) 
					&& !this.isEvilBiome(i.cx, i.cy)
					&& !this.isJungleBiome(i.cx, i.cy)
					&& !this.isSnowBiome(i.cx, i.cy)
					&& i.cy > this.world.spawn.y);
			if(mushroom == null) break;
			mushroom.createMushroom(this);
		}
		Debug.time("Base islands");
		
		for (let megaIsland of this.megaIslands) { 
			Progress.n(ProgressTimes.islands(1)); 	
			megaIsland.create(this);
		}
		for (let miniIsland of this.miniIslands) {
			miniIsland.create(this);
		}
		
		if(granite != null) granite.create(this);

		for (var l of this.islandsLefts) {
			for (var r of this.islandsRights) {
				this.bridge(l, r);
			}
		}

		Debug.time("Hives");
		for (var h of hives) {
			h.createHive(this);
		}
		Progress.n(ProgressTimes.hives);
		Debug.time("Honey");
		for (var h of hives) {
			h.addHoney(this);
		}
		Progress.n(ProgressTimes.honey);

		Debug.time("Phyramid");
		Progress.n(ProgressTimes.phyramid);
		if(phyramid != null) phyramid.createPhyramid(this);
		else console.warn('Phyramid not generated');
		if(shimmer != null) shimmer.createShimmer(this);
		else console.warn('Shimmer not generated');

		Debug.time("JungleTmple");
		JungleTmple.create(this, (this.jungle.x + this.jungle.y)/2, this.height/2);
		Progress.n(ProgressTimes.jungleTmple);

		this.createMiniStructures();
		// Progress.n(2500);
	
		Debug.time("Dirt");	
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if(!this.world.hasAirNear4(x, y)) continue;
				if(this.world.isBlock(Blocks.Stone, x, y)) {
					this.world.block(Blocks.StoneAccentSlab, x, y);
					continue;
				}
				if(this.world.isBlock(Blocks.DirtBlock, x, y)) {
					this.world.block(Blocks.Grass, x, y);
					continue;
				}
			}
			Progress.n(ProgressTimes.dirt(width, 1)); 
		}
		Debug.time("Dungeon");	
		Dungeon.create(this, world.dungeon.x, world.dungeon.y);
		Progress.n(ProgressTimes.dungeon(width)); 
		Debug.time("Grass");	
		this.createGrass(); 

		Debug.time("Ores");	
		this.createOres();
		Debug.time("Orbs");	
		this.createOrbs();

		for (var y = this.height-50; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				this.world.liquid(LiquidType.Lava, 255, x, y);
			}
		}
		Debug.time("Macro structures");	
		this.createMacroStructures();

		Debug.time("Waterfalls");
		this.createWaterfalls();
		
		Debug.time("Fixing");
		this.fixWorld();
		world.NPCs.push(new Npc(22, "Guide", "Welcome to Agzam's flying islands", false, {x:world.spawn.x,y:world.spawn.y}, {x:0,y:0}));
		Debug.time(null);
	}


	static macroChestStructures = [
			{under:Blocks.Grass, 				u:0,	v:0, rare:200,	loot:Loots.forestChestLoot},
			{under:Blocks.JungleGrassBlock, 	u:288,	v:0, rare:500, 	loot:Loots.jungleChestLoot},
			{under:Blocks.HardenedSandBlock, 	u:-360,	v:0, rare:50, 	loot:Loots.desertChestLoot},
			{under:Blocks.IceBlock, 			u:396,	v:0, rare:300, 	loot:Loots.snowChestLoot},
			{under:Blocks.SpiderNestBlock, 		u:540,	v:0, rare:400, 	loot:Loots.spiderChestLoot},
			{under:Blocks.MushroomGrassBlock, 	u:1152,	v:0, rare:400, 	loot:Loots.mushroomChestLoot}
	];

	static platformsFurnitureStructures = [
			{sprite:Blocks.Loom, 				u:0,	v:0,	rare:1000},
			{sprite:Blocks.Anvils, 				u:0,	v:0,	rare:1000},
			{sprite:Blocks.Hellforge, 			u:0,	v:234,	rare:200},
			{sprite:Blocks.Keg, 				u:0,	v:342,	rare:1000},
			{sprite:Blocks.CookingPots, 		u:0,	v:36,	rare:1000},
			{sprite:Blocks.SharpeningStation, 	u:0,	v:756,	rare:1000}
	];

	static macroStructures = [
			{sprite:Blocks.Altars, 				u:(r)=>0,						v:(r)=>0, 						under:Blocks.EbonstoneBlock, 		rare:2},
			{sprite:Blocks.Altars, 				u:(r)=>54,						v:(r)=>0, 						under:Blocks.CrimstoneBlock, 		rare:2},
			{sprite:Blocks.RollingCactus, 		u:(r)=>0,						v:(r)=>0, 						under:Blocks.SandstoneBlock, 		rare:25},
			{sprite:Blocks.AntlionLarva, 		u:(r)=>r.nextInt(4)*36,			v:(r)=>0, 						under:Blocks.SandstoneBlock, 		rare:25},
			{sprite:Blocks.CrystalHeart, 		u:(r)=>0,						v:(r)=>0, 						under:Blocks.Grass, 				rare:200},
			{sprite:Blocks.CrystalHeart, 		u:(r)=>0,						v:(r)=>0, 						under:Blocks.SandstoneBlock, 		rare:200},
			{sprite:Blocks.ManaCrystal, 		u:(r)=>0,						v:(r)=>0, 						under:Blocks.JungleGrassBlock, 		rare:200},
			{sprite:Blocks.ManaCrystal, 		u:(r)=>0,						v:(r)=>0, 						under:Blocks.IceBlock, 				rare:50},
			{sprite:Blocks.ManaCrystal, 		u:(r)=>0,						v:(r)=>0, 						under:Blocks.MushroomGrassBlock, 	rare:50},
			{sprite:Blocks.Sunflower, 			u:(r)=>r.nextInt(3)*36,			v:(r)=>0, 						under:Blocks.Grass, 				rare:50},
			{sprite:Blocks.FallenLog, 			u:(r)=>0,						v:(r)=>0, 						under:Blocks.Grass, 				rare:120},
			{sprite:Blocks.Geyser, 				u:(r)=>r.nextInt(2)*36,			v:(r)=>0, 						under:Blocks.AshGrassBlock, 		rare:50},
			{sprite:Blocks.Decos, 				u:(r)=>378 + r.nextInt(14)*54,	v:(r)=>0, 						under:Blocks.Grass, 				rare:50},
			{sprite:Blocks.Decos2, 				u:(r)=>756 + r.nextInt(3)*54,	v:(r)=>0, 						under:Blocks.Grass, 				rare:50},
			{sprite:Blocks.Decos2, 				u:(r)=>1566 + r.nextInt(6)*54,	v:(r)=>0, 						under:Blocks.SandstoneBlock, 		rare:50}, // desert
			{sprite:Blocks.Decos, 				u:(r)=>1404 + r.nextInt(6)*54,	v:(r)=>0, 						under:Blocks.SnowBlock, 			rare:50}, // snow
			{sprite:Blocks.Decos2, 				u:(r)=>0 + r.nextInt(6)*54,		v:(r)=>0, 						under:Blocks.JungleGrassBlock, 		rare:50}, // jungle
			{sprite:Blocks.Decos2, 				u:(r)=>918,						v:(r)=>0, 						under:Blocks.Stone, 				rare:10}, // sword
			{sprite:Blocks.Decos2, 				u:(r)=>324 + r.nextInt(3)*54,	v:(r)=>0, 						under:Blocks.AshGrassBlock, 		rare:50}, // hell
			{sprite:Blocks.Decos, 				u:(r)=>1728 + r.nextInt(3)*54,	v:(r)=>0, 						under:Blocks.MushroomGrassBlock, 	rare:50}, // mushrooms
			{sprite:Blocks.Decos2, 				u:(r)=>486 + r.nextInt(5)*54,	v:(r)=>0, 						under:Blocks.SpiderNestBlock, 		rare:50}, // spider
			{sprite:Blocks.LampPost, 			u:(r)=>r.nextBoolean()?0:18,	v:(r)=>0, 						under:Blocks.Grass, 				rare:100}, // lamps
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>144+r.nextInt(3)*36, 	under:Blocks.SnowBlock, 			rare:25}, // snow
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>252+r.nextInt(3)*36, 	under:Blocks.JungleGrassBlock, 		rare:25}, // jungle
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>576+r.nextInt(3)*36, 	under:Blocks.EbonstoneBlock, 		rare:25}, // evil
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>792+r.nextInt(3)*36, 	under:Blocks.CrimstoneBlock, 		rare:25}, // evil
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>684+r.nextInt(3)*36, 	under:Blocks.SpiderNestBlock, 		rare:25}, // spider
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>468+r.nextInt(3)*36, 	under:Blocks.AshGrassBlock, 		rare:25}, // spider
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>1224+r.nextInt(3)*36,	under:Blocks.SandBlock, 			rare:25}, // desert
			{sprite:Blocks.Pots, 				u:(r)=>r.nextInt(3)*36,			v:(r)=>r.nextInt(3)*36, 		under:Blocks.LivingWoodBlock, 		rare:25}, // wood
			// woods
			{sprite:Blocks.TopazTree,  				u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.AmethystTree,  			u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.SapphireTree,  			u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.EmeraldTree,  			u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.RubyTree,  				u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.DiamondTree,  			u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.AmberTree,  				u:(r)=>0,					v:(r)=>0, 						under:Blocks.KryptonMossBlock, 		rare:100},
			{sprite:Blocks.VanityTreeSakura,  		u:(r)=>0,					v:(r)=>0, 						under:Blocks.Grass, 				rare:100},
			{sprite:Blocks.VanityTreeYellowWillow,  u:(r)=>0,					v:(r)=>0, 						under:Blocks.Grass, 				rare:100},
			{sprite:Blocks.Trees,  					u:(r)=>0,					v:(r)=>0, 						under:Blocks.Grass, 				rare:5},
			{sprite:Blocks.Trees,  					u:(r)=>0,					v:(r)=>0, 						under:Blocks.CorruptGrassBlock, 	rare:5},
			{sprite:Blocks.Trees,  					u:(r)=>0,					v:(r)=>0, 						under:Blocks.CorruptGrassBlock, 	rare:5},
			{sprite:Blocks.Trees,  					u:(r)=>0,					v:(r)=>0, 						under:Blocks.JungleGrassBlock, 		rare:5},
			{sprite:Blocks.Trees,  					u:(r)=>0,					v:(r)=>0, 						under:Blocks.SnowBlock, 			rare:5},
			{sprite:Blocks.Trees,  					u:(r)=>0,					v:(r)=>0, 						under:Blocks.MushroomGrassBlock, 	rare:5},
			{sprite:Blocks.AshTree,					u:(r)=>0,					v:(r)=>0, 						under:Blocks.AshGrassBlock, 		rare:15}, 
			{sprite:Blocks.CactusPlant,  			u:(r)=>0,					v:(r)=>0, 						under:Blocks.SandBlock, 			rare:15}, 
			{sprite:Blocks.JungleShortPlants, 		u:(r)=>r.nextInt(22)*18,	v:(r)=>0, 						under:Blocks.JungleGrassBlock, 		rare:5}, 
			{sprite:Blocks.JungleTallPlants, 		u:(r)=>r.nextInt(16)*18,	v:(r)=>0, 						under:Blocks.JungleGrassBlock, 		rare:5}, 
			{sprite:Blocks.ForestShortPlants, 		u:(r)=>r.nextInt(44)*18,	v:(r)=>0, 						under:Blocks.Grass, 				rare:5}, 
			{sprite:Blocks.ForestTallPlants, 		u:(r)=>r.nextInt(44)*18,	v:(r)=>0, 						under:Blocks.Grass, 				rare:5}, 
	];

	createMacroStructures() {
		let blocks = [
				Blocks.Grass,
				Blocks.JungleGrassBlock,
				Blocks.MushroomGrassBlock,
				Blocks.IceBlock,
				Blocks.HardenedSandBlock,
				Blocks.SpiderNestBlock,
				Blocks.Platforms,
				Blocks.AshGrassBlock,
				
				Blocks.EbonstoneBlock,
				Blocks.CrimstoneBlock,
				Blocks.SandstoneBlock,

				Blocks.SnowBlock,
				Blocks.Stone,
				Blocks.SandBlock,
				Blocks.LivingWoodBlock,
				Blocks.CorruptGrassBlock,
				Blocks.CrimsonGrassBlock,
				Blocks.KryptonMossBlock,
		];
		
		let avalible = new Array(blocks.length);
		for (var i = 0; i < avalible.length; i++) {
			avalible[i] = [];
		}
		
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if(!this.world.isAir(x, y)) continue;
				for (var i = 0; i < blocks.length; i++) {
					if(this.world.block(x, y+1) == blocks[i].id) avalible[i].push({x:x,y:y});
				}
			}
		}

		// chests
		for (var mcs of FlyingWorld.macroChestStructures) {
			let av = Struct.filteredCopy(avalible[blocks.indexOf(mcs.under)], 
					p => this.world.hasArea(p.x, p.y-1, 2, 2) && this.world.isBlock(mcs.under, p.x+1, p.y+1));
			let count = Mathf.ceil(avalible[blocks.indexOf(mcs.under)].length/mcs.rare);
			for (var i = 0; i < count; i++) {
				if(av.length == 0) {
					console.warn('Some structures not generated');
					break;
				}
				let p = av.splice(this.random.nextInt(av.length), 1)[0];
				if(!this.world.hasArea(p.x, p.y-1, 2, 2)) {
					i = Math.max(0, i-1);
					continue;
				}
				this.world.sprite(mcs.u >= 0 ? Blocks.Chests : Blocks.Chests2, p.x, p.y-1, Math.abs(mcs.u), mcs.v);
				let chest = new Chest("", p.x, p.y-1);
				mcs.loot.set(chest, this.random);
				this.world.chests.push(chest);
			}
		}

		for (var pfs of FlyingWorld.platformsFurnitureStructures) {
			let av = Struct.filteredCopy(avalible[blocks.indexOf(Blocks.Platforms)], 
					p => this.world.hasArea(p.x, p.y-pfs.sprite.h+1, pfs.sprite.w, pfs.sprite.h) 
					&& this.world.isBlock(Blocks.Platforms, p.x+pfs.sprite.w-1, p.y+1)
					&& this.world.isFrame(p.x, p.y+1, pfs.u, pfs.v));
			let count = Mathf.ceil(avalible[blocks.indexOf(Blocks.Platforms)].length/pfs.rare); // 
			for (var i = 0; i < count; i++) {
				if(av.length == 0) {
					console.warn('Some structures not generated');
					break;
				}
				let p = av.splice(this.random.nextInt(av.length), 1)[0];
				if(!this.world.hasArea(p.x, p.y-pfs.sprite.h+1, pfs.sprite.w, pfs.sprite.h)) {
					i = Math.max(0, i-1);
					continue;
				}
				this.world.sprite(pfs.sprite, p.x, p.y-pfs.sprite.h+1, 0,0);
			}
		}

		for (var mc of FlyingWorld.macroStructures) {
			let av = Struct.filteredCopy(avalible[blocks.indexOf(mc.under)], 
					p => {
						if(!this.world.hasArea(p.x, p.y-mc.sprite.h+1, mc.sprite.w, mc.sprite.h)) return false;
						for (var dx = 0; dx < mc.sprite.w; dx++) {
							if(!this.world.isBlock(mc.under, p.x+dx, p.y+1)) return false;
						}
						return true;
					});
			let count = Mathf.ceil(avalible[blocks.indexOf(mc.under)].length/mc.rare);

			let treecheck = mc.sprite == Blocks.AshTree || mc.sprite == Blocks.VanityTreeSakura || mc.sprite == Blocks.VanityTreeYellowWillow
						|| mc.sprite == Blocks.CactusPlant || mc.sprite == Blocks.Trees;

			let stonetreecheck = mc.sprite == Blocks.TopazTree 
						|| mc.sprite == Blocks.AmethystTree || mc.sprite == Blocks.SapphireTree
						|| mc.sprite == Blocks.EmeraldTree || mc.sprite == Blocks.RubyTree 
						|| mc.sprite == Blocks.DiamondTree || mc.sprite == Blocks.AmberTree;

			for (var i = 0; i < count; i++) {
				if(av.length == 0) {
					break;
				}
				let p = av.splice(this.random.nextInt(av.length), 1)[0];
				if(!this.world.hasArea(p.x, p.y-mc.sprite.h+1, mc.sprite.w, mc.sprite.h)) {
					i = Math.max(0, i-1);
					continue;
				}
				
				let wrong = !this.world.hasArea(p.x, p.y-mc.sprite.h+1, mc.sprite.w, mc.sprite.h) ;
				
				if(treecheck) wrong = wrong
						|| this.world.isBlock(Blocks.Trees, p.x-1, p.y) 
						|| this.world.isBlock(Blocks.Trees, p.x+1, p.y)
						|| this.world.isBlock(Blocks.Trees, p.x-2, p.y)
						|| this.world.isBlock(Blocks.Trees, p.x+2, p.y);

				if(stonetreecheck) { 
					let stoneTrees = [
						Blocks.TopazTree, Blocks.AmethystTree, Blocks.SapphireTree, Blocks.EmeraldTree, 
						Blocks.RubyTree, Blocks.DiamondTree, Blocks.AmberTree];
					for (let st of stoneTrees) {
						wrong = wrong 	|| this.world.isBlock(st, p.x-1, p.y) 
										|| this.world.isBlock(st, p.x+1, p.y) 
										|| this.world.isBlock(st, p.x-2, p.y)
										|| this.world.isBlock(st, p.x+2, p.y);
					}
				}

				if(treecheck || stonetreecheck) for (var dy = 1; dy < 10; dy++) {
					for (var dx = -2; dx <= 2; dx++) {
						if(this.world.isAir(p.x+dx, p.y-dy)) continue;
						if(this.world.isBlock(mc.under, p.x+dx, p.y-dy)) continue;
						wrong = true;
						break;
					}
					if(wrong) break;
				}
				
				if(wrong) {
					i = Math.max(0, i-1);
					continue;
				}
				
				if(stonetreecheck) {
					Tree.stoneAt(this.world, this.random, p.x, p.y, mc.sprite, this.random.nextInt(3));
				} else if(mc.sprite == Blocks.CactusPlant) {
					Tree.cactusAt(this.world, this.random, p.x, p.y);
				} else if(mc.sprite == Blocks.AshTree || mc.sprite == Blocks.VanityTreeSakura || mc.sprite == Blocks.VanityTreeYellowWillow) {
					Tree.vanityAt(this.world, this.random, p.x, p.y, mc.sprite, this.random.nextInt(3));
				} else if(mc.sprite == Blocks.Trees) {
					Tree.at(this.world, this.random, p.x, p.y, this.random.nextInt(3));//mc.u.get(), mc.v.get());
				} else {
					this.world.sprite(mc.sprite, p.x, p.y-mc.sprite.h+1, mc.u(this.random),mc.v(this.random));
				}
			}
		}
		
	}

	fixWorld() {
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if(this.world.isAir(x, y+1)) {
					if(this.world.isBlock(Blocks.SandBlock, x, y)) {
						this.world.block(Blocks.SandstoneBlock, x, y);
					}
					if(this.world.isBlock(Blocks.SlushBlock, x, y)) {
						this.world.block(Blocks.SnowBlock, x, y);
					}
				}
			}
			Progress.n(ProgressTimes.fixing(this.width, 1)); 	
		}
	}

	static towersMasks = [
		undefined,
		// Forest is 1
		(world,x,y) => world.isBlock(Blocks.HerbsBloom, x, y) 
		|| world.isBlock(Blocks.ForestShortPlants, x, y) 
		|| world.isBlock(Blocks.ForestTallPlants, x, y) 
		|| world.isBlock(Blocks.DirtBlock, x, y) 
		|| world.isBlock(Blocks.Grass, x, y) 
		|| world.isBlock(Blocks.Stone, x, y) 
		|| world.isBlock(Blocks.MudstoneBrick, x, y),
		// Snow is 2
		(world,x,y) => world.isBlock(Blocks.HerbsBloom, x, y) 
		|| world.isBlock(Blocks.SnowBlock, x, y) 
		|| world.isBlock(Blocks.IceBlock, x, y) 
		|| world.isBlock(Blocks.SlushBlock, x, y),
		// Desert is 3
		(world,x,y) => world.isBlock(Blocks.HerbsBloom, x, y) 
		|| world.isBlock(Blocks.SandBlock, x, y) 
		|| world.isBlock(Blocks.SandstoneBlock, x, y)
		|| world.isBlock(Blocks.HardenedSandBlock, x, y),
		// Jungle is 4
		(world,x,y) => world.isBlock(Blocks.HerbsBloom, x, y) 
		|| world.isBlock(Blocks.MudBlock, x, y) 
		|| world.isBlock(Blocks.MudstoneBrick, x, y),
		undefined, // Evil is 5
		// Hell is 5
		(world,x,y) => world.isBlock(Blocks.HerbsBloom, x, y) 
		|| world.isBlock(Blocks.AshBlock, x, y) 
		|| world.isBlock(Blocks.AshGrassBlock, x, y) 
		|| world.isBlock(Blocks.HellstoneOre, x, y)
	];

	static towersBlocks = [
		undefined,
		[Blocks.StoneSlab, Blocks.GrayBrick, Blocks.Wood],							// Forest is 1
		[Blocks.IceBlock, Blocks.BorealWood, Blocks.BorealWood],					// Snow   is 2
		[Blocks.SandstoneSlab, Blocks.SandstoneBrick, Blocks.SmoothSandstoneBlock],	// Desert is 3
		[Blocks.RichMahogany, Blocks.BambooBlock, Blocks.LargeBambooBlock],			// Jungle is 4
		undefined, 																	// Evil   is 5
		[Blocks.ObsidianBrick, Blocks.HellstoneBrick, Blocks.ObsidianBlock],		// Hell   is 6
	];

	static towersFrames = [
		undefined,
		[0,0, 36,0],	 // Forest is 1
		[0,342, 396,0],	 // Snow   is 2
		[0,756, -360,0], // Desert is 3
		[0,36, 360,0],	 // Jungle is 4
		undefined, 		 // Evil   is 5
		[0,234, 144,0],	 // Hell   is 6
	];

	static towersWall = [
		undefined,
		Walls.StoneSlabWall,			// Forest is 1
		Walls.BorealWoodWall,			// Snow   is 2
		Walls.SandstoneBrickWall,		// Desert is 3
		Walls.BambooFence,				// Jungle is 4
		undefined, 						// Evil   is 5
		Walls.ObsidianBrickWallNatural	// Hell   is 6
	];

	static structureChestsLoot = [
		undefined,
		Loots.forestTowerLoot,	// Forest is 1
		Loots.snowTowerLoot,	// Snow   is 2
		Loots.desertTowerLoot,	// Desert is 3
		Loots.jungleTowerLoot,	// Jungle is 4
		undefined, 				// Evil   is 5
		Loots.hellTowerLoot		// Hell   is 6
	];

	createMiniStructures() {
		Debug.time("Towers");
		for (var i of this.miniIslands) {
			if(i.w < 10) continue;
			let biome = this.getBiome(i.cx, i.cy);
			
			if(this.random.nextFloat() > .33 && biome != Biomes.Hell && biome != Biomes.Jungle) continue;
			
			
			if(FlyingWorld.towersMasks[biome] == undefined) continue;
			let mask = FlyingWorld.towersMasks[biome];

			let floor = i.cy+5;
			if(biome == Biomes.Jungle) floor = i.cy+1;
			let maxw = 0;
			for (maxw = 0; maxw < 20; maxw++) {
				if(mask(this.world, i.cx + maxw, floor) && mask(this.world, i.cx - maxw, floor)) continue;
				break;
			}
			if(maxw <= 7) continue;
			let roomw = maxw;
			let left = i.cx-Mathf.floor(roomw/2);
			let right = i.cx+Mathf.floor(roomw/2);
			let canPlace = true;
			// searching air
			let ground = 0;
			for (ground = 0; ground < 15; ground++) {
				let found = false;
				for (var x = left; x < right; x++) {
					let y = floor-ground;
					if(this.world.isAir(x, y)) {
						found = true;
						break;
					}
					if(mask(this.world, x, y)) continue;
					canPlace = false;
					break;
				}
				if(found || !canPlace) break;
			}
			floor -= ground-1;
			if(!canPlace) continue;
			
			let roomh = this.random.nextInt(15, 25);

			// checking placing room at surface
			for (var x = left; x < right; x++) {
				let needCheck = false;
				for (var dy = 0; dy < roomh; dy++) {
					let y = floor-dy;
					if(needCheck) {
						if(this.world.isAir(x, y)) continue;
						canPlace = false;
						break;
					}
					if(mask(this.world, x, y)) continue;
					if(this.world.isAir(x, y)) {
						needCheck = true;
						continue;
					}
					canPlace = false;
					break;
				}
				if(!canPlace) break;
			}
			if(!canPlace) continue;
			roomh--;

			if(FlyingWorld.towersBlocks[biome] == undefined) continue;
			if(FlyingWorld.towersFrames[biome] == undefined) continue;
			if(FlyingWorld.towersWall[biome] == undefined) continue;

			let wall = FlyingWorld.towersWall[biome];
			let blocks = FlyingWorld.towersBlocks[biome];
			let frames = FlyingWorld.towersFrames[biome];

			for (var x = left+1; x < right-1; x++) {
				let border = x == left+1 || x == left+2 || x == right-2 || x == right-3;
				for (var dy = 0; dy < roomh-3; dy++) {
					let y = floor-dy;
					if(!this.world.isAir(x, y)) continue;
					if(border) {
						this.world.block(blocks[this.random.nextInt(blocks.length)], x, y);
					} else if(dy != roomh-4){
						if((roomh-dy+1)%5 == 0) {
							this.world.sprite(Blocks.Platforms, x, y, frames[0], frames[1]);
						}
						if(this.random.nextFloat() > .25) this.world.wall(wall, x, y);
					}
				}
			}
			
			for (var x = left; x < right; x++) {
				let border = x == left || x == left+1 || x == right-1 || x == right-2;
				for (var dy = roomh-4; dy < roomh; dy++) {
					let y = floor-dy;
					if(!this.world.isAir(x, y)) continue;
					if(border) {
						this.world.block(blocks[this.random.nextInt(blocks.length)], x, y);
					} else {
						if(dy == roomh-4) {
							this.world.sprite(Blocks.Platforms, x, y, frames[0], frames[1]);
						}
					}
				}
			}

			let chestX = i.cx-1;
			let chestY = floor-roomh+2;
			this.world.sprite(frames[2] < 0 ? Blocks.Chests2 : Blocks.Chests, chestX, chestY, Math.abs(frames[2]),frames[3]);
			let chest = new Chest("", chestX, chestY);
			if(FlyingWorld.structureChestsLoot[biome] != undefined) FlyingWorld.structureChestsLoot[biome].set(chest, this.random);
			this.world.chests.push(chest);
		}

		// spider nests

		let nests = [];
		for (var i of this.miniIslands) {
			// if(this.random.nextFloat() > .25) continue;
			let biome = this.getBiome(i.cx, i.cy);
			if(biome != Biomes.None && biome != Biomes.Evil) continue;
			if(FlyingWorld.towersMasks[biome] != undefined) continue;

			let radius = this.random.nextInt(15, 30);
			let dst = this.random.nextInt(3, 15);
			let cy = i.cy+i.h + dst +radius;
			
			let canPlace = true;
			
			for (var dy = -radius; dy <= radius; dy++) {
				for (var dx = -radius; dx <= radius; dx++) {
					let x = i.cx + dx;
					let y = cy + dy;
					if(this.world.isAir(x, y)) continue;
					canPlace = false;
					break;
				}
				if(!canPlace) break;
			}
			if(!canPlace) continue;

			let rx = radius-this.random.nextInt(7, 10);
			let ry = radius-this.random.nextInt(5, 7);
			let k1 = this.random.nextFloat(1.5, 2);
			let k2 = this.random.nextFloat(2.1, 3);
			
			for (var dy = -ry; dy <= ry; dy++) {
				for (var dx = -rx; dx <= rx; dx++) {
					let x = i.cx + dx;
					let y = cy + dy;
					let angle = Mathf.angle(dx, dy);
					let extra = Mathf.floor(1*Mathf.sin(angle*k1)*Mathf.sin(angle*k2) + 1);
					let iextra = Mathf.floor(1*Mathf.cos(angle*k1)*Mathf.cos(angle*k2) + 2);
					
					if((dx-extra)*(dx-extra) *ry*ry + (dy-extra)*(dy-extra) *rx*rx > rx*rx*ry*ry) continue;
					if(dx*dx *ry*ry + dy*dy *rx*rx < (rx-iextra)*(rx-iextra)*(ry-iextra)*(ry-iextra)) {
						if(Simplex.noise2d(this.simplexGapSeed, 5, .5, 1/15, x, y) < .4) {
							this.world.block(Blocks.Cobweb, x, y);
						}
						this.world.wall(Walls.InfestedSpiderWall, x, y);
						continue;
					}
					this.world.block(Blocks.SpiderNestBlock, x, y);
				}
			}
			let len = i.h + dst + radius;//dst+i.h/2+radius;
			for (var rope = 0; rope < len; rope++) {
				let r = Mathf.ceil(3*Mathf.sin(Mathf.pi*rope/len*rope/len)*Mathf.sin(Mathf.pi*rope/len));
				for (var dy = -r; dy <= r; dy++) {
					for (var dx = -r; dx <= r; dx++) {
						if(dx*dx + dy*dy > r*r) continue;
						let x = i.cx + dx;
						let y = i.cy+i.h/2 + rope + dy;
						if(this.world.isWall(Walls.InfestedSpiderWall, x, y)) continue;
						this.world.block(Blocks.SpiderNestBlock, x, y);
					}
				}
			}
		}
	}

	createWaterfalls() {
		let isWaterfallBlock = (x,y) => this.world.isBlock(Blocks.DirtBlock, x, y) 
				|| this.world.isBlock(Blocks.Grass, x, y)
				|| this.world.isBlock(Blocks.DirtBlock, x, y)
				|| this.world.isBlock(Blocks.LivingWoodBlock, x, y)
				|| this.world.isBlock(Blocks.JungleGrassBlock, x, y)
				|| this.world.isBlock(Blocks.SnowBlock, x, y)
				|| this.world.isBlock(Blocks.IceBlock, x, y)
				|| this.world.isBlock(this.evilStone(), x, y)
				|| this.world.isBlock(Blocks.HardenedSandBlock, x, y)
				|| this.world.isBlock(Blocks.MudBlock, x, y)
				|| this.world.isBlock(Blocks.MudstoneBrick, x, y)
				|| this.world.isBlock(Blocks.AshGrassBlock, x, y);

		let isBlock = (x,y) => this.world.isBlock(Blocks.DirtBlock, x, y) 
				|| this.world.isBlock(Blocks.Grass, x, y)
				|| this.world.isBlock(Blocks.SnowBlock, x, y)
				|| this.world.isBlock(Blocks.IceBlock, x, y)
				|| this.world.isBlock(Blocks.StoneAccentSlab, x, y)
				|| this.world.isBlock(Blocks.SandstoneBlock, x, y)
				|| this.world.isBlock(Blocks.JungleGrassBlock, x, y)
				|| this.world.isBlock(this.evilStone(), x, y)
				|| this.world.isBlock(Blocks.HardenedSandBlock, x, y)
				|| this.world.isBlock(Blocks.MudBlock, x, y)
				|| this.world.isBlock(Blocks.MudstoneBrick, x, y)
				|| this.world.isBlock(Blocks.Stone, x, y)
				|| this.world.isBlock(Blocks.AshGrassBlock, x, y);
		
		// left waterfalls
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if(this.world.isAir(x, y)) continue;
				if(this.world.isAir(x, y-1)) continue;
				if(this.world.isAir(x, y+1)) continue;
				if(!this.world.isAir(x, y-2) && !isBlock(x, y-2)) continue;

				if(!isWaterfallBlock(x, y)) continue;

				if(this.world.shape(x, y-1) != BlockShape.Full) continue;
				if(this.world.shape(x, y+1) != BlockShape.Full) continue;
				if(this.random.nextBoolean()) continue;
				
				if(this.world.isAir(x-1, y) && isBlock(x+1, y) && 
					isBlock(x+2, y) && isBlock(x+2, y+1) && isBlock(x+2, y-1)) {
					if(!this.world.isLiquid(LiquidType.Water, x-1, y)) {
						this.world.block(Blocks.Air, x+1, y);
						this.world.liquid(LiquidType.Water, 255, x+1, y);
						this.world.shape(BlockShape.HalfBrick, x, y);
					// } else if(this.random.nextBoolean()) {
					// 	this.world.block(Blocks.Air, x+1, y);
					// 	this.world.block(Blocks.Air, x, y);
					// 	this.world.liquid(LiquidType.Water, 255, x+1, y);
					// 	this.world.liquid(LiquidType.Water, 255, x, y);
					}
				}
			}
			Progress.n(ProgressTimes.waterfalls(this.width, 1)); 	
		}

		// right waterfalls
		for (var y = 0; y < this.height; y++) {
			for (var x = this.width-1; x >= 0; x--) {
				if(this.world.isAir(x, y)) continue;
				if(this.world.isAir(x, y-1)) continue;
				if(this.world.isAir(x, y+1)) continue;
				if(!this.world.isAir(x, y-2) && !isBlock(x, y-2)) continue;

				if(!isWaterfallBlock(x, y)) continue;

				if(this.world.shape(x, y-1) != BlockShape.Full) continue;
				if(this.world.shape(x, y+1) != BlockShape.Full) continue;
				if(this.random.nextBoolean()) continue;
				
				if(this.world.isAir(x+1, y) && isBlock(x-1, y) && 
					isBlock(x-2, y) && isBlock(x-2, y+1) && isBlock(x-2, y-1)) {
					if(!this.world.isLiquid(LiquidType.Water, x+1, y)) {
						this.world.block(Blocks.Air, x-1, y);
						this.world.liquid(LiquidType.Water, 255, x-1, y);
						this.world.shape(BlockShape.HalfBrick, x, y);
					// } else if(this.random.nextBoolean()) {
					// 	this.world.block(Blocks.Air, x-1, y);
					// 	this.world.block(Blocks.Air, x, y);
					// 	this.world.liquid(LiquidType.Water, 255, x-1, y);
					// 	this.world.liquid(LiquidType.Water, 255, x, y);
					}
				}
			}
			Progress.n(ProgressTimes.waterfalls(this.width, 1)); 	
		}
	}


	bridge(left, right) {
		let xs = right.x-left.x;
		if(xs > 200) return;
		if(xs < 1) return;
		if(isNaN(xs)) {
			// console.warn(`bridge size is ${xs}`, right, left);
			return;
		}
		let ys = new Array(Mathf.floor(xs));
		
		let ry = left.y;
		for (var x = 0; x < xs; x++) {
			let tx = left.x + x;
			let ty = Mathf.ilerp(left.y, right.y, x/xs);

			let hh = Math.abs(1 - x*2/xs);
			
			hh *= hh;
			hh = 1 - hh;
			
			ty += xs*hh/10;
			if(x%2 == 1) {
				if(ry < ty) ry++;
				if(ry > ty) ry--;
			}
			
			ys[Mathf.floor(x)] = ry;

			if(x > 1 && x < xs-1) {
				if(!this.world.isAir(tx, ry)) return;
				if(!this.world.isAir(tx, ry-1)) return;
				if(!this.world.isAir(tx, ry-2)) return;
			}
		}
		
		if(ry != right.y) return;

		for (var x = 0; x < xs; x++) {
			let tx = left.x + x;
			if(x%2 == 0) {
				this.world.block(Blocks.Wood, tx, ys[x]);
				this.world.sprite(Blocks.Rope, tx, ys[x]-1, 90, 0);
			} else {
				this.world.sprite(Blocks.Platforms, tx, ys[x], 90, 0);
			}
			this.world.sprite(Blocks.Rope, tx, ys[x]-2, 0, 90);
		}
		
	}

	createOres() {
		let copper 	= this.random.nextInt();
		let iron 	= this.random.nextInt();
		let silver 	= this.random.nextInt();
		let gold 	= this.random.nextInt();
		let evil 	= this.random.nextInt();
		let fossil 	= this.random.nextInt();
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if((this.world.isBlock(Blocks.SandstoneBlock, x, y) || this.world.isBlock(Blocks.HardenedSandBlock, x, y)) 
					&& Simplex.noise2d(fossil, 2, .1, 1/30, x, y) < .2) {
					this.world.block(Blocks.DesertFossilBlock, x, y);
					continue;
				}
				
				if(!this.world.isBlock(this.evilStone(), x, y) && !this.world.isBlock(Blocks.Stone, x, y) 
					&& !(this.world.isBlock(Blocks.MudstoneBrick, x, y) && this.world.hasBlockNear4(Blocks.Stone, x, y))) continue;

				if(Simplex.noise2d(copper, 4, .2, 1/30, x, y) < .1) {
					this.world.block(Blocks.CopperOre, x, y);
				} else if(Simplex.noise2d(iron, 4, .2, 1/27.5, x, y) < .125) {
					this.world.block(Blocks.IronOre, x, y);
				} else if(Simplex.noise2d(silver, 4, .2, 1/25, x, y) < .15) {
					this.world.block(Blocks.SilverOre, x, y);
				} else if(Simplex.noise2d(gold, 4, .2, 1/22.5, x, y) < .15) {
					this.world.block(Blocks.GoldOre, x, y);
				} else if(Simplex.noise2d(evil, 4, .2, 1/22.5, x, y) < .1) {
					this.world.block(this.evilOre(), x, y);
				}
			}
			Progress.n(ProgressTimes.ores(this.width, 1));
		}
	}

	createOrbs() {
		for (var p of this.orbPoints) {
			let cx = p.x;
			let cy = p.y;
			let range = 9;
			for (var dy = -range; dy <= range; dy++) {
				for (var dx = -range; dx <= range; dx++) {
					let xx = cx + dx;
					let yy = cy + dy;
					if(xx < 0 || xx >= this.width) continue;
					if(yy < 0 || yy >= this.height) continue;
					let hypot2 = ((dx+.5)*(dx+.5) + (dy+.5)*(dy+.5));
					if(hypot2 > range*range) continue;
					if(hypot2 >= 25) {
						this.world.block(this.evilStone(), xx, yy);
					}
				}
			}
		}	

		for (var p of this.orbPoints) {
			let cx = p.x;
			let cy = p.y;
			let range = 9;
			for (var dy = -range; dy <= range; dy++) {
				for (var dx = -range; dx <= range; dx++) {
					let xx = cx + dx;
					let yy = cy + dy;
					if(xx < 0 || xx >= this.width) continue;
					if(yy < 0 || yy >= this.height) continue;

					let hypot2 = ((dx+.5)*(dx+.5) + (dy+.5)*(dy+.5));
					if(hypot2 > range*range) continue;

					if(hypot2 < 25) {
						this.world.block(Blocks.Air, xx, yy);
						this.world.wall(this.evilWall(), xx, yy);
					}
				}
			}

			this.world.sprite(Blocks.OrbHeart, p.x-1, p.y-1, this.world.isCrimson ? 36 : 0, 0);
		}	
	}

	createGrass() {
		let buffer = new Array(this.width);
		for (var x = 0; x < this.width; x++) {
			buffer[x] = new Array(this.height);
		}

		let setBlock = (type, x, y) => {
			if(buffer[x][y] == undefined) buffer[x][y] = this.world.tiles[x][y];
			buffer[x][y].type = type.id;
			buffer[x][y].isActive = true;
		};
		let setWall = (type, x, y) => {
			if(buffer[x][y] == undefined) buffer[x][y] = this.world.tiles[x][y];
			buffer[x][y].wall = type;
		};
		let setFrame = (u, v, x, y) => {
			buffer[x][y].u = u;
			buffer[x][y].v = v;
		};

		for (var y = 0; y < this.height; y++) {
			let isCave = y > this.world.rockLevel;
			for (var x = 0; x < this.width; x++) {
				if(!this.world.hasAirNear4(x, y)) {
					if(this.world.isBlock(this.evilGrass(), x, y)) {
						setBlock(Blocks.DirtBlock, x, y);
					}
					if(this.world.isBlock(Blocks.MushroomGrassBlock, x, y)) {
						setBlock(Blocks.MudBlock, x, y);
					}
					if(this.world.isBlock(Blocks.AshGrassBlock, x, y)) {
						setBlock(Blocks.AshBlock, x, y);
					}
					continue;
				}
				if(this.random.nextInt(1) != 0) continue;
				let biomeblock = null;
				if(this.world.isBlock(Blocks.Stone, x, y)) 					biomeblock = Blocks.Stone;
				if(this.world.isBlock(Blocks.StoneAccentSlab, x, y)) 		biomeblock = Blocks.Stone; 	
				if(this.world.isBlock(Blocks.SandstoneBrick, x, y)) 		biomeblock = Blocks.SandstoneBrick;
				if(this.world.isBlock(Blocks.IceBlock, x, y)) 				biomeblock = Blocks.IceBlock;
				if(this.world.isBlock(Blocks.MudBlock, x, y)) 				biomeblock = Blocks.MudBlock;
				if(this.world.isBlock(this.evilStone(), x, y)) 				biomeblock = this.evilStone();
				if(this.world.isBlock(Blocks.LihzahrdBrick, x, y)) 			biomeblock = Blocks.LihzahrdBrick;
				if(this.world.isBlock(Blocks.MushroomGrassBlock, x, y)) 	biomeblock = Blocks.MushroomGrassBlock;
 				
				if(biomeblock == undefined) continue;
				if(buffer[x][y] == undefined) buffer[x][y] = this.world.tiles[x][y];

				if(this.random.nextInt(3) == 0) {
					if(biomeblock == Blocks.Stone && !isCave) setBlock(Blocks.Grass, x, y);
					if(biomeblock == Blocks.SandstoneBrick) setBlock(Blocks.Grass, x, y);
					if(biomeblock == Blocks.MudBlock) setBlock(Blocks.StoneAccentSlab, x, y);
					if(biomeblock == Blocks.LihzahrdBrick) setBlock(Blocks.JungleGrassBlock, x, y);
					if(biomeblock == Blocks.CrimstoneBlock && this.random.nextInt(2) == 0) setBlock(Blocks.CrimstoneBrick, x, y);	
					if(biomeblock == Blocks.EbonstoneBlock && this.random.nextInt(2) == 0) setBlock(Blocks.EbonstoneBrick, x, y);
				} else {
					if(biomeblock == Blocks.Stone) 		setBlock(isCave ? Blocks.KryptonMossBlock : Blocks.LivingWoodBlock, x, y);
					if(biomeblock == Blocks.IceBlock) 	setBlock(Blocks.StoneAccentSlab, x, y);
					if(biomeblock == Blocks.MudBlock) 	setBlock(Blocks.JungleGrassBlock, x, y);
					
					let range = this.random.nextInt(1, 5);

					for (var dy = -range; dy <= range; dy++) {
						for (var dx = -range; dx <= range; dx++) {
							let xx = x + dx;
							let yy = y + dy;
							if(xx < 0 || xx >= this.width) continue;
							if(yy < 0 || yy >= this.height) continue;

							let hypot2 = dx*dx + dy*dy;
							if(hypot2 > range*range) continue;

							if(this.world.isBlock(Blocks.DirtBlock, xx, yy)) 		setBlock(Blocks.LivingWoodBlock, xx, yy);
							if(this.world.isBlock(Blocks.CrimstoneBlock, xx, yy)) 	setBlock(Blocks.CrimstoneBlock, xx, yy);
							if(this.world.isBlock(Blocks.EbonstoneBlock, xx, yy)) 	setBlock(Blocks.EbonstoneBlock, xx, yy);

							if(biomeblock == Blocks.Stone || biomeblock == Blocks.MudBlock || biomeblock == Blocks.SandstoneBrick) setWall(Walls.LivingLeafWall, xx, yy);
							if(biomeblock == Blocks.IceBlock && !this.world.isAir(xx, yy+1)) setWall(Walls.BorealWoodFence, xx, yy);
							if(biomeblock == Blocks.CrimstoneBlock) {
								setWall(Walls.LivingLeafWall, xx, yy);
								buffer[xx][yy].wallColor = Paints.Red;
							}
							if(biomeblock == Blocks.EbonstoneBlock) {
								setWall(Walls.LivingLeafWall, xx, yy);
								buffer[xx][yy].wallColor = Paints.Purple;
							}
						}
					}
				}

				if(this.world.isAir(x, y+1) && this.random.nextInt(1) == 0 && (biomeblock != Blocks.LihzahrdBrick || this.world.isBlock(Blocks.JungleGrassBlock, x, y))) {
					let vines = this.random.nextInt(5, 15);
					let type = this.random.nextInt(2) == 0 ? Blocks.FlowerVines : Blocks.Vines;

					if(biomeblock == Blocks.MushroomGrassBlock) type = Blocks.MushroomVines;
					if(biomeblock == Blocks.MudBlock) 			type = Blocks.JungleVines;
					if(biomeblock == Blocks.LihzahrdBrick) 		type = Blocks.JungleVines;
					if(biomeblock == Blocks.EbonstoneBlock) 	type = Blocks.CorruptVines;
					if(biomeblock == Blocks.CrimstoneBlock) 	type = Blocks.CrimsonVines;
					
					if(x%2==0 && this.random.nextInt(9) == 0 && biomeblock != Blocks.SandstoneBrick && biomeblock != Blocks.LihzahrdBrick) {
						type = Blocks.Chain;
					} else if(biomeblock == Blocks.IceBlock) {
						continue;
					}
					
					let endy = 0;
					for (var i = 1; i < vines; i++) {
						if(!this.world.isAir(x, y+1+i)) break;
						if(y+i >= this.height) break;
						setBlock(type, x, y+i);
						endy = i;
					}

					if(endy > 3 && type == Blocks.Chain) {
						setBlock(Blocks.Lanterns, x, y+endy);
						setBlock(Blocks.Lanterns, x, y+endy-1);
						setFrame(0, 234, x, y+endy);
						setFrame(0, 216, x, y+endy-1);
						setBlock(Blocks.Platforms, x, y+endy-2);

						if(biomeblock == Blocks.Stone) setFrame(90,414, x, y+endy-2);
						if(biomeblock == Blocks.MudBlock) setFrame(90,306, x, y+endy-2);
						if(biomeblock == Blocks.EbonstoneBlock) {
							setFrame(0,1422, x, y+endy);
							setFrame(0,1404, x, y+endy-1);
							setBlock(Blocks.Platforms, x,y+endy-2);
							setFrame(90,666, x, y+endy-2);
						}
						if(biomeblock == Blocks.CrimstoneBlock) {
							setFrame(0,450, x, y+endy);
							setFrame(0,432, x, y+endy-1);
							setBlock(Blocks.Platforms, x,y+endy-2);
							setFrame(90,612, x, y+endy-2);
						}
						if(biomeblock == Blocks.IceBlock) {
							setFrame(0,1062, x, y+endy);
							setFrame(0,1044, x, y+endy-1);
							setBlock(Blocks.BorealWood, x,y+endy-2);
						}
						if(biomeblock == Blocks.MushroomGrassBlock) {
							setFrame(0,1026, x, y+endy);
							setFrame(0,1008, x, y+endy-1);
							setBlock(Blocks.Platforms, x,y+endy-2);
							setFrame(90,324, x, y+endy-2);
						}
					}
					buffer[x][y].shape = 0;
				}
			}
			Progress.n(ProgressTimes.grass(this.width, 1)); 
		}
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				if(buffer[x][y] == undefined) continue;
				this.world.tiles[x][y] = buffer[x][y];
			}
		}
	}

	takeMegaIsland(filter) {
		let avalible = new Array(this.megaIslands.length);
		let count = 0;
		for (var i = 0; i < this.megaIslands.length; i++) {
			if(filter(this.megaIslands[i])) {
				avalible[i] = true;
				count++;
			}
		}
		if(count == 0) return null;
		let index = this.random.nextInt(0, count);
		for (var i = 0; i < avalible.length; i++) {
			if(avalible[i] == true) {
				index--;
				if(index <= 0) return this.megaIslands.splice(i, 1)[0];
			}
		}
		return null;
	}

	takeMiniIsland(filter) {
		let avalible = new Array(this.miniIslands.length);
		let count = 0;
		for (var i = 0; i < this.miniIslands.length; i++) {
			if(filter(this.miniIslands[i])) {
				avalible[i] = true;
				count++;
			}
		}
		if(count == 0) return null;
		let index = this.random.nextInt(0, count);
		for (var i = 0; i < avalible.length; i++) {
			if(avalible[i] == true) {
				index--;
				if(index <= 0) return this.miniIslands.splice(i, 1)[0];
			}
		}
		return null;
	}

	createCluster(mx, my, mw, mh, count, smoothness, wk, hk) {
			// console.log('createCluster', mx, my, mw, mh, count, smoothness, wk, hk);
		for (let i = 0; i < count; i++) { // random.nextInt(3, 5)
			let cx = mx;
			let cy = my+mh/2;
			
			let angle = Mathf.toRadians(360*i/count);//random.nextFloat(0, Mathf.pi2);
			let dst = this.random.nextInt(10, 100);
			let h = Math.floor(this.random.nextInt(5, 25)*hk);
			let w = Math.floor(this.random.nextInt(h, h*2)*wk);

			let xx = Math.floor(cx + Mathf.cos(angle)*(dst+75));
			let yy = Math.floor(cy + Mathf.sin(angle)*(dst+25));
			// console.log('createIsland', cx, cy);
			this.miniIslands.push(new Island(xx, yy, w, h, smoothness));
		}		
		this.megaIslands.push(new Island(mx, my, mw, mh, smoothness));
	}

	createIsland(cx, cy, w, h, smoothness) {
		if(w < 5) w = 5;
		if(h < 5) h = 5;
		let k1 = this.random.nextFloat(1, 2)*3/smoothness;
		let k2 = this.random.nextFloat(2, 4)*4/smoothness;
		let k3 = this.random.nextFloat(4, 8)*5/smoothness;

		let h1 = this.random.nextFloat(.25, 1);
		let h2 = this.random.nextFloat(.25, 1.5);
		let h3 = this.random.nextFloat(.25, 2);

		let isCave = cy > this.world.groundLevel;

		let borders = [{x:-1, y:-1}, {x:-1, y:-1}];

		for (var x = 0; x < w; x++) {
			let angle = x*Mathf.pi/100;
			let y = Mathf.cos(angle*k1)*h1 + Mathf.cos(angle*k2)*h2 + Mathf.cos(angle*k3)*h3;

			let y2 = (Mathf.cos(angle*k1*2)*h1 + Mathf.cos(angle*k2*2)*h2 + Mathf.cos(angle*k3*2)*h3)/2 + y;
			
			if(this.isEvilBiome(cx)) {
				y2 = (Mathf.cos(angle*k1*2)*h1 + Mathf.cos(angle*k2*2)*h2 + Mathf.cos(angle*k3*2)*h3) + y;
			}
			
			let hh = Math.abs(1 - x*2/w);
			hh *= hh;
			hh = 1 - hh;

			let minY = Mathf.floor(cy+y);
			let maxY = Mathf.floor(cy+hh*h + y2*5*hh);
			
			if(maxY <= minY) continue;
			
			if(x < w/2 && borders[0].x == -1) {
				borders[0].x = cx+x-w/2;
				borders[0].y = minY;
			}
			
			if(x > w/2) {
				borders[1].x = cx+x-w/2;
				borders[1].y = minY;
			}
			
			for (var yy = minY; yy < maxY; yy++) {
				let ty = (yy-cy)/h;
				
				let xx = cx+x-w/2;
				let simple = Simplex.noise2d(this.simplexSeed, 5, 0.5, 1/20.0, xx, yy);
				let simple2 = Simplex.noise2d(this.simplexGapSeed, 3, 0.2, 1/40.0, xx, yy);

				if(this.isEvilBiome(cx)) simple2 *= 3;
				
				if(simple < .6 && simple2 > .7 + ty*hh) continue;
				if(simple > .4 && simple2 < .15 + ty*ty*.5) continue;
				
				if(this.isHellBiome(cx, cy) && !this.isDesertBiome(cx, cy)) simple *= 2;
				
				if(simple > .5 + ty/4
						&& (!this.isDesertBiome(cx, cy) || this.isHellBiome(cx, cy) || yy < Mathf.ilerp(minY, maxY, .75))
						&& (!this.isEvilBiome(cx) || yy < Mathf.ilerp(minY, maxY, .25))) {
					let block = isCave ? Blocks.Stone : Blocks.DirtBlock;
					if(this.isJungleBiome(cx)) 		block = Blocks.MudBlock;
					if(this.isSnowBiome(cx)) 		block = Blocks.SnowBlock;
					if(this.isDesertBiome(cx, cy)) 	block = Blocks.SandBlock;
					if(this.isEvilBiome(cx)) 		block = this.evilGrass();
					if(this.isGraniteBiome(cx, cy)) block = Blocks.GraniteBlock;
					if(this.isMarbleBiome(cx, cy)) 	block = Blocks.MarbleBlock;
					if(isCave) {
						if(this.isEvilBiome(cx)) 		block = this.evilStone();
						if(this.isDesertBiome(cx, cy)) 	block = Blocks.SandBlock;
					}
					if(this.isHellBiome(cx, cy)) 	block = Blocks.AshGrassBlock;
					this.world.block(block, xx, yy);
				} else {
					if(this.random.nextFloat() < .3 && (!isCave || this.random.nextFloat() < .25)) {
						let block = Blocks.MudstoneBrick;
						let paint = Paints.Gray;
						if(this.isJungleBiome(cx)) paint = Paints.None;
						if(this.isDesertBiome(cx, cy)) {
							block = Blocks.HardenedSandBlock;
							paint = Paints.None;
						}
						if(this.isSnowBiome(cx)) {
							block = Blocks.IceBlock;
							paint = Paints.None;
							if(simple2 > .5) block = Blocks.SlushBlock;
						}
						if(this.isEvilBiome(cx)) {
							block = this.evilStone();
							paint = Paints.None;
						}
						if(this.isHellBiome(cx, cy)) {
							block = Blocks.HellstoneOre;
							paint = Paints.None;
						}
						if(this.isGraniteBiome(cx, cy)) {
							block = Blocks.SmoothGraniteBlock;
							paint = Paints.None;
						}
						if(this.isMarbleBiome(cx, cy)) {
							block = Blocks.SmoothMarbleBlock;
							paint = Paints.None;
						}
						this.world.block(block, xx, yy);
						if(paint != Paints.None) this.world.paint(paint, xx, yy);
					} else {
						let block = Blocks.Stone;
						if(this.isJungleBiome(cx)) {
							block = Blocks.MudBlock;
						}
						if(this.isDesertBiome(cx, cy)) {
							block = Blocks.SandstoneBlock;
						}
						if(this.isSnowBiome(cx)) {
							block = Blocks.IceBlock;
						}
						if(this.isEvilBiome(cx)) {
							block = this.evilStone();
						}
						if(this.isHellBiome(cx, cy)) {
							block = Blocks.HellstoneOre;
							if(this.isDesertBiome(cx, cy) && simple < .5) {
								block = Blocks.AshBlock;
							}
						}
						if(this.isGraniteBiome(cx, cy)) {
							block = Blocks.GraniteBlock;
						}
						if(this.isMarbleBiome(cx, cy)) {
							block = Blocks.MarbleBlock;
						}
						this.world.block(block, xx, yy);
					}
				}
			}
		}

		if(!this.isHellBiome(cx, cy) && this.isEvilBiome(cx) && w > 50 && h > 25) {
			this.orbPoints.push({x:cx, y:cy + h/2});
		}
		this.islandsLefts.push(borders[1]);
		this.islandsRights.push(borders[0]);
	}

	isSnowBiome(x, y) {
		return this.isBiome(this.snow, x);
	}
	
	isSnowBiome(x) {
		return this.isBiome(this.snow, x);
	}

	isDesertBiome(x, y) {
		return this.isBiome(this.desert, x);
	}

	isJungleBiome(x, y) {
		return this.isBiome(this.jungle, x);
	}
	
	isJungleBiome(x) {
		return this.isBiome(this.jungle, x);
	}
	
	isEvilBiome(x) {
		return this.isBiome(this.evil, x);
	}

	isHellBiome(x, y) {
		return y > this.height-200;
	}

	isGraniteBiome(x, y) {
		return Mathf.hypot2(x-this.granite.x, y-this.granite.y) < 150;
	}

	isMarbleBiome(x, y) {
		return Mathf.hypot2(x-this.marble.x, y-this.marble.y) < 150;
	}

	isDungeonBiome(x, y) {
		return this.isBiome(this.dungeon, x) && y-100 >= this.world.dungeon.y && !this.isHellBiome(x, y);
	}

	getBiome(cx, cy) {
		if(this.isHellBiome(cx, cy)) 	return Biomes.Hell;
//		if(isGraniteBiome(cx, cy)) 		return Biomes.Evil;
//		if(isMarbleBiome(cx, cy)) 		return Biomes.Evil;
		if(this.isDesertBiome(cx, cy)) 	return Biomes.Desert;
		if(this.isEvilBiome(cx, cy)) 	return Biomes.Evil;
		if(this.isJungleBiome(cx, cy)) 	return Biomes.Jungle;
		if(this.isSnowBiome(cx, cy)) 	return Biomes.Snow;
		return Biomes.None;
	}

	isBiome(p, x) {
		let extra = this.width/50;
		return p.x+extra <= x && x <= p.y-extra;
	}

	evilStone() {
		return this.world.isCrimson ? Blocks.CrimstoneBlock : Blocks.EbonstoneBlock;
	}
	
	evilOre() {
		return this.world.isCrimson ? Blocks.CrimtaneOre : Blocks.DemoniteOre;
	}
	
	evilGrass() {
		return this.world.isCrimson ? Blocks.CrimsonGrassBlock : Blocks.CorruptGrassBlock;
	}
	
	evilWall() {
		return this.world.isCrimson ? Walls.CrimstoneWallNatural : Walls.EbonstoneWallNatural;
	}
}

class Island {


	constructor(cx, cy, w, h, smoothness) {
		this.cx = cx;
		this.cy = cy;
		this.w = w;
		this.h = h;
		this.smoothness = smoothness;
	}

	create(fw) {
		fw.createIsland(this.cx, this.cy, this.w, this.h, this.smoothness);
	}

	createMushroom(f) {
		let smoothness = 5;
		let w = 100;
		let h = 25;
		let cx = this.cx;
		let cy = this.cy;

		let k1 = f.random.nextFloat(1, 2)*3/smoothness;
		let k2 = f.random.nextFloat(2, 4)*4/smoothness;
		let k3 = f.random.nextFloat(4, 8)*5/smoothness;

		let h1 = f.random.nextFloat(.25, 1);
		let h2 = f.random.nextFloat(.25, 1.5);
		let h3 = f.random.nextFloat(.25, 2);
		let borders = [{x:-1,y:-1},{x:-1,y:-1}];
			
		for (var x = 0; x < w; x++) {
			let angle = x*Mathf.pi/100;///w;
			let y = Mathf.cos(angle*k1)*h1 + Mathf.cos(angle*k2)*h2 + Mathf.cos(angle*k3)*h3;

			let y2 = y;//(Mathf.cos(angle*k1*2)*h1 + Mathf.cos(angle*k2*2)*h2 + Mathf.cos(angle*k3*2)*h3)/2f + y;

			let hh = Math.abs(1 - x*2/w);
			hh *= hh;
			hh = 1 - hh;

			let minY = Mathf.floor(cy+y);
			let maxY = Mathf.floor(cy+hh*h + y2*5*hh);
				
			if(maxY <= minY) continue;
			
			if(x < w/2 && borders[0].x == -1) {
				borders[0].x = cx+x-w/2;
				borders[0].y = minY;
			}
			
			if(x > w/2) {
				borders[1].x = cx+x-w/2;
				borders[1].y = minY;
			}
			
			for (var yy = minY; yy < maxY; yy++) {
				let ty = (yy-cy)/h;
				let xx = cx+x-w/2;
				let fy = cy+h-(yy-cy);
				f.world.block(Blocks.MushroomGrassBlock, xx, fy);
				f.world.paint(Paints.None, xx, fy);
			}
		}
			
		// leg
			
		for (var y = 0; y < h*2; y++) {
			let angle = y*Mathf.pi/100;///w;
			let x = Mathf.cos(angle*k1)*h1 + Mathf.cos(angle*k2)*h2 + Mathf.cos(angle*k3)*h3;

			let xx = Mathf.floor(cx + x);
			let yy = Mathf.floor(cy + y + h/2);
			
			for (var dy = -5; dy <= 5; dy++) {
				for (var dx = -5; dx <= 5; dx++) {
					if(dx*dx+dy*dy > 25) continue;
					f.world.block(Blocks.MushroomGrassBlock, xx+dx, yy+dy);
				}
			}
		}
			
		w = 0;
		h = 0;
	}

	createHive(f) {
		let smoothness = 2;
		let cx = this.cx;
		let cy = this.cy;
		let h = this.h;
		let w = this.w / 1.5;

		let k1 = f.random.nextFloat(1, 2)*5/smoothness;
		let k2 = f.random.nextFloat(2, 4)*5/smoothness;
		let k3 = f.random.nextFloat(4, 8)*5/smoothness;

		let h1 = f.random.nextFloat(.25, 1);
		let h2 = f.random.nextFloat(.25, 1.5);
		let h3 = f.random.nextFloat(.25, 2);
		
		for (var x = 0; x < w; x++) {
			let angle = x*Mathf.pi/100;
			let y = Mathf.cos(angle*k1)*h1 + Mathf.cos(angle*k2)*h2 + Mathf.cos(angle*k3)*h3;
			let y2 = Mathf.sin(angle*k3)*h1 + Mathf.sin(angle*k2)*h2 + Mathf.sin(angle*k1)*h3;
				
			let hh = Math.abs(1 - x*2/w);
			hh = 1 - hh*hh;
			let ahh = Math.abs(1 - (x+w/4)*2/w/2);
			ahh = 1 - ahh*ahh;
				
			let minY = Mathf.floor(cy+y2 -(+hh*h + y*5*hh));
			let maxY = Mathf.floor(cy+hh*h + y2*5*hh);
				
			if(maxY <= minY) continue;
				
			for (var yy = minY; yy < maxY; yy++) {
				let xx = cx+x-w/2;
				let simple = Simplex.noise2d(f.simplexSeed, 5, 0.2, 1/30.0, xx, yy);
				if(yy - minY > 1 && maxY - yy > 1) f.world.wall(Walls.HiveWallNatural, xx, yy);
				if(yy - minY > h/3*ahh && maxY - yy > h/3*ahh && simple > .33) {
					f.world.block(Blocks.Air, xx, yy);
					continue;
				}
				f.world.block(Blocks.HiveBlock, xx, yy);
			}
		}
			
		let avalible = [];

		for (var y = Mathf.floor(cy-h); y < cy+h; y++) {
			for (var x = Mathf.floor(cx-w/2); x < cx+w/2; x++) {
				// if(!f.world.isAir(x, y)) {
					// continue;
				// }
				// f.world.block(Blocks.Stone, x, y);
				if(!f.world.isWall(Walls.HiveWallNatural, x, y)) continue;
				if(!f.world.isBlock(Blocks.HiveBlock, x, y+3)) continue;
				if(!f.world.isBlock(Blocks.HiveBlock, x+1, y+3)) continue;
				if(!f.world.isBlock(Blocks.HiveBlock, x+3, y+3)) continue;
				if(!f.world.hasArea(x, y, 3, 3)) continue;
				avalible.push({x:x,y:y});
			}
		}
			
		for (var i = 0; i < f.random.nextInt(1, Mathf.floor(Mathf.clamp(h/10, 2, 5))); i++) {
			if(avalible.length == 0) break;
			var p = avalible[f.random.nextInt(0, avalible.length)];
			if(!f.world.isBlock(Blocks.HiveBlock, p.x, p.y+3)) continue;
			if(!f.world.isBlock(Blocks.HiveBlock, p.x+1, p.y+3)) continue;
			if(!f.world.isBlock(Blocks.HiveBlock, p.x+3, p.y+3)) continue;
			if(!f.world.hasArea(p.x, p.y, 3, 3)) continue;
			f.world.sprite(Blocks.Larva, p.x, p.y, 0,0);
		}
	}
		
	addHoney(f) {
		let cx = this.cx;
		let cy = this.cy;
		let h = this.h;
		let w = this.w / 1.5;

		let len = w/4;
		for (var y = Mathf.floor(cy+h+8); y >= cy-h-8; y--) {
			for (var x = Mathf.floor(cx-w/2); x < cx+w/2; x++) {
				if(!f.world.isWall(Walls.HiveWallNatural, x, y)) continue;
				if(f.world.isBlock(Blocks.HiveBlock, x, y)) continue;
				if(!f.world.isBlock(Blocks.HiveBlock, x-1, y)) continue;

				for (var endx = x; endx < x+len; endx++) {
					if(f.world.isBlock(Blocks.Larva, endx, y+1)) break;
					if(!f.world.isBlock(Blocks.HiveBlock, endx, y+1) && !f.world.isLiquid(LiquidType.Honey, endx, y+1)) break;
					if(f.world.isBlock(Blocks.HiveBlock, endx, y)) {
						for (var xx = x; xx < endx; xx++) {
							f.world.liquid(LiquidType.Honey, 255, xx, y);
						}
						break;
					}
				}
			}
		}
	}

	createPhyramid(f) {
		let h = 7*25;
		let w = h*2;
		
		f.createIsland(this.cx, this.cy-10, w, h+10, this.smoothness);

		let phyramid = Phyramid.create(f, h, this.cx-w/2, this.cy);
		
		for (var x = 0; x < w; x++) {
			let xx = Mathf.floor(x+this.cx-w/2);
			for (var y = 0; y < h; y++) {
				let yy = Mathf.floor(this.cy+y);
				if(f.world.has(xx, yy) && phyramid[x][y] != undefined) {
					f.world.tiles[xx][yy] = phyramid[x][y];
				}
			}
		}
	}

	createShimmer(f) {
		let smoothness = 5;
		let w = 100;
		let h = 25;
		let cx = this.cx;
		let cy = this.cy;
		let k1 = f.random.nextFloat(1, 2)*3/smoothness;
		let k2 = f.random.nextFloat(2, 4)*4/smoothness;
		let k3 = f.random.nextFloat(4, 8)*5/smoothness;
		let h1 = f.random.nextFloat(.25, 1);
		let h2 = f.random.nextFloat(.25, 1.5);
		let h3 = f.random.nextFloat(.25, 2);
		let borders = [{x:-1,y:-1},{x:-1,y:-1}];
		let minShimmerY = Infinity;
		
		for (var x = 0; x < w; x++) {
			let angle = x*Mathf.pi/100;;
			let y = Mathf.cos(angle*k1)*h1 + Mathf.cos(angle*k2)*h2 + Mathf.cos(angle*k3)*h3;
			let y2 = y;
			let hh = Math.abs(1 - x*2/w);
			hh *= hh;
			hh = 1 - hh;

			let hhs = Math.abs(1 - (x+w/4)*2/w/2);
			hhs *= hhs;
			hhs = 1 - hhs;

			let minY = Mathf.floor(cy+y);
			let maxY = Mathf.floor(cy+hh*h + y2*5*hh);
			let simmerY = maxY - h/2;
				
			if(maxY <= minY) continue;
				
			if(x < w/2 && borders[0].x == -1) {
				borders[0].x = cx+x-w/2;
				borders[0].y = minY;
			}
				
			if(x > w/2) {
				borders[1].x = cx+x-w/2;
				borders[1].y = minY;
			}
			minShimmerY = Math.max(minY, minShimmerY);
				
			for (var yy = minY; yy < maxY; yy++) {
				let ty = (yy-cy)/h;
				let xx = cx+x-w/2;
				if(simmerY > yy) {
					f.world.block(Blocks.Air, xx, yy);
					continue;
				}
				f.world.block(Blocks.AetheriumBlock, xx, yy);
			}
		}

		for (var y = cy+h-1; y >= cy; y--) {
			for (var x = cx-w/2; x < cx+w/2; x++) {
				if(!f.world.isAir(x, y)) continue;
				let down = f.world.isLiquid(LiquidType.Shimmer, x, y+1)
						|| f.world.isBlock(Blocks.AetheriumBlock, x, y+1) 
						|| f.world.isBlock(Blocks.AetheriumBrick, x, y+1);
				
				let left = f.world.isLiquid(LiquidType.Shimmer, x-1, y)
						|| f.world.isBlock(Blocks.AetheriumBlock, x-1, y) 
						|| f.world.isBlock(Blocks.AetheriumBrick, x-1, y);
				if(down && left) {
					f.world.liquid(LiquidType.Shimmer, 255, x, y);
					if(x+1 >= cx+w/2) {
						for (x = cx-w/2; x < cx+w/2; x++) {
							f.world.liquid(LiquidType.None, 0, x, y);
						}
						break;
					}
				}
			}
		}
	}
}