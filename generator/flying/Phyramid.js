class Phyramid {


	static create(f, h, realX, realY) {
		realX = Mathf.floor(realX);
		realY = Mathf.floor(realY);
		let roomx = 7;
		let w = h*2;
		
		let phyramid = new Array(w);
		for (var x = 0; x < w; x++) phyramid[x] = new Array(h);
		
		let seed = f.random.nextInt();

		for (var iy = 0; iy < h/roomx; iy++) {
			for (var ix = iy; ix < w/roomx-iy; ix++) {
				Progress.n(1);
				let x = ix*roomx;
				let y = iy*roomx;
				let maxY = Mathf.floor(h-Math.abs(x-(w/2)));

				if(phyramid[x][y] == undefined) phyramid[x][y] = World.emptyTile();
				let needRoom = false;
				let flipY = false;

				if(iy%2==0 && x%(roomx)==0) {
					needRoom = true;
					flipY = x%(roomx*2)!=0;
				}

				if(y%(roomx*2)==roomx && (x+roomx)%(roomx)==0) {
					needRoom = true;
					flipY = x%(roomx*2)==0;
				}
				
				if(flipY && ix+1 >= w/roomx-iy) {
					needRoom = false;
				}

				if(needRoom) {
					let sum = 0;

					for (var rx = 0; rx < roomx*2+1; rx++) {
						for (var ry = 0; ry < roomx-Math.abs(rx-(roomx+1)); ry++) {
							let xx = x+rx-2;
							let yy = y+ry;
							if (flipY) {
								yy = y+roomx-ry-1;
							}
							sum += Simplex.noise2d(seed, 5, .1, 1/20, xx, yy)-.5;
						}
					}
					
					if(ix-1 <= iy || ix+3 >= w/roomx-iy || iy == 0) {
						sum = 1;
					}
					
					for (var rx = 0; rx < roomx*2+1; rx++) {
						for (var ry = 0; ry < roomx-Math.abs(rx-(roomx+1)); ry++) {
							let xx = x+rx-2;
							let yy = y+ry;
							if (flipY) yy = y+roomx-ry-1;
							if(yy >= h) continue;
							if(xx >= w) continue;
							if(phyramid[xx][yy] == undefined) phyramid[xx][yy] = World.emptyTile();
							
							if(sum < .5) {
								World.tileSetAir(phyramid[xx][yy]);
								World.tileSetWall(phyramid[xx][yy], Walls.SandstoneBrickWall);
							} else {
								World.tileSetBlock(phyramid[xx][yy], Blocks.SandstoneBrick);
							}
						}
					}
				}
			}
		}
		
		let count = 3;
		for (var y = 0; y < h-roomx; y++) {
			for (var x = 0; x < w; x++) {
				if(phyramid[x][y] == undefined) continue;
				if(phyramid[x][y].type != -1) {
					if(phyramid[x][y+count] == undefined) continue;
					if(phyramid[x][y+count].type != -1) {
						for (var dy = 0; dy < count; dy++) {
							World.tileSetBlock(phyramid[x][y+dy], Blocks.SandstoneBrick);
						}
					}
				}
			}
		}

		for (var x = 0; x < w-roomx; x++) {
			for (var y = 0; y < h; y++) {
				if(phyramid[x][y] == undefined) continue;
				if(phyramid[x][y].type != -1) {
					if(phyramid[x+count][y] == undefined) continue;
					if(phyramid[x+count][y].type != -1) {
						for (var dx = 0; dx < count; dx++) {
							World.tileSetBlock(phyramid[x+dx][y], Blocks.SandstoneBrick);
						}
					}
				}
			}
		}

		count = w/2;
		for (var x = 1; x < w-roomx; x++) for (var y = h-2; y >= 0; y--) {
			if(phyramid[x][y] == undefined) continue;
			if(phyramid[x][y].type == -1) continue;
			if(f.random.nextFloat() < .75) continue;
			let correct = 0;
			for (var dx = 1; dx < count; dx++) {
				if(phyramid[x+dx][y] == undefined || phyramid[x+dx][y+1] == undefined) {
					correct = -1;
					break;
				}
				if(World.tileIsEmpty(phyramid[x+dx][y+1])) {
					correct = -1;
					break;
				}
				if(phyramid[x+dx][y].type != -1) break;
				
				correct = dx;
			}
			if(correct > 1 && correct < count) {
				for (var dx = 1; dx <= correct; dx++) {
					phyramid[x+dx][y].liquidType = LiquidType.Water;
					phyramid[x+dx][y].liquidAmount = 255;
				}
			}
		}

		let avalible = [];
		for (var x = 0; x < w-1; x++) for (var y = 0; y < h-2; y++) {
			if(phyramid[x][y] 		== undefined || phyramid[x][y].type 	!= -1) continue;
			if(phyramid[x][y+1] 	== undefined || phyramid[x][y+1].type 	!= -1) continue;
			if(phyramid[x+1][y] 	== undefined || phyramid[x+1][y].type 	!= -1) continue;
			if(phyramid[x+1][y+1] 	== undefined || phyramid[x+1][y+1].type != -1) continue;
			if(phyramid[x][y+2] 	== undefined || phyramid[x][y+2].type 	== -1) continue;
			if(phyramid[x+1][y+2] 	== undefined || phyramid[x+1][y+2].type == -1) continue;
			avalible.push({x:x,y:y});
		}

		
		let chests = new Array(Math.min(4, avalible.length));
		
		chests[0] = avalible.splice(f.random.nextInt(0, avalible.length), 1)[0];
		
		for (var i = 1; i < chests.length; i++) {
			avalible.sort((v1, v2) => {
				let dst2func = (p1,p2) => (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y);
				let dst1 = Infinity, dst2 = Infinity;
				for (let c of chests) {
					if(c == null) break;
					dst1 = Math.min(dst1, dst2func(v1, c));
				}
				dst1 -= dst2func(v1, {x:w/2,y:h/2});
				for (let c of chests) {
					if(c == null) break;
					dst2 = Math.min(dst2, dst2func(v2, c));
				}
				dst2 -= dst2func(v2, {x:w/2,y:h/2});
				return dst2-dst1;
			});
			chests[i] = avalible.splice(0, 1)[0];
		}

		let drops = [Loot.item(Items.FlyingCarpet), Loot.item(Items.SandstormInABottle), Loot.item(Items.PharaohsMask), Loot.item(Items.PharaohsRobe)];
		let potions = [Items.LesserHealingPotion, Items.IronskinPotion, Items.MiningPotion, Items.NightOwlPotion, Items.ShinePotion, Items.SwiftnessPotion, Items.ThornsPotion, Items.WaterWalkingPotion];
		let proops = [
				Items.IronBar, Items.LeadBar,
				Items.SilverBar, Items.TungstenBar,
				Items.GoldBar, Items.PlatinumBar, 
				Items.Glowstick, Items.DesertTorch
		];
		let weapons = Loot.group(
			Loot.item(Items.Dynamite), 
			Loot.item(Items.BoneThrowingKnife, 25, 75),
			Loot.item(Items.BoneThrowingKnife, 25, 75), 
		);
		
		let dropId = 0;
		for (let c of chests) {
			World.tileSetBlock(phyramid[c.x][c.y], Blocks.Chests);
			World.tileSetBlock(phyramid[c.x+1][c.y], Blocks.Chests);
			World.tileSetBlock(phyramid[c.x][c.y+1], Blocks.Chests);
			World.tileSetBlock(phyramid[c.x+1][c.y+1], Blocks.Chests);
			World.tileSetFrame(phyramid[c.x][c.y], 		36, 0);
			World.tileSetFrame(phyramid[c.x+1][c.y], 	54, 0);
			World.tileSetFrame(phyramid[c.x][c.y+1], 	36, 18);
			World.tileSetFrame(phyramid[c.x+1][c.y+1], 	54, 18);

			let itemId = 0;
			let chest = new Chest("", c.x+realX, c.y+realY)
				.item(itemId++, drops[dropId++].take(f.random))
				.item(itemId++, weapons.take(f.random));

			chest.item(itemId++, new ItemStack(proops[f.random.nextInt(0, proops.length)], f.random.nextInt(5, 15)));
			for (var p = 0; p < 2; p++) {
				let potion = potions[f.random.nextInt(0, potions.length)];
				chest.item(itemId++, new ItemStack(potion, f.random.nextInt(1, 2)));
			}
			
			f.world.chests.push(chest);
		}
		
		for (var p of avalible) {
			let x = p.x;
			let y = p.y;
			if(phyramid[x][y] 		== undefined || phyramid[x][y].type != -1) continue;
			if(phyramid[x][y+1] 	== undefined || phyramid[x][y+1].type != -1) continue;
			if(phyramid[x+1][y] 	== undefined || phyramid[x+1][y].type != -1) continue;
			if(phyramid[x+1][y+1] 	== undefined || phyramid[x+1][y+1].type != -1) continue;
			if(phyramid[x][y+2] 	== undefined || phyramid[x][y+2].type == -1) continue;
			if(phyramid[x+1][y+2] 	== undefined || phyramid[x+1][y+2].type == -1) continue;
			
			let type = f.random.nextInt(5);
			let block = null;
			let u = 0, v = 0;
			if(type == 0) block = Blocks.RollingCactus;
			if(type == 1 || type == 2 || type == 3) {
				block = Blocks.Pots;
				u = 36*f.random.nextInt(0, 3);
				v = 900+36*f.random.nextInt(0, 3);
			}
			if(type == 4) {
				let isOk = true;
				let k = f.random.nextBoolean() ? -1 : 1;
				let dx = 0;
				for (dx = 0; dx <= 100; dx++) {
					if(phyramid[x+dx*k][y-1] == null || (dx != 0 && phyramid[x+dx*k][y-1].wireRed)) {
						dx = 0;
						isOk = false;
						break;
					}
					if(phyramid[x+dx*k][y-1].type != Blocks.SandstoneBrick.id && phyramid[x+dx*k][y-1].type != Blocks.Traps.id) continue;
					break;
				}
				if(!isOk || dx <= 2) continue;

				World.tileSetBlock(phyramid[x+dx*k][y-1], Blocks.Traps);
				World.tileSetFrame(phyramid[x+dx*k][y-1], k == -1 ? 18 : 0, 0);
				// World.tileSetColor(phyramid[x+dx*k][y-1], Paints.Brown);
				World.tileSetBlock(phyramid[x][y+1], Blocks.PressurePlates);
				World.tileSetFrame(phyramid[x][y+1], 0, 36);

				phyramid[x][y].wireRed = true;
				phyramid[x][y+1].wireRed = true;
				
				for (var xx = 0; xx <= dx; xx++) {
					if(phyramid[x+xx*k][y-1] == undefined) continue;
					phyramid[x+xx*k][y-1].wireRed = true;
				}
			}
			if(block != null) {
				World.tileSetBlock(phyramid[x][y], block);
				World.tileSetBlock(phyramid[x+1][y], block);
				World.tileSetBlock(phyramid[x][y+1], block);
				World.tileSetBlock(phyramid[x+1][y+1], block);
				World.tileSetFrame(phyramid[x][y], u, v);
				World.tileSetFrame(phyramid[x+1][y], u+18, v);
				World.tileSetFrame(phyramid[x][y+1], u, v+18);
				World.tileSetFrame(phyramid[x+1][y+1], u+18, v+18);
			}
		}
		return phyramid;
	}
}