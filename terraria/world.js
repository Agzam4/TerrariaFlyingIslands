class Bit {
	static bit0 = 0b00000001;
	static bit1 = 0b00000010;
	static bit2 = 0b00000100;
	static bit3 = 0b00001000;
	static bit4 = 0b00010000;
	static bit5 = 0b00100000;
	static bit6 = 0b01000000;
	static bit7 = 0b10000000;
	static bits = [0b00000001,0b00000010,0b00000100,0b00001000,0b00010000,0b00100000,0b01000000,0b10000000]
}

const TileType = {
	IceByRod: 127,
};

const Tile = {
	bitWireRed: 	Bit.bit1,
	bitWireBlue: 	Bit.bit2,
	bitWireGreen: 	Bit.bit3,
	bitWireYellow: 	Bit.bit5,

	blockBit:		Bit.bit1,
	bitActuator:	Bit.bit1,
	wallBit:		Bit.bit2,
	bitDisabled: 	Bit.bit2,
	colorBit:		Bit.bit3,
	backgroundBit:	Bit.bit4,
	blockBit2:		Bit.bit5,

	bitWater:		Bit.bit3,
	bitLava:		Bit.bit4,
	bitHoney:		Bit.bit3 | Bit.bit4,
}

const Debug = {
	start: 0,
	mark: null,
	counter: 0,
	time: mark => {
		if(Debug.mark != null) {
			var time = (new Date()-Debug.start);
			let smark = Debug.mark.replaceAll(' ', '').toLowerCase();
			if(Progress.steps[smark] != undefined) {
				// console.log(Debug.mark, time + "ms", '/', Progress.steps[smark].predict);
				Progress.steps[smark].time = time;
			} else {
				Progress.steps[smark] = {time:time};
				// console.log(Debug.mark, time + "ms");
			}
		}
		Debug.start = new Date();
		Debug.mark = mark;
        self.postMessage({name:"mark", mark:mark});
	},
	putWriter: (name, index) => {
		// if(index <= 212)
		// console.log(`${name} at ${index}`)
	}
};

class Chest {

	static legacyLimit = 1000;
	static maxItems = 40;

	constructor(name, x, y) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.items = new Array(Chest.maxItems);
	}

	item(id, item) {
		this.items[id] = item;
		return this;
	}
}

class ItemStack {

	constructor(item, amount = 1, modificator = 0) {
		this.item = item.id;
		this.amount = amount;
		this.modificator = modificator;
	} 
}

class Sign {

	static legacyLimit = 1000;

}

class Npc {

	constructor(id, tag, name, needHome, home, pos, type = 0) {
		this.id = id;
		this.tag = tag;
		this.name = name;
		this.needHome = needHome;
		this.home = home;
		this.pos = pos;
		this.type = type;
	}

}

class NpcHome {

	constructor(id, pos) {
		this.id = id;
		this.pos = pos;
	}

}


class World {

	constructor(width = 1000, height = 500) {
		this.version = 279;
		this.isChinese = false;
		this.fileRevision = 0;
		this.hasFrames = WorldStatic.frames;
		this.seed = "Agzam";
		this.title = "Agzam's world";
		this.worldGeneratorVersion = 0;
		this.guid = [65, 103, 122, 97, 109, 52, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.worldId = 689807651;
		this.resize(width, height);
		this.gamemode = 3;
		this.creationTime = 0;
		this.spawn = {x:600, y:150};
		this.time = 13500;
		this.dayTime = true;
		this.dungeon = {x:208, y:200};
		this.slimeRainTime = 0.0;
		this.clouds = 0;
		this.anglers = [];
		this.windSpeed = 0;
		this.killedMobs = new Array(688);
		this.partyingNPCs = [];
		this.treeTopStyles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.chests = [];
		this.signs = [];
		this.NPCs = [new Npc(37, "Name#37", "", false, {x:0,y:0}, {x:0,y:0})];
		this.mobs = [];
		this.shimmeredTownNPCs = [0];
		this.entities = [];
		this.cobaltId = -1;
		this.mythrilId = -1;
		this.adamantiteId = -1;
	}

	resize(w, h) {
		this.tiles = new Array(w);
		for (var x = 0; x < w; x++) {
			this.tiles[x] = new Array(h);
			for (var y = 0; y < h; y++) {
				this.tiles[x][y] = World.emptyTile();
			}
		}
		this.width = w;
		this.height = h;
		this.leftBorder = 0;
		this.rightBorder = w*16;
		this.topBorder = 0;
		this.bottomBorder = h*16;

		// for (var x = 0; x < w/2; x++) {
		// 	for (var y = 0; y < h/2; y++) {
		// 		this.block(Blocks.Dirt, x, y);
		// 	}
		// }
	}

	static emptyTile() {
		return {
			type: -1, 						// block type
			wall: 0,						// background color
			tileColor: 0, 					// front color
			wallColor: 0,					// back color
			u: 0, v: 0,						// multiblock frame
			liquidAmount: 0,				// count of liquid (0-255)
			liquidType: LiquidType.None, 	// 
			disabled: false,				// 
			wireRed: false,					// Has tile red wire
			wireGreen: false,				// Has tile green wire
			wireBlue: false,				// Has tile blue wire
			wireYellow: false,				// Has tile yellow wire
			actuator: false,				// 
			shape: 0					// 
		};
	}

	static tileSetAir(tile) {
		tile.type = -1;
	}

	static tileSetWall(tile, wall) {
		tile.wall = wall;
	}

	static tileSetBlock(tile, type) {
		if(type == Blocks.Air) {
			tileSetAir(tile);
			return;
		}
		tile.type = type.id;
	}

	static tileSetFrame(tile, u, v) {
		tile.u = u;
		tile.v = v;
	}

	static tileIsEmpty(tile) {
		return tile.type == -1 && tile.liquidAmount == 0;
	}

	save() {
		WorldWriter.save(this);
	}

	writeAll(bw) {
		for (var i = 1; i < arguments.length; i++) {
			this.write(bw, arguments[i]);
		}
	}

	write(bw, name) {
		Debug.putWriter(name, bw.index);
		let field = WorldFields[name];
		if(field == undefined) {
			console.error(`Field ${name} is not defined`);
			return;
		}
		if(this[name] == undefined) {
			if(field == FieldType.Boolean) {
				// console.warn(`Varrible ${name} is not defined`);
				this[name] = false;
			} else if(field == FieldType.Byte || field == FieldType.Int32 || field == FieldType.Float || field == FieldType.Double) {
				// console.warn(`Varrible ${name} is not defined`);
				this[name] = 0;
			} else {
				console.error(`Varrible ${name} is not defined (field ${field})`);
				return;
			}
		}
		if(this[name] == null) {
			console.error(`Varrible ${name} is null`);
			return;
		}
		if(field == FieldType.Boolean) bw.bool(this[name]);
		else if(field == FieldType.Byte) bw.out(this[name]);
		else if(field == FieldType.Int16) bw.int16(this[name]);
		else if(field == FieldType.Int32) bw.int32(this[name]);
		else if(field == FieldType.Int64) bw.int64(this[name]);
		else if(field == FieldType.Float) bw.float(this[name]);
		else if(field == FieldType.Double) bw.double(this[name]);
		else if(field == FieldType.String) bw.string(this[name]);
		else if(field == FieldType.Bytes) bw.bytes(this[name]);
		else if(field == FieldType.Vec2) {
			bw.int32(this[name].x);
			bw.int32(this[name].y);
		} else if(field == FieldType.Int32Array) {
			let arr = this[name];
			bw.int32(arr.length);
			for (let e of arr) {
				bw.int32(e);
			}
		} else if(field == FieldType.StringArray) {
			let arr = this[name];
			bw.int32(arr.length);
			for (let e of arr) {
				bw.string(e);
			}
		}
	}

	eqlTile(t1, t2) {
		if(t1 == undefined) return t2 == undefined;
		if(t2 == undefined) return t1 == undefined;

		if(t1.type != t2.type) return false;
		if(t1.wall != t2.wall) return false;
		if(t1.tileColor != t2.tileColor) return false;
		if(t1.wallColor != t2.wallColor) return false;
		if(t1.u != t2.u) return false;
		if(t1.v != t2.v) return false;
		if(t1.liquidAmount != t2.liquidAmount) return false;
		if(t1.liquidType != t2.liquidType) return false;
		if(t1.wireRed != t2.wireRed) return false;
		if(t1.wireGreen != t2.wireGreen) return false;
		if(t1.wireBlue != t2.wireBlue) return false;
		if(t1.wireYellow != t2.wireYellow) return false;
		if(t1.actuator != t2.actuator) return false;
		if(t1.disabled != t2.disabled) return false;
		if(t1.shape != t2.shape) return false;
		return true;
	}

	has(x, y) {
		if(x < 0 || y < 0) return false;
		if(x >= this.width || y >= this.height) return false;
		return true;
	}

	block() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return this.tiles[x][y].type;
		} else {
			let type = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].type = type.id;
			return true;
		}
	}

	shape() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return this.tiles[x][y].shape;
		} else {
			let shape = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].shape = shape;
			return true;
		}
	}

	wall() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return this.tiles[x][y].wall;
		} else {
			let type = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].wall = type;
			return true;
		}
	}

	liquid(type, amount, x, y) {
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		if(!this.has(x,y)) return false;
		this.tiles[x][y].liquidType = type;
		this.tiles[x][y].liquidAmount = amount;
		return true;
	}

	isLiquid(type, x, y) {
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		if(!this.has(x,y)) return false;
		return this.tiles[x][y].liquidType == type;
	}

	isFrame(x, y, u, v) {
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		if(!this.has(x,y)) return false;
		return this.tiles[x][y].u == u && this.tiles[x][y].v == v;
	}
	
	frame(u, v, x, y) {
		if(!this.has(x,y)) return false;
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		if(u != null) this.tiles[x][y].u = u;
		if(v != null) this.tiles[x][y].v = v;
		return true;
	}

	sprite(sprite, x, y, u, v) {
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		for (var dy = 0; dy < sprite.h; dy++) {
			for (var dx = 0; dx < sprite.w; dx++) {
				this.block(sprite, x+dx, y+dy);
				this.frame(u+dx*18, v+dy*18, x+dx, y+dy);
			}
		}
	}

	isBlock(type, x, y) {
		return this.block(x, y) == type.id;
	}

	isWall(type, x, y) {
		return this.wall(x, y) == type;
	}

	paint() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return this.tiles[x][y].tileColor;
		} else {
			let color = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].tileColor = color;
			return true;
		}
	}

	wallpaint() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return this.tiles[x][y].wallColor;
		} else {
			let color = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].wallColor = color;
			return true;
		}
	}

	redWire() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return this.tiles[x][y].wireRed;
		} else {
			let wire = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].wireRed = wire;
			return true;
		}
	}

	active() {
		if(arguments.length == 2) { // getter
			let x = Mathf.floor(arguments[0]);
			let y = Mathf.floor(arguments[1]);
			if(!this.has(x,y)) return undefined;
			return !this.tiles[x][y].disabled;
		} else {
			let active = arguments[0];
			let x = Mathf.floor(arguments[1]);
			let y = Mathf.floor(arguments[2]);
			if(!this.has(x,y)) return false;
			this.tiles[x][y].disabled = !active;
			return true;
		}
	}

	isAir(x, y) {
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		return this.block(x, y) == -1;
	}

	hasAirNear4(x, y) {
		return this.isAir(x-1, y) || this.isAir(x+1, y) || this.isAir(x, y-1) || this.isAir(x, y+1);
	}

	hasArea(x, y, w, h) {
		x = Mathf.floor(x);
		y = Mathf.floor(y);
		for (var dy = 0; dy < h; dy++) {
			for (var dx = 0; dx < w; dx++) {
				if(this.isAir(x+dx, y+dy)) continue;
				return false;
			}
		}
		return true;
	}

	hasBlockNear4(type, x, y) {
		return this.isBlock(type, x-1, y) || this.isBlock(type, x+1, y) || this.isBlock(type, x, y-1) || this.isBlock(type, x, y+1);
	}

	hasWallNear4(type, x, y) {
		return this.isWall(type, x-1, y) || this.isWall(type, x+1, y) || this.isWall(type, x, y-1) || this.isWall(type, x, y+1);
	}

	tree(tree, x, y, u, v) {
		if(arguments.length == 5) {
			let tree = arguments[0];
			let x = arguments[1];
			let y = arguments[2];
			let u = arguments[3];
			let v = arguments[4];
			this.block(tree, x, y);
			this.frame(u, v, x, y);
		} else {
			let x = arguments[0];
			let y = arguments[1];
			let u = arguments[2];
			let v = arguments[3];
			this.block(Blocks.Trees, x, y);
			this.frame(u, v, x, y);
		}
	}

	fill(id, x, y, w, h) {
		for (var dy = 0; dy < h; dy++) {
			for (var dx = 0; dx < w; dx++) {
				this.block(id, x+dx, y+dy);
			}
		}
	}

	fillsave(id, save, x, y, w, h) {
		for (var dy = 0; dy < h; dy++) {
			for (var dx = 0; dx < w; dx++) {
				if(!this.isBlock(save, x+dx, y+dy)) this.block(id, x+dx, y+dy);
			}
		}
	}

	replace(from, to, x, y, w, h) {
		for (var dy = 0; dy < h; dy++) {
			for (var dx = 0; dx < w; dx++) {
				if(this.isBlock(from, x+dx, y+dy)) this.block(to, x+dx, y+dy);
			}
		}
	}

	fillwall(id, x, y, w, h) {
		for (var dy = 0; dy < h; dy++) {
			for (var dx = 0; dx < w; dx++) {
				this.wall(id, x+dx, y+dy);
			}
		}
	}

	isSprite(x, y) {
		let type = this.block(x, y);
		if(type < 0) return false;
		return this.hasFrames[type];
	}

	hasSprite4(x, y) {
		return this.isSprite(x-1, y) || this.isSprite(x+1, y) || this.isSprite(x, y-1) || this.isSprite(x, y+1);
	}
}



