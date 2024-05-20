const FieldType = {
	Byte: 		1,
	Int16: 		2,
	Int32: 		3,
	Int64: 		4,
	Float: 		5,
	Double: 	6,
	String: 	7,
	Bytes: 		8,
	Boolean: 	9,
	Vec2: 		10,

	Int32Array: "int32 array",
	StringArray: "string array",
};

const WorldFields = {
	version: 					FieldType.Int32,
	fileRevision: 				FieldType.Int32,
	seed: 						FieldType.String,
	title: 						FieldType.String,
	worldGeneratorVersion:   	FieldType.Int64,
	guid:       				FieldType.Bytes,
	worldId:  					FieldType.Int32,
	leftBorder:  				FieldType.Int32,
	rightBorder:  				FieldType.Int32,
	topBorder:  				FieldType.Int32,
	bottomBorder:  				FieldType.Int32,

	height:  					FieldType.Int32,
	width:  					FieldType.Int32,

	gamemode:  					FieldType.Int32,
	seedDrunkWorld:  			FieldType.Boolean,
	seedFortheworthy:  			FieldType.Boolean,
	seedCelebrationmk10:  		FieldType.Boolean,			
	seedConstant:  				FieldType.Boolean,	
	seedNotthebees:  			FieldType.Boolean,	
	seedRemix:  				FieldType.Boolean,
	seedNotraps:  				FieldType.Boolean,
	seedGetfixedboi:  			FieldType.Boolean,
	creationTime: 				FieldType.Int64,
	moonStyle: 					FieldType.Byte,
	treeX0: 					FieldType.Int32,
	treeX1: 					FieldType.Int32,
	treeX2: 					FieldType.Int32,
	treeStyle0: 				FieldType.Int32,
	treeStyle1: 				FieldType.Int32,
	treeStyle2: 				FieldType.Int32,
	treeStyle3: 				FieldType.Int32,
	caveBackX0: 				FieldType.Int32,
	caveBackX1: 				FieldType.Int32,
	caveBackX2: 				FieldType.Int32,
	caveBackStyle0: 			FieldType.Int32,
	caveBackStyle1: 			FieldType.Int32,
	caveBackStyle2: 			FieldType.Int32,
	caveBackStyle3: 			FieldType.Int32,
	iceBackStyle: 				FieldType.Int32,
	jungleBackStyle: 			FieldType.Int32,
	hellBackStyle: 				FieldType.Int32,
	spawn:						FieldType.Vec2,
	groundLevel:           		FieldType.Double,
	rockLevel:           		FieldType.Double,
	time:           			FieldType.Double,
	dayTime:           			FieldType.Boolean,
	moonPhase:           		FieldType.Int32,
	bloodMoon:           		FieldType.Boolean,
	isEclipse:           		FieldType.Boolean,
	dungeon:           			FieldType.Vec2,
	isCrimson:           		FieldType.Boolean,
	eyeofcthulhu:           	FieldType.Boolean,
	evilboss:           		FieldType.Boolean,
	skeletron:           		FieldType.Boolean,
	queenbee:         			FieldType.Boolean,
	destroyer:        			FieldType.Boolean,
	twins:        				FieldType.Boolean,
	skeletronprime:        		FieldType.Boolean,
	mechbossAny:      			FieldType.Boolean,
	plantera:        			FieldType.Boolean,
	golem:        				FieldType.Boolean,
	slimeking:    				FieldType.Boolean,
	goblin:        				FieldType.Boolean,
	wizard:    					FieldType.Boolean,
	mech:        				FieldType.Boolean,
	goblinarmy:        			FieldType.Boolean,
	clown:        				FieldType.Boolean,
	frostmoon:        			FieldType.Boolean,
	pirates:        			FieldType.Boolean,
	shadowOrbSmashed:       	FieldType.Boolean,
	meteor:        				FieldType.Boolean,
	orbs:        				FieldType.Byte,
	altars:        				FieldType.Int32,
	hardmode:        			FieldType.Boolean,
	afterPartyOfDoom:       	FieldType.Boolean,
	invasionDelay:        		FieldType.Int32,
	invasionSize:        		FieldType.Int32,
	invasionType:        		FieldType.Int32,
	invasionX:        			FieldType.Double,
	slimeRainTime:        		FieldType.Double,
	sundialCooldown:        	FieldType.Byte,
	tempRaining:       			FieldType.Boolean,
	tempRainTime:       		FieldType.Int32,
	tempMaxRain:       			FieldType.Float,
	cobaltId:    				FieldType.Int32,
	mythrilId:   				FieldType.Int32,
	adamantiteId:				FieldType.Int32,
	bgTree:       				FieldType.Byte,
	bgCorruption:       		FieldType.Byte,
	bgJungle:       			FieldType.Byte,
	bgSnow:       				FieldType.Byte,
	bgHallow:       			FieldType.Byte,
	bgCrimson:       			FieldType.Byte,
	bgDesert:       			FieldType.Byte,
	bgOcean:       				FieldType.Byte,
	cloudBgActive:				FieldType.Int32,
	clouds:						FieldType.Int16,
	windSpeed:       			FieldType.Float,
	anglers:       				FieldType.StringArray,
	angler:       				FieldType.Boolean,
	anglerQuest:       			FieldType.Int32,
	stylist:       				FieldType.Boolean,
	taxcollector:      			FieldType.Boolean,
	golfer:       				FieldType.Boolean,
	invasionSizeStart:      	FieldType.Int32,
	lunaticCultistCooldown:     FieldType.Int32,
	killedMobs:       			FieldType.Int32Array,
	fastForwardTime:       		FieldType.Boolean,
	fishron:       				FieldType.Boolean,
	martians:       			FieldType.Boolean,
	lunaticCultist:   			FieldType.Boolean,
	moonlord:       			FieldType.Boolean,
	halloweenKing:    			FieldType.Boolean,
	halloweenTree:    			FieldType.Boolean,
	christmasQueen:  			FieldType.Boolean,
	santa:       				FieldType.Boolean,
	christmasTree:    			FieldType.Boolean,
	solarPillar:   				FieldType.Boolean,
	vortexPillar:  				FieldType.Boolean,
	nebulaPillar:  				FieldType.Boolean,
	stardustPillar:				FieldType.Boolean,
	solarPillarSpawned:			FieldType.Boolean,
	vortexPillarSpawned:		FieldType.Boolean,
	nebulaPillarSpawned:		FieldType.Boolean,
	stardustPillarSpawned:		FieldType.Boolean,
	apocalypse:					FieldType.Boolean,
	stardustPillar:				FieldType.Boolean,
	partyManual:				FieldType.Boolean,
	partyGenuine:				FieldType.Boolean,
	partyCooldown:       		FieldType.Int32,
	partyingNPCs:       		FieldType.Int32Array,
	sandStormHappening:			FieldType.Boolean,
	sandStormTimeLeft:      	FieldType.Int32,
	sandStormSeverity:      	FieldType.Float,
	sandStormIntendedSeverity:  FieldType.Float,
	bartender:					FieldType.Boolean,
	oldonesarmy1:				FieldType.Boolean,
	oldonesarmy2:				FieldType.Boolean,
	oldonesarmy3:				FieldType.Boolean,
	mushroomBg:      			FieldType.Byte,
	underworldBg:      			FieldType.Byte,
	bgTree2:      				FieldType.Byte,
	bgTree3:      				FieldType.Byte,
	bgTree4:      				FieldType.Byte,
	combatbook:					FieldType.Boolean,
	lanternNightCooldown:      	FieldType.Int32,
	lanternNightGenuine:		FieldType.Boolean,
	lanternNightManual:			FieldType.Boolean,
	lanternNightAwaitNight:		FieldType.Boolean,
	treeTopStyles:      		FieldType.Int32Array,
	forceHalloweenToday:		FieldType.Boolean,
	forceXMasToday:				FieldType.Boolean,
	copperId:					FieldType.Int32,
	ironId:						FieldType.Int32,
	silverId:					FieldType.Int32,
	goldId:						FieldType.Int32,
	cat:						FieldType.Boolean,
	dog:						FieldType.Boolean,
	bunny:						FieldType.Boolean,
	empressOfLight:				FieldType.Boolean,
	queenSlime:					FieldType.Boolean,
	deerclops:					FieldType.Boolean,
	slimeBlue:					FieldType.Boolean,
	merchant:					FieldType.Boolean,
	demolitionist:				FieldType.Boolean,
	partygirl:					FieldType.Boolean,
	dyetrader:					FieldType.Boolean,
	truffle:					FieldType.Boolean,
	armsdealer:					FieldType.Boolean,
	nurse:						FieldType.Boolean,
	princess:					FieldType.Boolean,
	combatbook2:				FieldType.Boolean,
	peddlerssatchel:			FieldType.Boolean,
	slimeGreen:					FieldType.Boolean,
	slimeOld:					FieldType.Boolean,
	slimePurple:				FieldType.Boolean,
	slimeRainbow:				FieldType.Boolean,
	slimeRed:					FieldType.Boolean,
	slimeYellow:				FieldType.Boolean,
	slimeCopper:				FieldType.Boolean,
	fastForwardTimeToDusk:		FieldType.Boolean,
	moondialCooldown:			FieldType.Byte,
	placeholder: 0
};

class WorldWriter {

	static save(world) {
		let bw = new BinaryWriter();
        let segmentStart = new Array(world.version >= 220 ? 11 : 10);
		segmentStart[0]  = WorldWriter.section(world, bw, segmentStart);
        segmentStart[1]  = WorldWriter.header(world, bw);
        segmentStart[2]  = WorldWriter.tiles(world, bw);
        segmentStart[3]  = WorldWriter.chests(world, bw);
        segmentStart[4]  = WorldWriter.sign(world, bw);
        segmentStart[5]  = WorldWriter.npc(world, bw);
		segmentStart[6]  = WorldWriter.emptySegment(world, bw);
		segmentStart[7]  = WorldWriter.emptySegment(world, bw);
        segmentStart[8]  = WorldWriter.emptySegment(world, bw);
        segmentStart[9]  = WorldWriter.bestiary(world, bw);
        segmentStart[10] = WorldWriter.powers(world, bw);
        bw.bool(true);
        bw.string(world.title);
        bw.int32(world.worldId);

        bw.index = 26;
        for (var i = 0; i < segmentStart.length; i++) {
            bw.int32(segmentStart[i]);
        }
        
		bw.flush();
		console.log(segmentStart);
	}

	static section(world, bw, sectionPointers) {
		Debug.time("Saving");
		world.write(bw, "version");
        if (world.version >= 140) {
            if (world.isChinese) {
                bw.chars("xindong");
            } else {
                bw.chars("relogic");
            }
            bw.out(2);
            world.write(bw, "fileRevision");
            bw.int64(world.isFavorite ? 0x1 : 0);
        }
        let sections = world.version >= 220 ? 11 : 10;
        bw.int16(sectionPointers.length);

        for (var i = 0; i < sections; i++) {
            bw.int32(0);
        }

        let framesCount = world.hasFrames.length;
        bw.int16(framesCount);

        for (var i = 0; i < framesCount; i+=8) {
        	let byte = 0;
        	for (var b = 0; b < 8; b++) {
        		if(i+b >= framesCount) break;
        		if(world.hasFrames[i+b]) {
        			byte |= Bit.bits[b];
        		}
        	}
            bw.out(byte);
        }
		return bw.index;
	}

	static header(world, bw) {
		world.write(bw, "title");
		bw.string(world.seed);
		world.writeAll(bw, 
			"worldGeneratorVersion", "guid", "worldId", "leftBorder", "rightBorder", "topBorder", "bottomBorder", "height", "width",
			"gamemode", "seedDrunkWorld", "seedFortheworthy", "seedCelebrationmk10", "seedConstant", "seedNotthebees", "seedRemix", "seedNotraps", "seedGetfixedboi",
			"creationTime",
			"moonStyle",
			"treeX0", "treeX1", "treeX2",
			"treeStyle0", "treeStyle1", "treeStyle2", "treeStyle3",
			"caveBackX0", "caveBackX1", "caveBackX2",
			"caveBackStyle0", "caveBackStyle1", "caveBackStyle2", "caveBackStyle3",
			"iceBackStyle", "jungleBackStyle", "hellBackStyle",
			"spawn", "groundLevel", "rockLevel",
			"time", "dayTime", "moonPhase", "bloodMoon", "isEclipse",
			"dungeon", "isCrimson", 
			"eyeofcthulhu", "evilboss", "skeletron", 
			"queenbee", 
			"destroyer", "twins", "skeletronprime", "mechbossAny", 
			"plantera", "golem", "slimeking", 
			"goblin", "wizard", "mech",
 			"goblinarmy", "clown", "frostmoon", "pirates",
 			"shadowOrbSmashed", "meteor", "orbs", "altars",
 			"hardmode", "afterPartyOfDoom",
			"invasionDelay", "invasionSize", "invasionType", "invasionX",
 			"slimeRainTime", "sundialCooldown",
 			"tempRaining", "tempRainTime", "tempMaxRain",
 			"cobaltId", "mythrilId", "adamantiteId",
			"bgTree", "bgCorruption", "bgJungle", "bgSnow", "bgHallow", "bgCrimson", "bgDesert", "bgOcean", 
			"cloudBgActive", "clouds", "windSpeed", "anglers", "angler", "anglerQuest",
			"stylist", "taxcollector", "golfer",
			"invasionSizeStart", "lunaticCultistCooldown"
		);
		
		bw.int16(WorldStatic.maxNpcId + 1);

        for (var i = 0; i <= WorldStatic.maxNpcId; i++) {
            if (world.killedMobs.length > i) {
                bw.int32(world.killedMobs[i]);
                continue;
            }
            bw.int32(0);
        }
		world.writeAll(bw,  "fastForwardTime", "fishron", "martians", "lunaticCultist", "moonlord", 
			"halloweenKing", "halloweenTree", "christmasQueen",
			"santa", "christmasTree", 
			"solarPillar", "vortexPillar", "nebulaPillar", "stardustPillar", 
			"solarPillarSpawned", "vortexPillarSpawned", "nebulaPillarSpawned", "stardustPillarSpawned", 
			"apocalypse",
			"partyManual", "partyGenuine", "partyCooldown", "partyingNPCs",
			"sandStormHappening", "sandStormTimeLeft", "sandStormSeverity", "sandStormIntendedSeverity",
			"bartender", "oldonesarmy1", "oldonesarmy2", "oldonesarmy3",
			"mushroomBg", "underworldBg", "bgTree2", "bgTree3", "bgTree4",
			"combatbook",
			"lanternNightCooldown", "lanternNightGenuine", "lanternNightManual", "lanternNightAwaitNight",
			"treeTopStyles",
 			"forceHalloweenToday", "forceXMasToday", 
			"copperId", "ironId", "silverId", "goldId",
 			"cat", "dog", "bunny",
			"empressOfLight", "queenSlime", "deerclops",
			"slimeBlue",
			"merchant", "demolitionist", "partygirl", "dyetrader", 
			"truffle", "armsdealer", "nurse", "princess",
			"combatbook2",
			"peddlerssatchel",
			"slimeGreen", "slimeOld", "slimePurple", "slimeRainbow", "slimeRed", "slimeYellow", "slimeCopper",
			"fastForwardTimeToDusk",
			"moondialCooldown"
			);
		return bw.index;
	}

	static tiles(world, bw) {
        let maxX = world.width;
        let maxY = world.height;
        // let callback = {dataIndex:0,headerIndex:0};

        for (var x = 0; x < maxX; x++) {
            for (var y = 0; y < maxY; y++) {
                let tile = world.tiles[x][y];
                if(tile == undefined) console.warn(`tile at ${x} ${y} is undefined`);
                let bytes = new Array(16);
				for (var i = 0; i < bytes.length; i++) {
					bytes[i] = 0;
				}
				let dataIndex = 4;
		
				let header4 = 0;
				let header3 = 0;
				let header2 = 0;
				let header1 = 0;
		
				if(tile.type != Blocks.Air.id) {
					header1 |= Tile.blockBit;
					bytes[dataIndex++] = tile.type;
					if(tile.type > 255) {
						bytes[dataIndex++] = (tile.type >> 8);
						header1 |= Tile.blockBit2;
					}
		
					if(world.hasFrames[tile.type]) {
						bytes[dataIndex++] = tile.u & 0xff;
						bytes[dataIndex++] = (tile.u >> 8) & 0xff;
						bytes[dataIndex++] = tile.v & 0xff;
						bytes[dataIndex++] = (tile.v >> 8) & 0xff;
					}
		
					if(tile.tileColor != Paints.None) {
						header3 |= Tile.colorBit;
						bytes[dataIndex++] = tile.tileColor;
					}
				}
		
				if(tile.wall != Walls.Air) {
					header1 |= Tile.wallBit;
					bytes[dataIndex++] = tile.wall;
					if(tile.wallColor != Paints.None) {
						header3 |= Tile.backgroundBit;
						bytes[dataIndex++] = tile.wallColor;
					}
				}
		
				if(tile.liquidAmount > 0 && tile.liquidType != LiquidType.None) {
					if(tile.liquidType == LiquidType.Shimmer) {
						header3 |= Bit.bit7;
						header1 |= Bit.bit3;
					}
					if(tile.liquidType == LiquidType.Water) header1 |= Tile.bitWater;
					if(tile.liquidType == LiquidType.Lava)  header1 |= Tile.bitLava;
					if(tile.liquidType == LiquidType.Honey) header1 |= Tile.bitHoney;
					bytes[dataIndex++] = tile.liquidAmount;
				}
		
				if(tile.wireRed)   header2 |= Tile.bitWireRed;
				if(tile.wireGreen) header2 |= Tile.bitWireGreen;
				if(tile.wireBlue)  header2 |= Tile.bitWireBlue;
				if(tile.wireYellow)header3 |= Tile.bitWireYellow;
		
				header2 |= tile.shape << 4;
		
				if(tile.actuator)  header3 |= Tile.bitActuator;
				if(tile.disabled)  header3 |= Tile.bitDisabled;
		
				if(tile.wall > 255) {
					header3 |= Bit.bit6;
					bytes[dataIndex++] = tile.wall >> 8;
				}
		
				let headerIndex = 3;
				if (header4 != 0) {
					header3 |= Bit.bit0;
					bytes[headerIndex--] = header4;
				}
				if (header3 != 0) {
					header2 |= Bit.bit0;
					bytes[headerIndex--] = header3;
				}
				if (header2 != 0) {
					header1 |= Bit.bit0;
					bytes[headerIndex--] = header2;
				}
				bytes[headerIndex] = header1;
		
                header1 = bytes[headerIndex];
                let rle = 0;
                let nextY = y + 1;
                let remainingY = maxY - y - 1;
                while (remainingY > 0 && world.eqlTile(tile, world.tiles[x][nextY]) && tile.type != Blocks.Plate.id && tile.type != Blocks.LogicSensor.id) {
                    rle++;
                    remainingY--;
                    nextY++;
                }
                
                y = y + rle;
                
                if (rle > 0) {
                    bytes[dataIndex++] = (rle & 0xff);
                    if (rle <= 255) {
                        header1 |= Bit.bit6;
                    } else {
                        header1 |= Bit.bit7;
                        bytes[dataIndex++] = (rle >> 8) & 0xff;
                    }
                }
                
                bytes[headerIndex] = header1;
	            bw.bytesFrom(bytes, headerIndex, dataIndex - headerIndex);
            }
        }
		return bw.index;
	}

	static chests(world, bw) {
		let validChests = [];
        for (let chest of world.chests) {
			if(chest.x < world.leftBorder) continue;
			if(chest.x > world.rightWorld) continue;
			if(chest.y < world.topWorld) continue;
			if(chest.y > world.bottomWorld) continue;
			validChests.push(chest);
		}
        
        bw.int16(validChests.length);
        bw.int16(Chest.maxItems);

        let written = 0;
        for (let chest of validChests) {
            bw.int32(chest.x);
            bw.int32(chest.y);
            bw.string(chest.name == null ? "" : chest.name);
            for (let slot = 0; slot < Chest.maxItems; slot++) {
                let item = chest.items[slot];
                if (item != null && item.amount > 0) {
                	bw.int16(item.amount);
                	bw.int32(item.item);
                	bw.out(item.modificator);
                } else  {
                    bw.int16(0);
                }
            }
            written++;
        }
		return bw.index;
	}

	static sign(world, bw) {
        bw.int16(world.signs.length);
        let written = 0;
        for(let sign of world.signs) {
            if (sign.text != null) {
                bw.string(sign.text);
                bw.int32(sign.x);
                bw.int32(sign.y);
            }
            written++;
        }
		return bw.index;
	}

	static npc(world, bw) {
		let maxNPC = WorldStatic.maxNpcId;

		bw.int32(world.shimmeredTownNPCs.length);
		for (let npcID of world.shimmeredTownNPCs) {
			 bw.int32(npcID);
		}

		for (let npc of world.NPCs) {
			if (npc.spriteId > maxNPC) break;
			bw.bool(true);
			bw.int32(npc.id);
			bw.string(npc.name);
			bw.float(npc.pos.x);
			bw.float(npc.pos.y);
			bw.bool(npc.needHome);
			bw.int32(npc.home.x);
			bw.int32(npc.home.y);
			bw.out(Bit.bit0);
			bw.int32(npc.type);
		}
		bw.bool(false);

        for (let mob of world.mobs) {
            if (mob.id > maxNPC) break;
            bw.bool(true);
			bw.int32(mob.id);
			bw.float(npc.pos.x);
			bw.float(npc.pos.y);
        }
        bw.bool(false);

		return bw.index;
	}

	static homes(world, bw) {
        let maxNPC = WorldStatic.maxNpcId;
        
        let tmp = 0;
        for (let r of world.npcHomes) {
        	if(r.npcId <= maxNPC) tmp++;
        }

        bw.int32(tmp);
        for (let r of world.npcHomes) {
        	if(r.npcId > maxNPC) continue;
            bw.int32(r.npcId);
            bw.int32(r.home.x);
            bw.int32(r.home.y);
        }
		return bw.index;
	}

	static bestiary(world, bw) {
		bw.int32(0);
		bw.int32(0);
		bw.int32(0);
		return bw.index;
	}

	static emptySegment(world, bw) {
		bw.int32(0);
		return bw.index;
	}
	
	static powers(world, bw) {
    	bw.bool(true);bw.out(0);bw.bool(false);bw.bool(false);
    	bw.bool(true);bw.out(8);bw.float(0);bw.bool(false);
    	bw.bool(true);bw.out(9);bw.bool(false);bw.bool(false);
    	bw.bool(true);bw.out(10);bw.bool(false);bw.bool(false);
    	bw.bool(true);bw.out(12);bw.float(0);bw.bool(false);
    	bw.bool(true);bw.out(13);bw.bool(false);bw.bool(true);

		bw.bool(false);
		return bw.index;
	}
}

