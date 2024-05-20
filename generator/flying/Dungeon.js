class Dungeon {

	static directions = [
			{x:-2,y:0},            {x:2,y:0},
			{x:-2,y:1}, {x:0,y:1}, {x:2,y:1}
	];
	static bricks = [
			Blocks.BlueBrick,
			Blocks.GreenBrick,
			Blocks.PinkBrick
	];
	static wallsOld = [
			Walls.CursedBlueSlabWall,
			Walls.CursedGreenSlabWall,
			Walls.CursedPinkSlabWall
	];
	static wallsBase = [
			Walls.CursedBlueBrickWall,
			Walls.CursedGreenBrickWall,
			Walls.CursedPinkBrickWall
	];
	static wallsHell = [
			Walls.CursedBlueTiledWall,
			Walls.CursedGreenTiledWall,
			Walls.CursedPinkTiledWall
	];

	static create(f, sx, sy) {
		sy+=1;
		let walker = {x:sx,y:sy};
		let dungeonColor = f.random.nextInt(2); // i hate pink dungeon
		f.createIsland(f.world.dungeon.x, f.world.dungeon.y, 250, 100, 1);
		let islands = [];
		for (var i of f.megaIslands) if(f.isDungeonBiome(i.cx, i.cy)) islands.push(i);
		for (var i of f.miniIslands) if(f.isDungeonBiome(i.cx, i.cy)) islands.push(i);

		let brick = Dungeon.bricks[dungeonColor];
		
		let wallOld = Dungeon.wallsOld[dungeonColor];
		let wallBase = Dungeon.wallsBase[dungeonColor];
		let wallHell = Dungeon.wallsHell[dungeonColor];
		let walls = [wallOld, wallBase, wallHell];
		let simplexSeed = f.random.nextInt();
		let rooms = [{x:sx,y:sy}];
		let left = f.width, right = 0, top = sy, bottom = f.height-200;

		let maxIterations = islands.length*7;//(f.world.height/8)*3;
		for (var i = 0; i < maxIterations; i++) {
			if(islands.length == 0) break;
			
			let minDst2 = Infinity;
			let target = islands[0];
			for (let island of islands) {
				let dst2 = (walker.x-island.x)*(walker.x-island.x) + (walker.y-island.y)*(walker.y-island.y);
				if(dst2 < minDst2) {
					target = island;
					minDst2 = dst2;
				}
			}
			target.cx = Mathf.floor(target.cx);
			target.cy = Mathf.floor(target.cy);
			walker.x = Mathf.floor(walker.x);
			walker.y = Mathf.floor(walker.y);

			let dx = -(walker.x-target.cx);
			let dy = -(walker.y-target.cy);
			
			let big = Math.abs(dx) + Math.abs(dy) > 100;
			
			dx = Mathf.floor(Mathf.clamp(dx, -20, 20));
			dy = Mathf.floor(Mathf.clamp(dy, -20, 20));
			
			if(walker.x + dx == target.cx && walker.y + dy == target.cy) islands.splice(islands.indexOf(target), 1);
			
			let wallSize = 5;
			let tunelSize = Math.abs(dx/5) == Math.abs(dy/2) ? 7 : 5;
			const wallType = Mathf.clamp(Mathf.floor((walker.y-top)*3/(bottom-top)), 0, 2);
			
			if(!f.isDungeonBiome(walker.x + dx, walker.y + dy)) walker = rooms[f.random.nextInt(0, rooms.length)];
			
			let count = Math.max(Math.abs(dx), Math.abs(dy));
				
			for (var c = 0; c < count; c++) {
				for (var ry = -wallSize-tunelSize; ry <= wallSize+tunelSize; ry++) {
					for (var rx = -wallSize-tunelSize; rx <= wallSize+tunelSize; rx++) {
						let xx = walker.x + dx*c/count + rx;
						let yy = walker.y + dy*c/count + ry - wallSize;
						f.world.paint(Paints.None, xx, yy);
						f.world.wallpaint(Paints.None, xx, yy);
						if(Math.abs(rx) < tunelSize && Math.abs(ry) < tunelSize) {
							f.world.block(Blocks.Air, xx, yy);
						} else if(!f.world.isWall(walls[0], xx, yy) && !f.world.isWall(walls[1], xx, yy) && !f.world.isWall(walls[2], xx, yy)){
							f.world.block(brick, xx, yy);
						}
						if(Math.abs(rx) != tunelSize+tunelSize && Math.abs(ry) != tunelSize+tunelSize) {
							f.world.wall(walls[wallType], xx, yy);
						}
						// left = Math.min(left, xx);
						// right = Math.max(right, xx);
						// top = Math.min(top, yy);
						// bottom = Math.max(bottom, yy);
					}
				}
			}

			walker.x += dx;
			walker.y += dy;
			
			if(f.random.nextInt(7) == 0) {
				let roomx = f.random.nextInt(10, 20);
				let roomy = f.random.nextInt(10, 20);
				
				for (var ry = -wallSize-roomy; ry <= wallSize+roomy; ry++) {
					for (var rx = -wallSize-roomx; rx <= wallSize+roomx; rx++) {
						let xx = walker.x + rx;
						let yy = walker.y + ry;
						
						f.world.paint(Paints.None, xx, yy);
						if(Math.abs(rx) < roomx && Math.abs(ry) < roomy) {
							f.world.block(Blocks.Air, xx, yy);
							f.world.wall(walls[wallType], xx, yy);
						} else if(!f.world.isWall(walls[0], xx, yy) && !f.world.isWall(walls[1], xx, yy) && !f.world.isWall(walls[2], xx, yy)){
							f.world.block(brick, xx, yy);
						}

						left = Math.min(left, xx);
						right = Math.max(right, xx);
						top = Math.min(top, yy);
						bottom = Math.max(bottom, yy);
					}
				}
				rooms.push({x:walker.x,y:walker.y});
				
				if(f.random.nextInt(5) == 0) {
					walker = rooms[f.random.nextInt(0, rooms.length)];
				} else if(big && f.random.nextInt(1) == 0) {
					walker = rooms[f.random.nextInt(0, rooms.length)];
				}
			}
		}

		for (var y = top; y < bottom; y++) {
			for (var x = left; x < right; x++) {
				if(!f.world.isBlock(brick, x, y)) continue;
				if(!f.world.hasAirNear4(x, y)) continue;
				if(!f.world.isWall(walls[0], x, y) && !f.world.isWall(walls[1], x, y) && !f.world.isWall(walls[2], x, y)) continue;
				if(!f.world.isWall(walls[0], x+1, y) && !f.world.isWall(walls[1], x+1, y) && !f.world.isWall(walls[2], x+1, y)) continue;
				if(!f.world.isWall(walls[0], x-1, y) && !f.world.isWall(walls[1], x-1, y) && !f.world.isWall(walls[2], x-1, y)) continue;
				if(!f.world.isWall(walls[0], x, y+1) && !f.world.isWall(walls[1], x, y+1) && !f.world.isWall(walls[2], x, y+1)) continue;
				if(!f.world.isWall(walls[0], x, y-1) && !f.world.isWall(walls[1], x, y-1) && !f.world.isWall(walls[2], x, y-1)) continue;
				
				if(Simplex.noise2d(simplexSeed, 5, 0.1, 1/30, x, y) < .6) continue;
				f.world.block(Blocks.Spike, x, y);
				if(f.world.isAir(x-2, y) && y%2==0) f.world.block(Blocks.Spike, x-1, y);
				if(f.world.isAir(x+2, y) && y%2==0) f.world.block(Blocks.Spike, x+1, y);
				if(f.world.isAir(x, y-2) && x%2==0) f.world.block(Blocks.Spike, x, y-1);
				if(f.world.isAir(x, y+2) && x%2==0) f.world.block(Blocks.Spike, x, y+1);
			}	
		}

		// platforms
		for (var y = top; y < bottom; y+=10) {
			for (var x = left; x < right; x++) {
				let ry = y + f.random.nextInt(-2, 3);
				if(!f.world.isAir(x, ry)) continue;
				if(!f.world.isAir(x, ry+1)) continue;
				if(!f.world.isAir(x, ry-1)) continue;
				if(!f.world.isWall(walls[0], x, ry) && !f.world.isWall(walls[1], x, ry) && !f.world.isWall(walls[2], x, ry)) continue;

				let px = x;
				for (px = x; px < Math.min(right, x+f.random.nextInt(5, 20)); px++) {
					if(!f.world.isAir(px, ry)) break;
					if(!f.world.isAir(px, ry+1)) break;
					if(!f.world.isAir(px, ry-1)) break;
				}
				if(px - x > 7) {
					for (var xx = x; xx < px; xx++) {
						if(f.world.isAir(px, ry-1)) {
							let type = f.random.nextInt(0, 8);
							if(type < 1) {
								f.world.block(Blocks.PlacedBottles, xx, ry-1);
								f.world.frame(18*(f.random.nextInt(0, 3)), 0, xx, ry-1);
							} else if(type < 6) {
								f.world.block(Blocks.Books, xx, ry-1);
								f.world.frame(18*(f.random.nextInt(0, 5)), 0, xx, ry-1);
							} else if(type == 7 && f.random.nextInt(4) == 0) {
								f.world.block(Blocks.WaterCandle, xx, ry-1);
							}
						}
						f.world.block(Blocks.Platforms, xx, ry);
						f.world.frame(0, 216, xx, ry);
					}
				}
				x = px+f.random.nextInt(15, 20);
			}
		}
		
		// loot

		let avalible = new Array(3);
		avalible[0] = [];
		avalible[1] = [];
		avalible[2] = [];

		for (var y = top; y < bottom; y++) {
			for (var x = left; x < right; x++) {
				if(!f.world.isAir(x, y)) continue;
				if(!f.world.isAir(x, y+1)) continue;
				if(!f.world.isAir(x+1, y)) continue;
				if(!f.world.isAir(x+1, y+1)) continue;

				if(f.world.isWall(Walls.Air, x, y)) continue;
				if(f.world.isWall(Walls.Air, x, y+1)) continue;
				if(f.world.isWall(Walls.Air, x+1, y)) continue;
				if(f.world.isWall(Walls.Air, x+1, y+1)) continue;

				if(!f.world.isBlock(brick, x, y+2)) continue;
				if(!f.world.isBlock(brick, x+1, y+2)) continue;

				for (var i = 0; i < walls.length; i++) {
					if(f.world.isWall(walls[i], x, y)) {
						avalible[i].push({x:x,y:y});
					}
				}
			}
		}

		/* Old:
		 * > Aqua Scepter
		 * > Blue Moon
		 * > Handgun
		 */
		/* Base:
		 * > Valor
		 * > Cobalt Shield
		 * > Bone Welder
		 */
		/* Hell:
		 * > Shadow Key
		 * > Magic Missile
		 * > Muramasa
		 */
		
		// 1. Piranha Gun
		// 4. Rainbow Gun

		// 5. Staff of the Frost Hydra
		// 6. Desert Tiger Staff

		// 2. Scourge of the Corruptor
		// 3. Vampire Knives
		
		let uniqueLoot = [
				[Items.AquaScepter, Items.BlueMoon, 	Items.Handgun,			Items.PiranhaGun,			Items.RainbowGun],
				[Items.Valor, 		Items.CobaltShield, Items.BoneWelder,		Items.StaffOfTheFrostHydra,	Items.DesertTigerStaff],
				[Items.ShadowKey, 	Items.MagicMissile, Items.Muramasa,			Items.ScourgeOfTheCorruptor,Items.VampireKnives],
		];

		let uniqueLootFrames = [
				[72,72,72,828,936],
				[72,72,72,972,-468],
				[72,72,72,864,900],
		];
		
		let potions = [Items.BuilderPotion, Items.EndurancePotion, Items.FeatherfallPotion, Items.GravitationPotion, 
				Items.HunterPotion, Items.MiningPotion, Items.NightOwlPotion, Items.SpelunkerPotion, Items.SwiftnessPotion,
				Items.TeleportationPotion];
		
		let proops = [Items.IronBar, Items.LeadBar,
				Items.GoldBar, Items.PlatinumBar, 
				Items.Glowstick, Items.BoneTorch
		];
		let weapons = [
				Items.Dynamite, 
				Items.Shuriken, Items.ThrowingKnife, Items.Grenade, Items.BoneArrow
		];
		
		let chests = new Array(3);
		
		for (var i = 0; i < chests.length; i++) {
			chests[i] = new Array(Math.min(uniqueLoot[i].length, avalible[i].length));
			if(chests[i].length > 0) chests[i][0] = avalible[i].splice(f.random.nextInt(0, avalible[i].length), 1)[0];
		}
		
		for (var b = 0; b < walls.length; b++) {
			const biome = b;
			for (var i = 1; i < uniqueLoot[b].length; i++) {
				avalible[b].sort((v1, v2) => {
					let dst = (v1, v2) => (v1.x-v2.x)*(v1.x-v2.x) + (v1.y-v2.y)*(v1.y-v2.y);
					let dst1 = Infinity, dst2 = Infinity;
					for (let c of chests[biome]) {
						if(c == undefined) break;
						dst1 = Math.min(dst1, dst(v1,c));
					}
					for (let c of chests[biome]) {
						if(c == undefined) break;
						dst2 = Math.min(dst2, dst(v2,c));
					}
					return dst2-dst1;
				});
				if(avalible[b].length == 0) {
					console.warn("Not enoth places for chests");
					continue;
				}
				chests[b][i] = avalible[b].splice(0,1)[0];
			}
		}

		for (var b = 0; b < walls.length; b++) {
			let lootId = 0;
			for (let c of chests[b]) {
				if(uniqueLootFrames[b][lootId] >= 0) f.world.sprite(Blocks.Chests, c.x, c.y, uniqueLootFrames[b][lootId],0);
				else f.world.sprite(Blocks.Chests2, c.x, c.y, -uniqueLootFrames[b][lootId],0);
				let itemId = 0;
				let chest = new Chest("", c.x, c.y).item(itemId++, new ItemStack(uniqueLoot[b][lootId++], 1));

				let weapon = weapons[f.random.nextInt(0, weapons.length)];
				chest.item(itemId++, new ItemStack(weapon, weapon == Items.Dynamite ? 2 : f.random.nextInt(50, 100)));

				let proop = proops[f.random.nextInt(0, proops.length)];
				chest.item(itemId++, new ItemStack(proop, f.random.nextInt(15, 25)));

				for (var p = 0; p < 3; p++) {
					let potion = potions[f.random.nextInt(0, potions.length)];
					chest.item(itemId++, new ItemStack(potion, f.random.nextInt(1, 3)));
				}
			
				f.world.chests.push(chest);
			}
		}
		
		
		// traps and props
		for (var b = 0; b < avalible.length; b++) {
			for (let p of avalible[b]) {
				let type = f.random.nextInt(14);
				if(type < 9 && f.world.hasArea(p.x, p.y, 2, 2)) {
					f.world.sprite(Blocks.Pots, p.x, p.y, f.random.nextInt(3)*36, 360 + f.random.nextInt(3)*36);
					// 360 396 432
				}
				if(type == 9 && f.world.hasArea(p.x, p.y+1, 2, 1)) f.world.sprite(Blocks.WorkBenches, p.x, p.y+1, 396 + dungeonColor*36, 0);
				if(type == 10 && f.world.hasArea(p.x, p.y-2, 3, 4) && f.world.isBlock(brick, p.x+2, p.y+2)) {
					f.world.sprite(Blocks.Bookcases, p.x, p.y-2, 54 + dungeonColor*54, 0);
				}
				if(type == 11 && f.world.hasArea(p.x, p.y-1, 3, 3) && f.world.isBlock(brick, p.x+2, p.y+2)) {
					f.world.sprite(f.random.nextBoolean() ? Blocks.AlchemyTable : Blocks.BewitchingTable, p.x, p.y-1, 0, 0);
				}
				if(type == 12 && f.world.hasArea(p.x, p.y-1, 2, 3)) {
					if(f.random.nextInt(54) < 50) {
						f.world.sprite(Blocks.Statue, p.x, p.y-1, f.random.nextInt(42)*36, 0);
					} else {
						f.world.sprite(Blocks.Statue, p.x, p.y-1, f.random.nextInt(50, 54)*36, 0);
					}
				}
				if(type == 13 && f.world.isAir(p.x, p.y+1)) {
					let isOk = true;
					let k = f.random.nextBoolean() ? -1 : 1;
					let dx = 0;
					for (dx = 0; dx <= 100; dx++) {
						if(f.world.redWire(p.x+dx*k, p.y-1)) {
							dx = 0;
							isOk = false;
							break;
						}
						if(!f.world.isBlock(brick, p.x+dx*k, p.y-1) 
								&& !f.world.isBlock(Blocks.Traps, p.x+dx*k, p.y-1)
								&& !f.world.isBlock(Blocks.Spike, p.x+dx*k, p.y-1)) continue;
						break;
					}
					if(!isOk || dx <= 2) continue;
					
					f.world.sprite(Blocks.Traps, p.x+dx*k, p.y-1, k == -1 ? 18 : 0, 0);
					f.world.sprite(Blocks.PressurePlates, p.x, p.y+1, 0, 36);
					f.world.redWire(true, p.x, p.y);
					f.world.redWire(true, p.x, p.y+1);
					
					for (var xx = 0; xx <= dx; xx++) {
						f.world.redWire(true, p.x+xx*k, p.y-1);
					}
				}
			}
		}
		
		// wall decorations
		for (var y = top; y < bottom; y+=10) {
			for (var x = left; x < right; x+=f.random.nextInt(10, 25)) {
				if(f.world.isWall(Walls.Air, x, y)) continue;
				let random = f.random.nextInt(10);
				if((random == 1 || random == 2) && f.world.hasArea(x, y, 3, 3)) {
					f.world.sprite(Blocks.WallHandings3x3, x, y, f.random.nextBoolean() ? 864 : 918, 0);
				}
				if((random == 1 || random == 2) && f.world.hasArea(x, y, 3, 3)) {
					f.world.sprite(Blocks.WallHandings3x3, x, y, 810 + f.random.nextInt(5)*54, 0);
				}
			}
		}

		let dx = f.world.dungeon.x;
		let dy = f.world.dungeon.y;
		
		f.world.fillsave(brick, Blocks.Air, dx-75, dy, 150, 10);
		f.world.replace(brick, Blocks.Air, dx-50, dy-100, 100, 100);
		f.world.fill(Blocks.Air, dx-50, dy-75, 100, 75);
		f.world.fill(brick, dx-75, dy-75, 150, 7);
		
		f.world.fillwall(Walls.Air, dx-50, dy-50, 100, 50);

		f.world.fill(brick, dx-6, dy-13, 12, 4);
		f.world.fill(brick, dx-7, dy-7, 1, 4);
		f.world.fill(brick, dx+7, dy-7, 1, 4);
		f.world.fill(brick, dx-11, dy-10, 1, 4);
		f.world.fill(brick, dx+11, dy-10, 1, 4);
		
		f.world.fill(Blocks.StoneAccentSlab, dx-3, dy-12, 6, 1);
		f.world.fill(Blocks.StoneAccentSlab, dx-7, dy-6, 1, 1);
		f.world.fill(Blocks.StoneAccentSlab, dx+7, dy-6, 1, 1);
		f.world.fill(Blocks.StoneAccentSlab, dx-11, dy-9, 1, 1);
		f.world.fill(Blocks.StoneAccentSlab, dx+11, dy-9, 1, 1);

		f.world.fillwall(wallBase, dx-5, dy-11, 10, 11);
		f.world.fillwall(wallBase, dx-7, dy-5, 1, 5);
		f.world.fillwall(wallBase, dx+7, dy-5, 1, 5);
		f.world.fillwall(wallBase, dx-11, dy-8, 1, 5);
		f.world.fillwall(wallBase, dx+11, dy-8, 1, 5);
		f.world.fillwall(wallBase, dx-45, dy-74, 5, 75);
		f.world.fillwall(wallBase, dx+40, dy-74, 5, 75);
		
		f.world.fillwall(wallBase, dx-65, dy-74, 5, 75);
		f.world.fillwall(wallBase, dx+60, dy-74, 5, 75);
		
		for (var y = dy; y >= dy - 75; y-=10) {
			if(y == dy-10) continue;
			for (var x = dx-75; x < dx+75; x++) {
				if(f.world.isAir(x, y)) {
					f.world.sprite(Blocks.Platforms, x, y, 0, 216);
					f.world.wall(wallBase, x, y);
				}
			}
		}

		// biome style

		for (var y = top-300; y < bottom; y++) {
			for (var x = left; x < right; x++) {
				let dx = x-left;
				let dy = y-top;
				let block = f.world.block(x, y);
				let wall = f.world.wall(x, y);

				let isOld = wall == wallOld;
				let isBase = wall == wallBase;
				let isHell = wall == wallHell;
				let isSurface = false;
				
				if(y < f.world.dungeon.y) {
					isOld = true;
					isBase = false;
					isHell = false;
					isSurface = true;
				}
				
				let isBrick = block == brick.id;
				
				if(block == Blocks.WallHandings3x3.id) {
					if(f.world.isFrame(x, y, 936,0) || f.world.isFrame(x, y, 864,0) || f.world.isFrame(x, y, 900,0)) {
						var maxLen = f.random.nextInt(5, 25);
						for (var i = 0; i < maxLen; i++) {
							if(!f.world.isAir(x, y-1-i)) break;
							if(y-1-i < 0) continue;
							f.world.block(Blocks.Chain, x, y-1-i);
						}
					}
				}

				if(isHell && isBrick && (f.world.isAir(x-1, y) || f.world.isAir(x+1, y)) && f.random.nextInt(1) == 0 
						&& !f.world.isBlock(Blocks.PalladiumColumn, x-1, y)
						&& !f.world.isBlock(Blocks.PalladiumColumn, x+1, y)) {
					f.world.block(Blocks.PalladiumColumn, x, y);
					f.world.paint(Paints.Gray, x, y);
				}

				if(isHell && block == Blocks.Spike.id && !f.world.hasAirNear4(x, y) && !f.world.hasSprite4(x, y)) {
					f.world.block(Blocks.Air, x, y);
					f.world.liquid(LiquidType.Lava, 255, x, y);
				}

				if(isBrick && f.world.hasAirNear4(x, y) && (isOld ? f.random.nextFloat() < .35 : f.random.nextInt(2) == 0)) {
					if(isOld) f.world.block(Blocks.Grass, x, y);
					if(isBase) f.world.block(Blocks.BoneBlock, x, y);

					if(f.world.isAir(x, y+1) && (isOld ? f.random.nextInt(1) == 0 : f.random.nextInt(5) == 0) && (isOld || dx%2==0)) {
						let vines = f.random.nextInt(isBase || isHell ? 10:3, isBase || isHell ? 25:15);
						let type = f.random.nextInt(2) == 0 ? Blocks.FlowerVines : Blocks.Vines;
						if(isHell) type = Blocks.Chain;
						if(isBase) type = Blocks.Rope;
						let endy = 0;
						for (var i = 1; i < vines; i++) {
							if(!f.world.isAir(x, y+1+i)) break;
							if(dy+i >= f.world.height) break;
							f.world.block(type, x, y+i);
							endy = i;
						}
						if(endy != 0 && isHell) f.world.block(Blocks.LivingFireBlock, x, y+endy);
						if(endy > 2 && isBase) {
							f.world.block(Blocks.Lanterns, x, y+endy);
							f.world.block(Blocks.Lanterns, x, y+endy-1);
							f.world.frame(0,918, x, y+endy);
							f.world.frame(0,900, x, y+endy-1);
						}
					}
					if(isOld && dy > 1) {
						if(f.world.isAir(x, y-1) && f.random.nextInt(2) == 0) {
							f.world.block(Blocks.ForestShortPlants, x, y-1);
							f.world.frame(f.random.nextInt(0, 44) * 18,null, x, y-1);
						}
					}
				} else if(f.world.hasAirNear4(x, y) && f.random.nextInt(5) == 0) {
					if(Blocks.BlueBrick.id == block) {
						f.world.block(Blocks.CrackedBlueBrick, x, y);
						isBrick = false;
					}
					if(Blocks.GreenBrick.id == block) {
						f.world.block(Blocks.CrackedGreenBrick, x, y);
						isBrick = false;
					}
					if(Blocks.PinkBrick.id == block) {
						f.world.block(Blocks.CrackedPinkBrick, x, y);
						isBrick = false;
					}
				} else if(isBrick && isSurface) {
					let h = (f.world.dungeon.y - y)/33;
					h = 1 - h;
					let needAir = false;
					let needDirt = false;
					if(f.world.isAir(x, y-1)) needAir = f.random.nextFloat(1) > h;
					if(f.world.hasBlockNear4(Blocks.DirtBlock.id, x, y-1)) {
						needDirt = f.random.nextDouble() > h;
						needAir = false;
					}
					if(needAir) f.world.block(Blocks.Air, x, y);
					else if(needDirt) f.world.block(Blocks.DirtBlock, x, y);
				}
				
				if(isSurface) {
					if(wallBase == wall || f.world.hasWallNear4(Walls.LivingLeafWall.id, x, y-1) || f.world.hasWallNear4(wallBase, x, y-1)) {
						let h = (f.world.dungeon.y - y)/33;
						if(h > 1) h = 1;
						h = h*h;
						let needAir = f.random.nextFloat(1)/2 > h && f.random.nextFloat(1) < .5;
						let needDirt = false;
						let needLeadFence = f.random.nextFloat() < .1;
						if(f.world.hasBlockNear4(Blocks.DirtBlock.id, x, y-1)
								|| f.world.hasBlockNear4(Blocks.DirtBlock.id, x, y) 
								|| f.world.hasBlockNear4(Blocks.Grass.id, x, y)
								|| f.world.isWall(Walls.LivingLeafWall.id, x, y-1)) {
							needDirt = f.random.nextFloat() > h;
							if(needDirt) needAir = false;
						}
						if(needAir) f.world.wall(Walls.Air, x, y);
						else if(needDirt) f.world.wall(Walls.LivingLeafWall, x, y);
						else if(needLeadFence) f.world.wall(Walls.LeadFence, x, y);
					}
				}
				
				if(isOld && f.random.nextInt(2) == 0) f.world.wallpaint(f.random.nextInt(3) == 0 ? 28 : (f.random.nextBoolean()?17:18), x, y);
				if(isHell && block == Blocks.Traps.id) f.world.frame(null, 90, x, y);
			}
		}
	}
}