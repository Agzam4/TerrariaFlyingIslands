class Progress {

	static iterations = 0;
	static maxIterations = 0;
	static next = 0;
	static precents = 0;

	static n(n) {
		Progress.iterations+=n;
		if(Progress.iterations >= Progress.next) {
			Progress.precents++;
			Progress.next = Progress.maxIterations*(Progress.precents)/100;
        	self.postMessage({name:"progress", precents:Progress.precents});
		}
	}

	static setn(n) {
		Progress.iterations=n;
		if(Progress.iterations >= Progress.next) {
			Progress.precents++;
			Progress.next = Progress.maxIterations*(Progress.precents)/100;
        	self.postMessage({name:"progress", precents:Progress.precents});
		}
	}

	static ns() {
		return Progress.iterations;
	}

	static steps = {};

	static amax(step, n=0) {
		step = step.replaceAll(' ', '').toLowerCase();
		Progress.steps[step] = {predict:n};
		n = Mathf.floor(n);
		Progress.maxIterations+=n;
		Progress.next = Progress.maxIterations/100;
		Progress.precents = 1;
	}
}


const ProgressTimes = {

	islands: (is) => is*20.333333333333336, // 1868ms
	hives: 45,			// linear		41ms-51ms
	honey: 15,			// linear		12ms-15ms
	phyramid: 170,		// linear		162ms-172ms
	jungleTmple: 350,	// linear		340ms-360ms
	macrostructures: (w,h) => w*h*0.0004505952380952381, // scale by world width 6037ms-6348ms
	dirt: (w,h) => w*h*0.0015996031746031746,
	dungeon: (w) => w*0.2036, // scale by world width					509ms-524ms
	grass: (w,h) => w*h*0.0011, // scale by world size					5331ms-5609ms
	ores: (w,h) => w*h*0.00026044444444444444, // scale by world size	1271ms-1254ms
// 	Orbs is too small step
// 		Macro structures 1695ms-1662ms
	waterfalls: (w,h) => w*h*0.0005146666666666666*2, // scale by world size 853ms-1158ms
	fixing: (w,h) => w*h*0.0002888888888888889, // scale by world size 657ms-651ms
}

let loadFrames = is => {
	frames = new Array(693);
	for (var i = 0; i < frames.length; i++) {
		frames[i] = false;
	}
	for (var i of is) {
		frames[i] = true;
	}
	return frames;
}
const Struct = {
	filteredCopy: (list, filter) => {
		let filtered = [];
		for (var e of list) {
			if(filter(e)) filtered.push(e);
		}
		return filtered;
	}
};

const WorldStatic = {
	maxNpcId: 687,
	frames: loadFrames([3, 4, 5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 26, 27, 28, 29, 31, 33, 34, 35, 36, 42, 49, 50, 55, 61, 71, 72, 73, 74, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 110, 113, 114, 125, 126, 128, 129, 132, 133, 134, 135, 136, 137, 138, 139, 141, 142, 143, 144, 149, 165, 171, 172, 173, 174, 178, 184, 185, 186, 187, 201, 207, 209, 210, 212, 215, 216, 217, 218, 219, 220, 227, 228, 231, 233, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 254, 269, 270, 271, 275, 276, 277, 278, 279, 280, 281, 282, 283, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 314, 316, 317, 318, 319, 320, 323, 324, 334, 335, 337, 338, 339, 349, 354, 355, 356, 358, 359, 360, 361, 362, 363, 364, 372, 373, 374, 375, 376, 377, 378, 380, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 405, 406, 410, 411, 412, 413, 414, 419, 420, 423, 424, 425, 427, 428, 429, 435, 436, 437, 438, 439, 440, 441, 442, 443, 444, 445, 452, 453, 454, 455, 456, 457, 461, 462, 463, 464, 465, 466, 467, 468, 469, 470, 471, 475, 476, 480, 484, 485, 486, 487, 488, 489, 490, 491, 493, 494, 497, 499, 505, 506, 509, 510, 511, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 529, 530, 531, 532, 533, 538, 542, 543, 544, 545, 547, 548, 549, 550, 551, 552, 553, 554, 555, 556, 558, 559, 560, 564, 565, 567, 568, 569, 570, 571, 572, 573, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 619, 620, 621, 622, 623, 624, 629, 630, 631, 632, 634, 637, 639, 640, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 656, 657, 658, 660, 663, 664, 665]),
};

const Paints = {
	None			:0,
	Red				:1,
	Orange			:2,
	Yellow			:3,
	Lime			:4,
	Green			:5,
	Teal			:6,
	Cyane			:7,
	SkyBlue			:8,
	Blue			:9,
	Purple			:10,	
	Violet			:11,
	Pink			:12,
	DeepRed			:13,	
	DeepOrange		:14,		
	DeepYellow		:15,		
	DeepLime		:16,		
	DeepGreen		:17,		
	DeepTeal		:18,		
	DeepCyane		:19,		
	DeepSkyBlue		:20,	
	DeepBlue		:21,		
	DeepPurple		:22,		
	DeepViolet		:23,		
	DeepPink		:24,		
	Black			:25,	
	White			:26,	
	Gray			:27,	
	Brown			:28,	
	Shadow			:29,	
	Negative		:30		
}

const Biomes = {
	None:	1,
	Snow:	2,
	Desert:	3,
	Jungle:	4,
	Evil:  	5,
	Hell: 	6
}

const BlockShape = {
	Full: 0,
    HalfBrick: 1,
    SlopeTopRight: 2,
    SlopeTopLeft: 3,
    SlopeBottomRight: 4,
    SlopeBottomLeft: 5
}


let Tmp = {};

class Block {
	constructor(id, w = 1, h = 1) {
		this.id = id;
		this.w = w;
		this.h = h;
	}
}

const Blocks = {
	DirtBlock  							:new Block(0),
	Stone  								:new Block(1),
	Grass  								:new Block(2),
	ForestShortPlants  					:new Block(3),
	Trees 								:new Block(5,1,10),
	IronOre               				:new Block(6),
	CopperOre             				:new Block(7),
	GoldOre               				:new Block(8),
	SilverOre             				:new Block(9),
	DoorsClosed           				:new Block(10,1,3),
	CrystalHeart          				:new Block(12,2,2),
	PlacedBottles         				:new Block(13),
	Anvils                				:new Block(16,2,1),
	WorkBenches           				:new Block(18,2,1),
	Platforms             				:new Block(19),
	Chests                				:new Block(21,2,2),
	DemoniteOre           				:new Block(22),
	CorruptGrassBlock     				:new Block(23),
	CorruptionShortPlants   			:new Block(24),
	EbonstoneBlock        				:new Block(25),
	Altars                				:new Block(26,3,2),
	Sunflower             				:new Block(27,2,4),
	Pots                  				:new Block(28,2,2),
	Wood                  				:new Block(30),
	OrbHeart              				:new Block(31,2,2),
	Candles								:new Block(33),
	GrayBrick							:new Block(38),
	BlueBrick							:new Block(41),
	Lanterns							:new Block(42),
	GreenBrick							:new Block(43),
	PinkBrick							:new Block(44),
	Spike								:new Block(48),
	WaterCandle							:new Block(49),
	Books								:new Block(50),
	Cobweb								:new Block(51),
	Vines								:new Block(52),
	SandBlock							:new Block(53),
	ObsidianBlock						:new Block(56),
	AshBlock							:new Block(57),
	HellstoneOre						:new Block(58),
	MudBlock							:new Block(59),
	JungleGrassBlock					:new Block(60),
	JungleShortPlants					:new Block(61),
	JungleVines							:new Block(62),
	RubyStoneBlock						:new Block(64),
	MushroomGrassBlock					:new Block(70),
	ForestTallPlants					:new Block(73),
	JungleTallPlants					:new Block(74),
	ObsidianBrick						:new Block(75),
	HellstoneBrick						:new Block(76),
	Hellforge							:new Block(77,3,2),
	CactusPlant							:new Block(80,3,3),
	HerbsBloom							:new Block(84),
	Loom								:new Block(86,3,2),
	LampPost							:new Block(92,1,6),
	Lamps								:new Block(93,1,3),
	Keg									:new Block(94,2,2),
	CookingPots							:new Block(96,2,2),
	// 100
	Bookcases							:new Block(101,3,4),
	Clocks								:new Block(104,2,5),
	Statue								:new Block(105,2,3),
	MudstoneBrick						:new Block(120),
	PressurePlates						:new Block(135),
	Traps								:new Block(137),
	SnowBlock							:new Block(147),
	SandstoneBrick						:new Block(151),
	EbonstoneBrick						:new Block(152),
	RichMahogany						:new Block(158),
	IceBlock							:new Block(161),
	Decos								:new Block(186,3,2),
	Decos2								:new Block(187,3,2),
	LivingWoodBlock						:new Block(191),
	BoneBlock							:new Block(194),
	CrimsonGrassBlock					:new Block(199),
	// 200
	CrimstoneBlock						:new Block(203),
	CrimtaneOre							:new Block(204),
	CrimsonVines						:new Block(205),
	Rope								:new Block(213),
	Chain								:new Block(214),
	SlushBlock							:new Block(224),
	HiveBlock							:new Block(225),
	LihzahrdBrick						:new Block(226),
	WoodenSpike							:new Block(232),
	Larva								:new Block(231,3,3),
	JungleLargePlants					:new Block(233),
	LihzahrdAltar						:new Block(237,3,2),
	WallHandings3x3						:new Block(240,3,3),
	PalladiumColumn						:new Block(248),
	StoneSlab							:new Block(273),
	SandstoneSlab						:new Block(274),
	// 300
	BorealWood							:new Block(321),
	LivingFireBlock						:new Block(336),
	BewitchingTable						:new Block(354,3,3),
	AlchemyTable						:new Block(355,3,3),
	SmoothMarbleBlock					:new Block(357),
	MarbleBlock							:new Block(367),
	GraniteBlock						:new Block(368),
	SmoothGraniteBlock					:new Block(369),
	SharpeningStation					:new Block(377,3,2),
	FlowerVines							:new Block(382),
	LivingMahoganyBlock					:new Block(383),
	LivingMahoganyLeavesBlock			:new Block(384),
	SandstoneBlock						:new Block(396),
	HardenedSandBlock					:new Block(397),
	// 400
	DesertFossilBlock					:new Block(404),
	LogicSensor 						:new Block(423),
	Geyser								:new Block(443,2,1),
	BeeHive								:new Block(444),
	SnowCloudBlock						:new Block(460),
	Chests2								:new Block(467,2,2),
	CrimstoneBrick						:new Block(478),
	SmoothSandstoneBlock				:new Block(479),
	CrackedBlueBrick					:new Block(481),
	CrackedGreenBrick					:new Block(482),
	CrackedPinkBrick					:new Block(483),
	RollingCactus						:new Block(484,2,2), 
	AntlionLarva						:new Block(485,2,2),
	FallenLog							:new Block(488,3,2),
	SpiderNestBlock						:new Block(498),
	// 500
	Plate 								:new Block(520),
	MushroomVines						:new Block(528),
	KryptonMossBlock					:new Block(534),
	BambooBlock							:new Block(562),
	LargeBambooBlock					:new Block(563),
	TopazTree 							:new Block(583,1,10),
	AmethystTree 						:new Block(584,1,10),
	SapphireTree 						:new Block(585,1,10),
	EmeraldTree 						:new Block(586,1,10),
	RubyTree 							:new Block(587,1,10),
	DiamondTree 						:new Block(588,1,10),
	AmberTree 							:new Block(589,1,10),
	HangingPots							:new Block(591,2,3),
	VanityTreeSakura					:new Block(596,1,10),
	HangingBrazier						:new Block(592,2,3),
	// 600
	VanityTreeYellowWillow				:new Block(616,1,10),
	StoneAccentSlab						:new Block(618),
	AshGrassBlock						:new Block(633),
	AshTree								:new Block(634),
	CorruptVines						:new Block(636),
	ManaCrystal							:new Block(639,2,2),
	AetheriumBlock						:new Block(659),
	AetheriumBrick						:new Block(667),
	Air									:new Block(-1)
};

const LiquidType = {
    None: 	0,
    Water: 	1,
    Lava:	2,
    Honey: 	3,
    Shimmer:8
};


const Walls = {
	EbonstoneWallNatural			:3,
	CursedBlueBrickWall				:7,
	CursedGreenBrickWall			:8,
	CursedPinkBrickWall				:9,
	ObsidianBrickWallNatural		:14,
	BlueBrickWall					:17,
	SandstoneBrickWall				:34,
	LivingLeafWall 					:60,
	InfestedSpiderWall				:62,
	CrimstoneWallNatural			:83,
	HiveWallNatural					:86,
	ForbiddenLihzahrdBrickWall		:87,
	CursedBlueSlabWall				:94,
	CursedBlueTiledWall				:95,
	CursedPinkSlabWall				:96,
	CursedPinkTiledWall				:97,
	CursedGreenSlabWall				:98,
	CursedGreenTiledWall			:99,
	LeadFence 						:107,
	StoneSlabWall					:147,
	BorealWoodWall					:149,
	BorealWoodFence					:150,
	ObsidianWall					:267,
	SandstoneWall					:275,
	BambooFence						:315,
	Air								:0
}

const ItemType = {
	Accessory	:0,
	Weapon		:1,
	Common		:2,
	Melee		:3,
	Ranged		:4,
	Magic		:5
}

class Item {

	constructor(id, type = null) {
		this.id = id;
		this.type = type;
	}

	hasModifier() {
		return this.type != null;
	}
}

const Items = {

	Torch							:new Item(8),
	Wood							:new Item(9),
	GoldBar							:new Item(19),
	CopperBar						:new Item(20),
	SilverBar						:new Item(21),
	IronBar							:new Item(22),
	
	LesserHealingPotion				:new Item(28),
	WoodenArrow						:new Item(40),
	Shuriken						:new Item(42),
	SuspiciousLookingEye			:new Item(43),
	BandOfRegeneration				:new Item(49, ItemType.Accessory),
	MagicMirror						:new Item(50),
	AngelStatue						:new Item(52),
	CloudInABottle					:new Item(53, ItemType.Accessory),
	HermesBoots						:new Item(54, ItemType.Accessory),
	EnchantedBoomerang				:new Item(55, ItemType.Weapon),
	Starfury						:new Item(65, ItemType.Melee),
	
	FlowerOfFire					:new Item(112, ItemType.Magic),
	MagicMissile					:new Item(113),
	MeteoriteBar					:new Item(117),
	Muramasa						:new Item(155),
	CobaltShield					:new Item(156),
	AquaScepter						:new Item(157),
	ShinyRedBalloon					:new Item(159, ItemType.Accessory),
	BlueMoon						:new Item(163),
	Handgun							:new Item(164),
	Bomb							:new Item(166),
	Dynamite						:new Item(167),
	Grenade							:new Item(168),
	FeralClaws						:new Item(211, ItemType.Accessory),
	AnkletOfTheWind					:new Item(212, ItemType.Accessory),
	StaffOfRegrowth					:new Item(213, ItemType.Melee),
	Flamelash						:new Item(218, ItemType.Magic),
	PhoenixBlaster					:new Item(219),
	Sunfury							:new Item(220, ItemType.Weapon),
	HellfireArrow					:new Item(265),
	DarkLance						:new Item(274, ItemType.Weapon),
	ThrowingKnife					:new Item(279),
	Spear							:new Item(280, ItemType.Weapon),
	Blowpipe						:new Item(281, ItemType.Ranged),
	Glowstick						:new Item(282),
	WoodenBoomerang					:new Item(284, ItemType.Weapon),
	Aglet							:new Item(285, ItemType.Accessory),
	StickyGlowstick					:new Item(286),
	PoisonedKnife					:new Item(287),
	IronskinPotion					:new Item(292),
	SwiftnessPotion					:new Item(290),
	ManaRegenerationPotion			:new Item(293),
	MagicPowerPotion				:new Item(294),
	FeatherfallPotion				:new Item(295),
	SpelunkerPotion					:new Item(296),
	InvisibilityPotion				:new Item(297),
	ShinePotion						:new Item(298),
	NightOwlPotion					:new Item(299),
	ThornsPotion					:new Item(301),
	WaterWalkingPotion				:new Item(302),
	HunterPotion					:new Item(304),
	GravitationPotion				:new Item(305),
	ShadowKey						:new Item(329),
	Chests2							:new Item(467),
	IceBoomerang					:new Item(670, ItemType.Weapon),
	UnholyTrident					:new Item(683, ItemType.Magic),
	TinBar							:new Item(703),
	LeadBar							:new Item(704),
	TungstenBar						:new Item(705),
	PlatinumBar						:new Item(706),
	IceBlade						:new Item(724, ItemType.Melee),
	PharaohsMask					:new Item(848),
	SandstormInABottle				:new Item(857),
	WaterWalkingBoots				:new Item(863),
	PharaohsRobe					:new Item(866),
	LavaCharm						:new Item(906, ItemType.Accessory),
	FlareGun						:new Item(930, null),
	FlyingCarpet					:new Item(934),
	WebSlinger						:new Item(939),
	Umbrella						:new Item(946, ItemType.Melee),
	IceSkates						:new Item(950, ItemType.Accessory),
	ClimbingClaws					:new Item(953, ItemType.Accessory),
	Boomstick						:new Item(964, ItemType.Ranged),
	Rope							:new Item(965),
	IceTorch						:new Item(974),
	ShoeSpikes						:new Item(975, ItemType.Accessory),
	BlizzardInABottle				:new Item(987, ItemType.Accessory),
	FrostburnArrow					:new Item(988),
	Extractinator					:new Item(997),
	// 1000
	Beenade							:new Item(1130),
	PiranhaGun 						:new Item(1156),
	ChlorophyteBullet				:new Item(1179),
	ChlorophyteArrow				:new Item(1235),
	RainbowGun						:new Item(1260),
	StyngerBolt						:new Item(1261),
	LihzahrdPowerCell				:new Item(1293),
	SnowballCannon					:new Item(1319, ItemType.Ranged),
	VampireKnives					:new Item(1569),
	ScourgeOfTheCorruptor 			:new Item(1571),
	StaffOfTheFrostHydra			:new Item(1572),
	FlurryBoots						:new Item(1579, ItemType.Ranged),
	// 2000
	BoneWelder						:new Item(2192),
	LihzahrdFurnace					:new Item(2195),
	IceMachine						:new Item(2198),
	HoneyDispenser					:new Item(2204),
	CelestialMagnet					:new Item(2219, ItemType.Accessory),
	FiberglassFishingPole			:new Item(2292),
	MiningPotion					:new Item(2322),
	BuilderPotion					:new Item(2325),
	TitanPotion						:new Item(2326),
	SummoningPotion					:new Item(2328),
	DangersensePotion				:new Item(2329),
	AmmoReservationPotion			:new Item(2344),
	LifeforcePotion					:new Item(2345),
	EndurancePotion					:new Item(2346),
	InfernoPotion					:new Item(2348),
	RecallPotion					:new Item(2350),
	TeleportationPotion				:new Item(2351),
	WarmthPotion					:new Item(2359),
	SolarTabletFragment				:new Item(2766),
	SolarTablet						:new Item(2767),
	// 3000
	BoneArrow						:new Item(3003),
	BoneTorch						:new Item(3004),
	FlowerBoots						:new Item(3017, ItemType.Accessory),
	HellwingBow						:new Item(3019, ItemType.Ranged),
	GuideToPlantFiberCordage		:new Item(3068, ItemType.Accessory),
	WandOfSparking					:new Item(3069, ItemType.Magic),
	Radar							:new Item(3084, ItemType.Accessory),
	HerbBag							:new Item(3093),
	IceMirror						:new Item(3199),
	Valor							:new Item(3317),
	LivingMahoganyWand				:new Item(3360),
	RichMahoganyLeafWand			:new Item(3361),
	BoneThrowingJavelin				:new Item(3378),
	BoneThrowingKnife				:new Item(3379),
	// 4000
	DuneriderBoots					:new Item(4055, ItemType.Accessory),
	AncientChisel					:new Item(4056, ItemType.Accessory),
	StormSpear						:new Item(4061, ItemType.Weapon),
	ThunderZapper					:new Item(4062, ItemType.Magic),
	SnakeCharmersFlute				:new Item(4262),
	DesertMinecart					:new Item(4066),
	BastStatue						:new Item(4276),
	StepStool						:new Item(4341, ItemType.Accessory),
	CanOfWorms						:new Item(4345),
	EncumberingStone				:new Item(4346),
	DesertTorch						:new Item(4383),
	JungleTorch						:new Item(4388),
	ScarabBomb						:new Item(4423),
	BeeMinecart						:new Item(4426),
	DemonicHellcart					:new Item(4443),
	ShroomMinecart					:new Item(4450),
	DesertTigerStaff				:new Item(4607),
	MushroomHat						:new Item(4779),
	MushroomVest					:new Item(4780),
	MushroomPants					:new Item(4781),
	PotionOfReturn					:new Item(4870),
	// 5000
	TreasureMagnet					:new Item(5010, ItemType.Accessory),
	Mace							:new Item(5011, ItemType.Weapon)
}

class Modifier {

	static modifiers = null;

	constructor(id, type = null) {
		this.id = id;
		this.type = type;
	}

	static create() {
		let modifiers = new Array(Object.values(ItemType).length); 
		let tmp = new Array(Object.values(ItemType).length);
		for (var i = 0; i < tmp.length; i++) tmp[i] = 0;
		for (var m of Object.values(Modifiers)) {
			if(m.type == null) continue;
			tmp[m.type]++;
		}
		for (var i = 0; i < modifiers.length; i++) {
			modifiers[i] = new Array(tmp[i]);
			tmp[i] = 0;
		}
		for (var m of Object.values(Modifiers)) {
			if(m.type == null) continue;
			modifiers[m.type][tmp[m.type]++] = m;
		}
		return modifiers;
	}

	static get(t) {
		if(Modifier.modifiers == null) Modifier.modifiers = Modifier.create();
		return Modifier.modifiers[t];
	}
}

const Modifiers = {

	None         :new Modifier(0),
	Large        :new Modifier(1, ItemType.Melee),
	Massive      :new Modifier(2, ItemType.Melee),
	Dangerous    :new Modifier(3, ItemType.Melee),
	Savage       :new Modifier(4, ItemType.Melee),
	Sharp        :new Modifier(5, ItemType.Melee),
	Pointy       :new Modifier(6, ItemType.Melee),
	Tiny         :new Modifier(7, ItemType.Melee),
	Terrible     :new Modifier(8, ItemType.Melee),
	Small        :new Modifier(9, ItemType.Melee),
	Dull         :new Modifier(10, ItemType.Melee),
	Unhappy      :new Modifier(11, ItemType.Melee),
	Bulky        :new Modifier(12, ItemType.Melee),
	Shameful     :new Modifier(13, ItemType.Melee),
	Heavy        :new Modifier(14, ItemType.Melee),
	Light        :new Modifier(15, ItemType.Melee),
	Sighted      :new Modifier(16, ItemType.Ranged),
	Rapid        :new Modifier(17, ItemType.Ranged),
	HastyR    	 :new Modifier(18, ItemType.Ranged),
	Intimidating :new Modifier(19, ItemType.Ranged),
	Deadly 	     :new Modifier(20, ItemType.Ranged),
	Staunch      :new Modifier(21, ItemType.Ranged),
	Awful        :new Modifier(22, ItemType.Ranged),
	Lethargic    :new Modifier(23, ItemType.Ranged),
	Awkward      :new Modifier(24, ItemType.Ranged),
	Powerful     :new Modifier(25, ItemType.Ranged),
	Mystic       :new Modifier(26, ItemType.Magic),
	Adept        :new Modifier(27, ItemType.Magic),
	Masterful    :new Modifier(28, ItemType.Magic),
	Inept        :new Modifier(29, ItemType.Magic),
	Ignorant     :new Modifier(30, ItemType.Magic),
	Deranged     :new Modifier(31, ItemType.Magic),
	Intense      :new Modifier(32, ItemType.Magic),
	Taboo        :new Modifier(33, ItemType.Magic),
	Celestial    :new Modifier(34, ItemType.Magic),
	Furious      :new Modifier(35, ItemType.Magic),
	Keen         :new Modifier(36, ItemType.Weapon),
	Superior     :new Modifier(37, ItemType.Weapon),
	Forceful     :new Modifier(38, ItemType.Weapon),
	Broken       :new Modifier(39, ItemType.Weapon),
	Damaged      :new Modifier(40, ItemType.Weapon),
	Shoddy       :new Modifier(41, ItemType.Weapon),
	QuickC    	 :new Modifier(42, ItemType.Common),
	DeadlyC   	 :new Modifier(43, ItemType.Common),
	Agile        :new Modifier(44, ItemType.Common),
	Nimble       :new Modifier(45, ItemType.Common),
	Murderous    :new Modifier(46, ItemType.Common),
	Slow         :new Modifier(47, ItemType.Common),
	Sluggish     :new Modifier(48, ItemType.Common),
	Lazy         :new Modifier(49, ItemType.Common),
	Annoying     :new Modifier(50, ItemType.Common),
	Nasty        :new Modifier(51, ItemType.Common),
	Manic        :new Modifier(52, ItemType.Magic),
	Hurtful      :new Modifier(53, ItemType.Weapon),
	Strong       :new Modifier(54, ItemType.Weapon),
	Unpleasant   :new Modifier(55, ItemType.Weapon),
	Weak         :new Modifier(56, ItemType.Weapon),
	Ruthless     :new Modifier(57, ItemType.Weapon),
	Frenzying    :new Modifier(58, ItemType.Ranged),
	Godly        :new Modifier(59, ItemType.Weapon),
	Demonic      :new Modifier(60, ItemType.Weapon),
	Zealous      :new Modifier(61, ItemType.Weapon),
	Hard         :new Modifier(62, ItemType.Accessory),
	Guarding     :new Modifier(63, ItemType.Accessory),
	Armored      :new Modifier(64, ItemType.Accessory),
	Warding      :new Modifier(65, ItemType.Accessory),
	Arcane       :new Modifier(66, ItemType.Accessory),
	Precise      :new Modifier(67, ItemType.Accessory),
	Lucky        :new Modifier(68, ItemType.Accessory),
	Jagged       :new Modifier(69, ItemType.Accessory),
	Spiked       :new Modifier(70, ItemType.Accessory),
	Angry        :new Modifier(71, ItemType.Accessory),
	Menacing     :new Modifier(72, ItemType.Accessory),
	Brisk        :new Modifier(73, ItemType.Accessory),
	Fleeting     :new Modifier(74, ItemType.Accessory),
	HastyA       :new Modifier(75, ItemType.Accessory),
	QuickA       :new Modifier(76, ItemType.Accessory),
	Wild         :new Modifier(77, ItemType.Accessory),
	Rash         :new Modifier(78, ItemType.Accessory),
	Intrepid     :new Modifier(79, ItemType.Accessory),
	Violent      :new Modifier(80, ItemType.Accessory),
	Legendary    :new Modifier(81, ItemType.Melee),
	Unreal       :new Modifier(82, ItemType.Ranged),
	Mythical     :new Modifier(83, ItemType.Magic),
}
