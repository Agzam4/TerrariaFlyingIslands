

let imports = [
	`../terraria/world-static.js`,
	`../terraria/world.js`,
	`../terraria/world-writer.js`,
	`../terraria/BinaryWriter.js`,
	`../generator/Random.js`,
	`../generator/Mathf.js`,
	`../generator/Simplex.js`,
	`../generator/Loot.js`,
	`../generator/flying/FlyingWorld.js`,
	`../generator/flying/Dungeon.js`,
	`../generator/flying/JungleTmple.js`,
	`../generator/flying/Phyramid.js`,
	`../generator/flying/Tree.js`,
];

for (let i of imports) {
	importScripts(i);
}

self.addEventListener("message", function(e) {
	if(e.data.name == 'create') {
		let world;
		world = FlyingWorld.create(e.data.config);
		world.save();
	}
});

