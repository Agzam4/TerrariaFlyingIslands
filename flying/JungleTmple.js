class JungleTmple {

	static create(f, sx, sy) {
		let floorh = 11;
		let floorw = 11;
		let floors = 24; // 18

		let rooms = new Array(floors);
		let needRoom = new Array(floors);
		
		for (var floor = 0; floor < floors; floor++) {
			let roomsCount = 1 + floor*2;
			rooms[floor] = new Array(roomsCount);
			for (var room = 0; room < roomsCount; room++) {
				rooms[floor][room] = {x:(room-Mathf.floor(roomsCount/2))*floorw, y:floor*floorh - Mathf.floor(floorw/2)};
			}
			needRoom[floor] = new Array(roomsCount);
			if(floor%3 != 0 && roomsCount/2 > 2) {
			} else {
				for (var room = 2; room < roomsCount-2; room++) {
					needRoom[floor][room] = true;
				}
			}
		}
		
		for (var y = floors-4; y < floors-1; y++) {
			let cx = Mathf.floor(needRoom[y].length/2);
			for (var x = -2; x <= 2; x++) {
				needRoom[y][cx+x] = true;
			}
		}

		needRoom[2][2] = true;
		
		for (var floor = 0; floor < rooms.length; floor++) {
			for (var room = 0; room < rooms[floor].length; room++) {
				let x = rooms[floor][room].x;
				let y = rooms[floor][room].y;
				for (var dy = 0; dy < floorh; dy++) {
					for (var dx = 0; dx < floorw; dx++) {
						f.world.block(Blocks.LihzahrdBrick, x+dx+sx, y+dy+sy);
						if(room != 0 && room != rooms[floor].length-1
								&& (room != 1 || dx != 0 || dy != 0)
								&& (room != rooms[floor].length-1 || dx != floorw-1 || dy != 0) && !(dy == floorh-1 && floor == floors-1)) {
							f.world.wall(Walls.ForbiddenLihzahrdBrickWall, x+dx+sx, y+dy+sy);
						}
						f.world.paint(Paints.None, x+dx+sx, y+dy+sy);
						f.world.wallpaint(Paints.None, x+dx+sx, y+dy+sy);
					}
				}
			}
		}
		
		for (var floor = 0; floor < rooms.length; floor++) {
			for (var room = 0; room < rooms[floor].length; room++) {
				let x = rooms[floor][room].x;
				let y = rooms[floor][room].y;
				if(needRoom[floor][room]) {
					for (var dy = 0; dy < floorh; dy++) {
						for (var dx = 0; dx < floorw; dx++) {
							f.world.block(Blocks.Air, x+dx+sx, y+dy+sy);
						}
					}
				}
			}
		}

		for (var floor = 3; floor < rooms.length-3; floor+=3) {
			let from = f.random.nextInt(1, floor-1)*floorw;
			for (var fl = 0; fl < 2; fl++) {
				let mx = f.random.nextInt(-1, 1);
				let ey = sy+floor*floorh+floorh-Mathf.floor(floorh/2) + fl*floorh;
				// columns

				if(fl == 0) {
					JungleTmple.columnAt(f, sx + from - 2, ey - 1, floorh);
					JungleTmple.columnAt(f, sx + from + floorw, ey - 1, floorh);

					JungleTmple.columnAt(f, sx - from - 2, ey - 1, floorh);
					JungleTmple.columnAt(f, sx - from + floorw, ey - 1, floorh);
				}
				// tunnels
				for (var y = 0; y < floorh; y++) {
					for (var dx = 0; dx < floorw; dx++) {
						let xx = sx + dx;
						if(y == 0 || (y == floorh-1 && fl == 1)) {
							if(dx == 0) {
								f.world.sprite(Blocks.Platforms, xx + from + mx*y, ey+y, 54,594);
								f.world.sprite(Blocks.Platforms, xx - from - mx*y, ey+y, 54,594);
							} else if(dx == floorh-1) {
								f.world.sprite(Blocks.Platforms, xx + from + mx*y, ey+y, 72,594);
								f.world.sprite(Blocks.Platforms, xx - from - mx*y, ey+y, 72,594);
							} else {
								f.world.sprite(Blocks.Platforms, xx + from + mx*y, ey+y, f.random.nextBoolean() ? 0 : 36, 594);
								f.world.sprite(Blocks.Platforms, xx - from - mx*y, ey+y, f.random.nextBoolean() ? 0 : 36, 594);
							}
						} else {
							f.world.block(Blocks.Air, xx + from + mx*y, ey+y);
							f.world.block(Blocks.Air, xx - from - mx*y, ey+y);
						}
					}
				}
				if(fl == 1) {
					JungleTmple.columnAt(f, sx + from + mx*(floorh-1)-2, ey - 1 + floorh*2, floorh);
					JungleTmple.columnAt(f, sx - from - mx*(floorh-1)-2, ey - 1 + floorh*2, floorh);
					JungleTmple.columnAt(f, sx + from + mx*(floorh-1) + floorw, ey - 1 + floorh*2, floorh);
					JungleTmple.columnAt(f, sx - from - mx*(floorh-1) + floorw, ey - 1 + floorh*2, floorh);
				}
				from += floorh*mx;
			}
		}

		for (var floor = 3; floor < rooms.length-3; floor+=3) {
			let roomsw = floor*floorw;
			for (var x = floorw*3; x < roomsw+floorw; x++) {
				let xx = sx - roomsw + x;
				let yy = sy + floor*floorh;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, xx, yy-floorh)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, xx-1, yy-floorh)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, xx-2, yy-floorh)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, xx, yy-floorh*2)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, xx-1, yy-floorh*2)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, xx-2, yy-floorh*2)) continue;
				
				let checkx;
				for (checkx = 0; checkx < Math.min(roomsw, x+25); checkx++) {
					if(!f.world.isBlock(Blocks.LihzahrdBrick, xx-2+checkx, yy-floorh)) break;
					if(!f.world.isBlock(Blocks.LihzahrdBrick, xx-2+checkx, yy-floorh*2)) break;
					if(!f.world.isAir(xx-2+checkx, yy)) break;
				}
				checkx--;
				if(checkx < 11) continue;
				
				let roomsize = f.random.nextInt(10, checkx);
				let roomh = Mathf.floor(Math.min(f.random.nextInt(floorh, floorh*2-5), roomsize)/2);
				roomh *= 2;
				roomh++;
				
				for (var dx = 0; dx < roomsize; dx++) {
					for (var dy = -floorh; dy < roomh; dy++) {
						// let xxx = xx+dx;
						// let flipCenter = sx+Mathf.floor(floorw/2);
						// if(xxx > flipCenter) continue;
						// let yyy = yy-dy-Mathf.floor(floorh/2)-1;
						// let byyy = yy-dy+Mathf.floor(floorh/2);
						// if(f.world.isAir(xxx, yyy)) continue;// if(!f.world.isBlock(Blocks.LihzahrdBrick, xxx, yyy)) continue;
						
						// let dst = Math.max(5, roomh/5);
						// let useWall = dy < Math.max(floorh*2-5, roomh*2/3) && dx > dst && roomh-1-dx > dst;

						// if(!f.world.isBlock(Blocks.Cobweb, xxx, yyy)) f.world.block(Blocks.Air, xxx, yyy);
						// if(useWall) f.world.block(Blocks.Cobweb, xxx, byyy);
						
						// let fxxx = flipCenter + Math.abs(flipCenter-xxx)-(x%2==0?1:0);

						// if(!f.world.isBlock(Blocks.Cobweb, fxxx, yyy)) f.world.block(Blocks.Air, fxxx, yyy);
						// if(useWall) f.world.block(Blocks.Cobweb, fxxx, byyy);
						let xxx = xx+dx;
						let flipCenter = sx+Mathf.floor(floorw/2);
						if(xxx > flipCenter) continue;
						let yyy = yy-dy-Mathf.floor(floorh/2)-1;
						let byyy = yy-dy+Mathf.floor(floorh/2);
						// if(!f.world.isBlock(Blocks.LihzahrdBrick, xxx, yyy)) continue;
						
						let block = Blocks.LihzahrdBrick;
						let xht = Math.abs(dx - roomsize/2)/roomsize;
						let yt = (dy+floorh*2)/(floorh+roomh);
						if(yt > 1-xht && (dy+floorh)/(floorh+roomh) < 1-xht) block = Blocks.Air;

						let dst = Math.max(5, roomh/5);

						f.world.block(block, xxx, yyy);
						
						let fxxx = flipCenter + Math.abs(flipCenter-xxx)-(x%2==0?1:0);

						f.world.block(block, fxxx, yyy);
					}
				}
				x += roomsize+5;
			}
		}
		
		for (var floor = 3; floor < floors; floor+=3) {
			let y = sy + floor*floorh+4;
			let x1 = sx - floor*floorw + floorw*2+1;
			let x2 = sx + floor*floorw - floorw-3;
			//				f.world.sprite(Blocks.Chests, left.x, left.y, 576,0);
			f.world.sprite(Blocks.Chests, x1, y, 576,0);
			f.world.sprite(Blocks.Chests, x2, y, 576,0);

			f.world.chests.push(JungleTmple.chest(f.random, x1, y));
			f.world.chests.push(JungleTmple.chest(f.random, x2, y));
		}

		// traps
		
		let avalible = [];

		let simplexSeed = f.random.nextInt();
		for (var y = sy-Mathf.floor(floorh/2); y < sy+floorh*floors-Mathf.floor(floorh/2); y++) {
			for (var x = sx-floorw*floors+floorw; x < sx+floorw*floors; x++) {
				if(!f.world.isWall(Walls.ForbiddenLihzahrdBrickWall, x, y)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, x, y)) {
					if(f.world.isBlock(Blocks.Platforms, x, y) && f.world.isAir(x, y-1)) {
						avalible.push({x:x,y:y-1});
					}
					continue;
				}
				if(!f.world.hasAirNear4(x, y)) continue;
				
				if(Simplex.noise2d(simplexSeed, 1, .1, 1/30, x, y) < .33) {
					f.world.block(Blocks.WoodenSpike, x, y);
					if(y%2==0) {
						if(f.world.isAir(x+1, y)) f.world.block(Blocks.WoodenSpike, x+1, y);
						if(f.world.isAir(x-1, y)) f.world.block(Blocks.WoodenSpike, x-1, y);
					}
					if(x%2==0) {
						if(f.world.isAir(x, y+1)) f.world.block(Blocks.WoodenSpike, x, y+1);
						if(f.world.isAir(x, y-1)) f.world.block(Blocks.WoodenSpike, x, y-1);
					}
				} else {
					if(f.world.isAir(x, y-1)) {
						avalible.push({x:x, y:y-1});
					}
				}
			}
		}

		let yDst = 70;
		let xDst = 30;
		
		for (var p of avalible) {
			if(f.random.nextInt(5) != 0) continue;
			let left;
			for (left = 0; left <= xDst; left++) {
				if(f.world.redWire(p.x-left, p.y-2) || f.world.redWire(p.x-left, p.y-3)) {
					left = 0;
					break;
				}
				if(!f.world.isAir(p.x-left, p.y-2)) {
					if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x-left, p.y-2)) {
						left = 0;
					}
					break;
				}
				if(left == xDst) {
					left = 0;
					break;
				}
			}
			let right;
			for (right = 0; right <= xDst; right++) {
				if(f.world.redWire(p.x+right, p.y-2) || f.world.redWire(p.x+right, p.y-3)) {
					right = 0;
					break;
				}
				if(!f.world.isAir(p.x+right, p.y-2)) {
					if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x+right, p.y-2)) {
						right = 0;
					}
					break;
				}
				if(right == xDst) {
					right = 0;
					break;
				}
			}
			let dx = 0;
			if(left > 3 && right > 3) {
				dx = f.random.nextBoolean() ? -left : right;
			} else if(left > 3) {
				dx = -left;
			} else if(right > 3) {
				dx = right;
			}
			
			if(dx != 0) {
				f.world.sprite(Blocks.PressurePlates, p.x, p.y, 0, 108);
				f.world.redWire(true, p.x, p.y-1);
				f.world.redWire(true, p.x, p.y);
				
				f.world.sprite(Blocks.Traps, p.x+dx, p.y-2, dx > 0 ? 0:18, (Math.abs(dx) < 15 && f.random.nextBoolean()) ? 36 : 18);
				
				let k = dx>0?1:-1;
				dx = Math.abs(dx);
				for (var x = 0; x <= Math.abs(dx); x++) {
					f.world.redWire(true, p.x+x*k, p.y-2);
				}
				continue;
			}
			

			let up;
			for (up = 0; up <= yDst; up++) {
				if(f.world.redWire(p.x, p.y-up)) {
					up = 0;
					break;
				}
				if(!f.world.isAir(p.x, p.y-up)) {
					if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x, p.y-up)) {
						up = 0;
					}
					break;
				}
				if(up == yDst) {
					up = 0;
					break;
				}
			}
			
			if(up < 3) continue;

			f.world.sprite(Blocks.PressurePlates, p.x, p.y, 0, 108);
			for (var y = 0; y <= up; y++) {
				f.world.redWire(true, p.x, p.y-y);
			}
			
			let size;
			for (size = 2; size <= 7; size++) {
				if(f.world.isBlock(Blocks.LihzahrdBrick, p.x-size, p.y-up) || f.world.isBlock(Blocks.LihzahrdBrick, p.x+size, p.y-up)) {
					break;
				}
			}
			
			if(up < 15 && f.random.nextBoolean()) {
				for (var s = 0; s < size; s++) {
					if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x-s, p.y-up)) continue;
					f.world.redWire(true, p.x-s, p.y-up);
					f.world.redWire(true, p.x+s, p.y-up);
					f.world.sprite(Blocks.Traps, p.x-s, p.y-up, 18,72);
					f.world.sprite(Blocks.Traps, p.x+s, p.y-up, 18,72);
				}
			} else {
				for (var s = 0; s < size; s++) {
					if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x-s, p.y-up)) continue;
					if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x+s, p.y-up)) continue;
					f.world.redWire(true, p.x-s, p.y-up);
					f.world.redWire(true, p.x+s, p.y-up);
					f.world.sprite(Blocks.Traps, p.x-s, p.y-up, 0,54);
					f.world.sprite(Blocks.Traps, p.x+s, p.y-up, 0,54);
				}
			}
		}
		

		for (var p of avalible) {
			if(f.random.nextInt(3) != 0) continue;
			if(!f.world.hasArea(p.x, p.y-1, 2, 2)) continue;
			if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x, p.y+1) && !f.world.isBlock(Blocks.PlacedBottles, p.x, p.y+1)) continue;
			if(!f.world.isBlock(Blocks.LihzahrdBrick, p.x+1, p.y+1) && !f.world.isBlock(Blocks.Platforms, p.x+1, p.y+1)) continue;
			
			let type = f.random.nextInt(13);
			if(type < 9) {
				f.world.sprite(Blocks.Pots, p.x, p.y-1, f.random.nextInt(3)*36,1008+f.random.nextInt(3)*36);
				continue;
			}
			if(type < 10) {
				f.world.sprite(Blocks.WorkBenches, p.x, p.y, 360,0);
				continue;
			}
			if(type < 11 && f.world.hasArea(p.x, p.y-3, 3, 4)) {
				f.world.sprite(Blocks.Bookcases, p.x, p.y-3, 864,0);
				continue;
			}
			if(type < 12 && f.world.hasArea(p.x, p.y-2, 2, 3)) {
				f.world.sprite(Blocks.Statue, p.x, p.y-2, 1548 + f.random.nextInt(3)*36, f.random.nextBoolean()?0:162);
				continue;
			}
			
		}
		
		// boss room

		for (var y = floors-4; y < floors-1; y++) {
			let cx = Mathf.floor(rooms[y].length/2);
			for (var x = -3; x <= 3; x++) {
				let room = rooms[y][cx+x];
				for (var dy = 0; dy < floorh; dy++) {
					for (var dx = x==-3?5:0; dx < floorw - (x==3?5:0); dx++) {
						let xx = sx + room.x + dx;
						let yy = sy + room.y + dy;
						if(dx==0 || dx==floorw-1) {
							if(dy==0 && y == floors-4) {
								f.world.block(Blocks.LihzahrdBrick, xx, yy);
							} else {
								f.world.block(Blocks.PalladiumColumn, xx, yy);
								f.world.active(false, xx, yy);
							}
						} else if(!f.world.isBlock(Blocks.Platforms, xx, yy) || dy != 0) {
							if(dy == 0 && y == floors-4 && !f.world.isBlock(Blocks.Platforms, xx, yy)) {
								f.world.block(Blocks.LihzahrdBrick, xx, yy);
							} else {
								f.world.block(Blocks.Air, xx, yy);
							}
						}
						f.world.redWire(false, xx, yy);
						if(f.world.isBlock(Blocks.WoodenSpike, xx+1, yy)) f.world.block(Blocks.LihzahrdBrick, xx+1, yy);
						if(f.world.isBlock(Blocks.WoodenSpike, xx-1, yy)) f.world.block(Blocks.LihzahrdBrick, xx-1, yy);
						if(f.world.isBlock(Blocks.WoodenSpike, xx, yy-1)) f.world.block(Blocks.LihzahrdBrick, xx, yy-1);
						if(f.world.isBlock(Blocks.WoodenSpike, xx, yy+1)) f.world.block(Blocks.LihzahrdBrick, xx, yy+1);
					}
				}
			}
		}
		let altarX = sx+Mathf.floor(floorw/2);
		let altarY = sy+(floors-1)*floorh - Mathf.floor(floorh/2);

		f.world.sprite(Blocks.LihzahrdAltar, altarX-1, altarY-2, 0, 0);
		f.world.sprite(Blocks.Lamps, altarX-2, altarY-3, 0, 432);
		f.world.sprite(Blocks.Lamps, altarX+2, altarY-3, 0, 432);
		f.world.sprite(Blocks.Clocks, altarX-4, altarY-5, 432, 0);
		f.world.sprite(Blocks.Clocks, altarX+3, altarY-5, 432, 0);
		for (var i = 1; i < 3; i++) {
			f.world.sprite(Blocks.Statue, altarX+i*floorw-3, altarY-3, 1548 + f.random.nextInt(3)*36, 0);
			f.world.sprite(Blocks.Statue, altarX+i*floorw+2, altarY-3, 1548 + f.random.nextInt(3)*36, 0);
			f.world.sprite(Blocks.Statue, altarX-i*floorw-3, altarY-3, 1548 + f.random.nextInt(3)*36, 162);
			f.world.sprite(Blocks.Statue, altarX-i*floorw+2, altarY-3, 1548 + f.random.nextInt(3)*36, 162);

			f.world.sprite(Blocks.Platforms, altarX+i*floorw, altarY-2, 90,594);
			f.world.sprite(Blocks.Candles, altarX+i*floorw, altarY-3, 0,242);
			
			f.world.sprite(Blocks.Platforms, altarX-i*floorw, altarY-2, 90,594);
			f.world.sprite(Blocks.Candles, altarX-i*floorw, altarY-3, 0,242);

			f.world.sprite(Blocks.PressurePlates, altarX+i*floorw, altarY-1, 0,108);
			f.world.sprite(Blocks.PressurePlates, altarX-i*floorw, altarY-1, 0,108);

			f.world.redWire(true, altarX+i*floorw, altarY-1);
			f.world.redWire(true, altarX+i*floorw, altarY-2);
			f.world.redWire(true, altarX+i*floorw, altarY-3);
			f.world.redWire(true, altarX+i*floorw+1, altarY-1);
			f.world.redWire(true, altarX+i*floorw+2, altarY-1);
			f.world.redWire(true, altarX+i*floorw-1, altarY-1);
			f.world.redWire(true, altarX+i*floorw-2, altarY-1);

			f.world.redWire(true, altarX-i*floorw, altarY-1);
			f.world.redWire(true, altarX-i*floorw, altarY-2);
			f.world.redWire(true, altarX-i*floorw, altarY-3);
			f.world.redWire(true, altarX-i*floorw+1, altarY-1);
			f.world.redWire(true, altarX-i*floorw+2, altarY-1);
			f.world.redWire(true, altarX-i*floorw-1, altarY-1);
			f.world.redWire(true, altarX-i*floorw-2, altarY-1);
		}
		f.world.sprite(Blocks.Bookcases, altarX+30, altarY-4, 864,0);
		f.world.sprite(Blocks.Bookcases, altarX-32, altarY-4, 864,0);

		let topX = sx+Mathf.floor(floorw/2);
		let topY = sy + floorh + Mathf.floor(floorh/2);

		for (var dx = -Mathf.floor(floorw/2) - floorw; dx <= Mathf.floor(floorw/2) + floorw; dx++) {
			let dst = Math.abs(dx);
			if(dst <= Mathf.floor(floorw/2)) {
				if(dx == -Mathf.floor(floorw/2)) {
					f.world.sprite(Blocks.Platforms, topX + dx, topY+1, 54,594);
				} else if(dx == Mathf.floor(floorw/2)) {
					f.world.sprite(Blocks.Platforms, topX + dx, topY+1, 72,594);
				} else {
					f.world.sprite(Blocks.Platforms, topX + dx, topY+1, f.random.nextBoolean() ? 0 : 36, 594);
				}
				f.world.block(Blocks.Air, topX + dx, topY);
				for (var dy = 1; dy < 7; dy++) {
					f.world.block(Blocks.Air, topX + dx, topY - dy);
				}
				continue;
			}
			f.world.block(Blocks.LihzahrdBrick, topX + dx, topY+1);
			f.world.block(Blocks.Air, topX + dx, topY);
			for (var dy = 0; dy < 7; dy++) {
				if(dst != Mathf.floor(floorw/2) + floorw) f.world.wall(Walls.ForbiddenLihzahrdBrickWall , topX + dx, topY - dy);
				if(dst > Mathf.floor(floorw/2) + floorw - 3 && dst != Mathf.floor(floorw/2) + floorw) {
					f.world.block(Blocks.PalladiumColumn, topX + dx, topY - dy);
					f.world.active(false, topX + dx, topY - dy);
					f.world.wall(Walls.Air, topX + dx, topY - dy);
				} else {
					if(dst >= 8 && dy > dst-7) {
						f.world.block(Blocks.LihzahrdBrick, topX + dx, topY - dy);
					} else {
						f.world.block(Blocks.Air, topX + dx, topY - dy);
					}
				}
			}
			f.world.wall(Walls.Air, topX + 7, topY);
			f.world.wall(Walls.Air, topX - 7, topY);

			f.world.sprite(Blocks.DoorsClosed, topX - 8, topY-2, 0,594);
			f.world.sprite(Blocks.DoorsClosed, topX + 8, topY-2, 0,594);
			f.world.block(Blocks.LihzahrdBrick, topX + 7, topY - 6);
			f.world.block(Blocks.LihzahrdBrick, topX - 7, topY - 6);
			continue;
		}

		for (var y = sy-Mathf.floor(floorh/2); y < sy+floorh*floors-Mathf.floor(floorh/2); y++) {
			for (var x = sx-floorw*floors+floorw; x < sx+floorw*floors; x++) {
				if(f.random.nextInt(7) != 0) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, x, y-1)) continue;
				if(!f.world.isBlock(Blocks.LihzahrdBrick, x+1, y-1)) continue;
				if(!f.world.isAir(x-1, y)) continue;
				if(!f.world.isAir(x+2, y)) continue;
				if(!f.world.hasArea(x, y, 2, 6)) continue;
				
				if(f.random.nextBoolean()) {
					f.world.sprite(Blocks.HangingPots, x, y, 72,0);
				} else {
					f.world.sprite(Blocks.HangingBrazier, x, y, 0,0);
				}
			}
		}
	}

	static potions = [
			Items.AmmoReservationPotion,
			Items.BuilderPotion,
			Items.InvisibilityPotion,
			Items.ManaRegenerationPotion,
			Items.MagicPowerPotion,
			Items.SpelunkerPotion,
			Items.SummoningPotion
	];
	
	static proops = [
			Items.ChlorophyteArrow,
			Items.StyngerBolt,
			Items.ChlorophyteBullet,
			Items.Beenade,
	];

	static chest(r, x, y) {
		let chestIndex = 0;
		let chest = new Chest("", x, y)
				.item(chestIndex++, new ItemStack(Items.LihzahrdPowerCell, 1))
				.item(chestIndex++, new ItemStack(Items.LihzahrdFurnace, 1));
		if(r.nextInt(5) == 0) {
			chest.item(chestIndex++, new ItemStack(Items.SolarTablet, 1));
		} else {
			chest.item(chestIndex++, new ItemStack(Items.SolarTabletFragment, r.nextInt(3, 8)));
		}
		for (var p = 0; p < 4; p++) {
			let potion = JungleTmple.potions[r.nextInt(0, JungleTmple.potions.length)];
			chest.item(chestIndex++, new ItemStack(potion, r.nextInt(2, 3)));
		}
		chest.item(chestIndex++, new ItemStack(JungleTmple.proops[r.nextInt(0, JungleTmple.proops.length)], r.nextInt(25, 50)));
		return chest;
	}


	static columnAt(f, x, y, h) {
		if(!f.world.isBlock(Blocks.LihzahrdBrick, x, y-h)) return;
		if(!f.world.isBlock(Blocks.LihzahrdBrick, x+1, y-h)) return;
		if(!f.world.isBlock(Blocks.LihzahrdBrick, x, y+1)) return;
		if(!f.world.isBlock(Blocks.LihzahrdBrick, x+1, y+1)) return;
		
		for (var dy = 0; dy < h; dy++) {
			f.world.block(Blocks.PalladiumColumn, x, y-dy);
			f.world.block(Blocks.PalladiumColumn, x+1, y-dy);
			f.world.active(false, x, y-dy);
			f.world.active(false, x+1, y-dy);
		}
	}
}