class Tree {

	static at(world, r, rx, ry, style) {
		style *= 22;
		
		let idUnder = world.block(rx, ry+1);
		// if(idUnder == Blocks.Wood.id) return;

		let rootleft = world.isAir(rx-1, ry) && r.nextBoolean() && world.isBlock(idUnder, rx-1, ry+1);
		let rootright = world.isAir(rx+1, ry) && r.nextBoolean() && world.isBlock(idUnder, rx+1, ry+1);

		if(rootleft && rootright) world.tree(rx, ry, 88,132+style);
		else if(rootright) world.tree(rx, ry, 0,132+style);
		else if(rootleft) world.tree(rx, ry, 66,132+style);
		else world.tree(rx, ry, 0,style);
		
		if(rootleft) world.tree(rx-1, ry, 44,132+style);
		if(rootright) world.tree(rx+1, ry, 22,132+style);
		
		let h = r.nextInt(10, 16);
		
		// console.log(idUnder);
		for (var dy = 1; dy < h; dy++) {
			let y = ry-dy;
			if(!world.hasArea(rx-2, y-4, 5, 4)) {
				if(dy >= 10) {
					world.tree(rx, y+1, 22,198+style);
					break;
				}
				world.tree(rx, y, 0,198+style);
				break;
			}

			if(dy == h-1) {
				world.tree(rx, y, 22,198+style);
				continue;
			}
			
			let left = world.isAir(rx-1, y) && world.isAir(rx-2, y) && world.isAir(rx-3, y) && world.isAir(rx-2, y+1) && 
						   world.isAir(rx-1, y+1) && world.isAir(rx-2, y+1) && world.isAir(rx-3, y+1) && r.nextBoolean() && world.isAir(rx-1, y+1);
			let right = world.isAir(rx+1, y) && world.isAir(rx+2, y) && world.isAir(rx+3, y) && world.isAir(rx+2, y+1) && r.nextBoolean() && world.isAir(rx+1, y+1);
			
			if(left && right) {
				world.tree(rx, y, 44,0+style);
			} else if(right) {
				world.tree(rx, y, 66,66+style);
			} else if(left) {
				world.tree(rx, y, 88,0+style);
			} else {
				let t = r.nextInt(3);
				if(t == 0) world.tree(rx, y, 0,style);
				if(t == 1) world.tree(rx, y, 22,0+style);
				else world.tree(rx, y, 0,66+style);
			}
			let t = r.nextInt(2);
			if(left) {
				if(t == 0) world.tree(rx-1, y, 66,style);
				else world.tree(rx-1, y, 44,198+style);
			}
			if(right) {
				if(t == 0) world.tree(rx+1, y, 88,66+style);
				else world.tree(rx+1, y, 66,198+style);
			}
		}
	}

	static vanityAt(world, r, rx, ry, type, style) {
		style *= 22;
		
		let idUnder = world.block(rx, ry+1);

		let rootleft = world.isAir(rx-1, ry) && r.nextBoolean() && world.isBlock(idUnder, rx-1, ry+1);
		let rootright = world.isAir(rx+1, ry) && r.nextBoolean() && world.isBlock(idUnder, rx+1, ry+1);

		if(rootleft && rootright) {
			world.tree(type, rx, ry, 88,132+style);
		} else if(rootright) {
			world.tree(type, rx, ry, 0,132+style);
		} else if(rootleft) {
			world.tree(type, rx, ry, 66,132+style);
		} else {
			world.tree(type, rx, ry, 0,style);
		}
		
		if(rootleft) world.tree(type, rx-1, ry, 44,132+style);
		if(rootright) world.tree(type, rx+1, ry, 22,132+style);
		
		let h = r.nextInt(10, 16);
		
		for (var dy = 1; dy < h; dy++) {
			let y = ry-dy;
			if(!world.hasArea(rx-2, y-4, 5, 4)) {
				if(dy >= 10) {
					world.replace(Blocks.Wood, Blocks.Air, rx-2, y+1, 5, 1);
					world.tree(type, rx, y+1, 22,198+style);
					break;
				}
				world.tree(type, rx, y, 0,198+style);
				break;
			}

			if(dy == h-1) {
				world.tree(type, rx, y, 22,198+style);
				continue;
			}
			
			let left = world.isAir(rx-1, y) && world.isAir(rx-2, y) && world.isAir(rx-3, y) && world.isAir(rx-2, y+1) && 
						   world.isAir(rx-1, y+1) && world.isAir(rx-2, y+1) && world.isAir(rx-3, y+1) && r.nextBoolean() && world.isAir(rx-1, y+1);
			let right = world.isAir(rx+1, y) && world.isAir(rx+2, y) && world.isAir(rx+3, y) && world.isAir(rx+2, y+1) && r.nextBoolean() && world.isAir(rx+1, y+1);
			
			
			if(left && right) {
				world.tree(type, rx, y, 44,0+style);
			} else if(right) {
				world.tree(type, rx, y, 66,66+style);
			} else if(left) {
				world.tree(type, rx, y, 88,0+style);
			} else {
				let t = r.nextInt(3);
				if(t == 0) world.tree(type, rx, y, 0,style);
				if(t == 1) world.tree(type, rx, y, 22,0+style);
				else world.tree(type, rx, y, 0,66+style);
			}
			let t = r.nextInt(2);
			if(left) {
				if(t == 0) world.tree(type, rx-1, y, 66,style);
				else world.tree(type, rx-1, y, 44,198+style);
			}
			if(right) {
				if(t == 0) world.tree(type, rx+1, y, 88,66+style);
				else world.tree(type, rx+1, y, 66,198+style);
			}
		}
	}

	static stoneAt(world, r, rx, ry, type, style) {
		style *= 22;
		
		let idUnder = world.block(rx, ry+1);

		let rootleft = world.isAir(rx-1, ry) && r.nextBoolean() && world.isBlock(idUnder, rx-1, ry+1);
		let rootright = world.isAir(rx+1, ry) && r.nextBoolean() && world.isBlock(idUnder, rx+1, ry+1);

		if(rootleft && rootright) {
			world.tree(type, rx, ry, 88,132+style);
		} else if(rootright) {
			world.tree(type, rx, ry, 0,132+style);
		} else if(rootleft) {
			world.tree(type, rx, ry, 66,132+style);
		} else {
			world.tree(type, rx, ry, 0,style);
		}
		
		if(rootleft) world.tree(type, rx-1, ry, 44,132+style);
		if(rootright) world.tree(type, rx+1, ry, 22,132+style);
		
		let h = r.nextInt(10, 16);
		
		for (var dy = 1; dy < h; dy++) {
			let y = ry-dy;
			if(!world.hasArea(rx-2, y-4, 5, 4)) {
				if(dy >= 10) {
					world.replace(Blocks.Wood, Blocks.Air, rx-2, y+1, 5, 1);
					world.tree(type, rx, y+1, 22,198+style);
					break;
				}
				world.tree(type, rx, y, 0,198+style);
				break;
			}

			if(dy == h-1) {
				world.tree(type, rx, y, 22,198+style);
				continue;
			}
			
			let left = world.isAir(rx-1, y) && world.isAir(rx-2, y) && world.isAir(rx-3, y) && world.isAir(rx-2, y+1) && 
						   world.isAir(rx-1, y+1) && world.isAir(rx-2, y+1) && world.isAir(rx-3, y+1) && r.nextBoolean() && world.isAir(rx-1, y+1);
			let right = world.isAir(rx+1, y) && world.isAir(rx+2, y) && world.isAir(rx+3, y) && world.isAir(rx+2, y+1) && r.nextBoolean() && world.isAir(rx+1, y+1);
			
			
			if(left && right) {
				world.tree(type, rx, y, 44,0+style);
//				world.tree(rx, ry, 110,88+style);
			} else if(right) {
				world.tree(type, rx, y, 66,66+style);
			} else if(left) {
				world.tree(type, rx, y, 88,0+style);
			} else {
				let t = r.nextInt(3);
				if(t == 0) world.tree(type, rx, y, 0,style);
				if(t == 1) world.tree(type, rx, y, 22,0+style);
				else world.tree(type, rx, y, 0,66+style);
			}
			let t = r.nextInt(2);
			if(left) {
				if(t == 0) world.tree(type, rx-1, y, 66,style);
				else world.tree(type, rx-1, y, 44,198+style);
			}
			if(right) {
				if(t == 0) world.tree(type, rx+1, y, 88,66+style);
				else world.tree(type, rx+1, y, 66,198+style);
			}
		}
	}

	static cactusAt(world, r, rx, ry) {
		let h = r.nextInt(3, 8);
		
		for (var dy = 0; dy < h; dy++) {
			let y = ry-dy;
			if(!world.hasArea(rx-2, y-4, 5, 4)) {
				if(dy >= 10) {
					world.replace(Blocks.CactusPlant, Blocks.Air, rx-2, y+1, 5, 1);
					world.block(Blocks.CactusPlant, rx, y+1);
					break;
				}
				world.block(Blocks.CactusPlant, rx, y);
				break;
			}

			if(dy == h-1) {
				world.block(Blocks.CactusPlant, rx, y);
				continue;
			}
			
			let left = dy > 0 && world.isAir(rx-1, y) && world.isAir(rx-2, y) && world.isAir(rx-3, y) && r.nextBoolean();
			let right = dy > 0 && world.isAir(rx+1, y) && world.isAir(rx+2, y) && world.isAir(rx+3, y) && r.nextBoolean();
			if(world.isBlock(Blocks.CactusPlant, rx-1, y+1) && r.nextInt(4) != 0) {
				left = true;
			}
			if(world.isBlock(Blocks.CactusPlant, rx+1, y+1) && r.nextInt(4) != 0) {
				right = true;
			}

			world.block(Blocks.CactusPlant, rx, y);
			if(left) world.block(Blocks.CactusPlant, rx-1, y);
			if(right) world.block(Blocks.CactusPlant, rx+1, y);
		}
	}
}