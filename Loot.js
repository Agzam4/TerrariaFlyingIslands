class LootItem {

	constructor(item, min = 1, max = 1, noModifier=false) {
		this.item = item;
		this.min = min;
		this.max = max;
		this.noModifier = noModifier;
		this.chance = 1;
	}

	take(r) {
		// console.log('take', this.item, this.min, this.max, this.noModifier);
		// if(element == undefined) console.warn('element is undefined', this, 'at', index);
		if(this.item.hasModifier == undefined) console.warn('hasModifier is not a function in', this, this.item);

		if(this.noModifier || !this.item.hasModifier()) return new ItemStack(this.item, r.nextInt(this.min, this.max+1));
		let modifiers = Modifier.get(this.item.type);
		return new ItemStack(this.item, r.nextInt(this.min, this.max+1), modifiers[r.nextInt(modifiers.length)].id);
	}

	c(chance) {this.chance = chance;return this}
}

class LootGroup {

	constructor(elements) {
		this.elements = elements;
		this.takes = 1;
		this.chance = 1;
	}

	take(r) {
		let index = r.nextInt(this.elements.length);
		let element = this.elements[index];
		if(element == undefined) console.warn('element is undefined', this, 'at', index);
		if(element.take == undefined) console.warn('element.take is not a function in', this, element);
		return element.take(r);
	}

	c(chance) {this.chance = chance;return this}
}

class Loot {

	static of() {
		let loot = new Loot();
		loot.loots = new Array(arguments.length)
		for (var i = 0; i < arguments.length; i++) {
			loot.loots[i] = arguments[i];
		}
		return loot;
	}

	static item(item, min=1, max=1,noModifier=false) {
		return new LootItem(item, min, max, noModifier);
	}

	static group() {
		let skip = 0;
		let func = (a) => Loot.item(a);
		if(typeof(arguments[0]) == 'number' && typeof(arguments[1]) == 'number') {
			func = (a) => Loot.item(a, arguments[0], arguments[1]);
			skip = 2;
		}
		let elements = new Array(arguments.length-skip);
		for (var i = 0; i < arguments.length-skip; i++) {
			let arg = arguments[i+skip];
			if(arg instanceof Item) {
				elements[i] = func(arg);
			} else {
				elements[i] = arg;
			}
		}
		return new LootGroup(elements);
	}

	set(chest, r) {
		let index = 0;
		for (var l of this.loots) {
			if(l == undefined) {
				console.warn('undefined item in', this);
				continue;
			}
			if(l.chance == undefined) {
				console.warn('undefined chance of', l)
				l.chance = 1;
			}
			if(r.nextFloat() >= l.chance) continue;
			if(l instanceof LootItem) { // single item
				chest.item(index++, l.take(r));
			}
			if(l instanceof LootGroup) { // single item
				for (var t = 0; t < l.takes; t++) {
					chest.item(index++, l.take(r));
				}
			}
		}
	}

	c(chance) {this.chance = chance;return this}
}

const LootPotions = {
	forestPotions: 	(min, max) => Loot.group(min, max, Items.BuilderPotion, Items.EndurancePotion, Items.FeatherfallPotion, Items.GravitationPotion, Items.HunterPotion, Items.MiningPotion, Items.NightOwlPotion, Items.SpelunkerPotion, Items.SwiftnessPotion, Items.TeleportationPotion),
	snowPotions:	(min, max) => Loot.group(min, max, Items.BuilderPotion, Items.DangersensePotion, Items.LifeforcePotion, Items.TitanPotion, Items.WarmthPotion),
	desertPotions:	(min, max) => Loot.group(min, max, Items.LesserHealingPotion, Items.IronskinPotion, Items.MiningPotion, Items.NightOwlPotion, Items.ShinePotion, Items.SwiftnessPotion, Items.ThornsPotion, Items.WaterWalkingPotion), 
	junglePotions:	(min, max) => Loot.group(min, max, Items.AmmoReservationPotion, Items.BuilderPotion, Items.InvisibilityPotion, Items.ManaRegenerationPotion, Items.MagicPowerPotion, Items.SpelunkerPotion, Items.SummoningPotion),
	hellPotions:	(min, max) => Loot.group(min, max, Items.GravitationPotion, Items.InfernoPotion, Items.TeleportationPotion),
}

const Loots = {

	forestChestLoot: Loot.of(
			Loot.group(
					Loot.item(Items.Spear), Loot.item(Items.Blowpipe),Loot.item(Items.WoodenBoomerang), Loot.item(Items.WaterWalkingBoots), 
					Loot.item(Items.Glowstick, 40, 75), Loot.item(Items.ThrowingKnife, 70, 150),
					Loot.item(Items.Aglet), Loot.item(Items.ClimbingClaws), Loot.item(Items.Umbrella), Loot.item(Items.GuideToPlantFiberCordage),
					Loot.item(Items.WandOfSparking), Loot.item(Items.Radar), Loot.item(Items.StepStool), Loot.item(Items.Aglet)
			), 
			Loot.group(3, 10, Items.CopperBar, Items.TinBar, Items.IronBar, Items.LeadBar),
			LootPotions.forestPotions(1, 2).c(.75), 
			Loot.group(Loot.item(Items.HerbBag, 1, 4), Loot.item(Items.CanOfWorms, 1, 4)).c(.15), 
			Loot.group(Loot.item(Items.Grenade, 3, 5), Loot.item(Items.WoodenArrow, 25, 50), Loot.item(Items.Shuriken, 25, 50)).c(.66), 
			Loot.group(Loot.item(Items.Torch, 10, 20), Loot.item(Items.Glowstick, 40, 75), Loot.item(Items.Rope, 50, 100)).c(.66), 
			Loot.group(Loot.item(Items.LesserHealingPotion, 3, 5), Loot.item(Items.RecallPotion, 1, 3)).c(.5), 
			Loot.item(Items.Wood, 50, 100).c(.5)
			),
	jungleChestLoot: Loot.of(
			Loot.group(
					Loot.item(Items.FlowerBoots),
					Loot.item(Items.StaffOfRegrowth),
					Loot.item(Items.Glowstick, 40, 75), Loot.item(Items.PoisonedKnife, 70, 150),
					Loot.item(Items.HoneyDispenser), Loot.item(Items.BeeMinecart), Loot.item(Items.LivingMahoganyWand), Loot.item(Items.RichMahoganyLeafWand)
			),
			Loot.group(3, 10, Items.CopperBar, Items.TinBar, Items.IronBar, Items.LeadBar),
			Loot.group(1, 2, Items.AmmoReservationPotion, Items.BuilderPotion, Items.InvisibilityPotion, Items.ManaRegenerationPotion, Items.MagicPowerPotion, Items.SpelunkerPotion, Items.SummoningPotion
			).c(.75), 
			Loot.group(Loot.item(Items.HerbBag, 1, 4), Loot.item(Items.CanOfWorms, 1, 4)).c(.15), 
			Loot.group(Loot.item(Items.Grenade, 3, 5), Loot.item(Items.PoisonedKnife, 25, 50), Loot.item(Items.PoisonedKnife, 25, 50)).c(.66), 
			Loot.group(Loot.item(Items.JungleTorch, 10, 20), Loot.item(Items.Glowstick, 40, 75), Loot.item(Items.Rope, 50, 100)).c(.66), 
			Loot.group(Loot.item(Items.LesserHealingPotion, 3, 5), Loot.item(Items.RecallPotion, 1, 3)).c(.5)
			),
	desertChestLoot: Loot.of(
			Loot.group(
					Loot.item(Items.DesertMinecart), 
					Loot.item(Items.EncumberingStone), 
					Loot.item(Items.SnakeCharmersFlute), 
					Loot.item(Items.BoneThrowingKnife, 35, 75)
			),
			Loot.group(3, 10, Items.CopperBar, Items.TinBar, Items.IronBar, Items.LeadBar),
			LootPotions.desertPotions(1, 2).c(.75), 
			Loot.group(Loot.item(Items.Grenade, 3, 5), Loot.item(Items.BoneThrowingKnife, 25, 50), Loot.item(Items.BoneThrowingJavelin, 25, 50)).c(.66), 
			Loot.group(Loot.item(Items.DesertTorch, 10, 20), Loot.item(Items.Rope, 50, 100)).c(.66), 
			Loot.group(Loot.item(Items.LesserHealingPotion, 3, 5), Loot.item(Items.RecallPotion, 1, 3)).c(.5)
			),
	
	snowChestLoot: Loot.of(
			Loot.group(
					Loot.item(Items.FlurryBoots), Loot.item(Items.IceMachine), Loot.item(Items.Extractinator), Loot.item(Items.IceMirror), 
					Loot.item(Items.ThrowingKnife, 70, 150),Loot.item(Items.StickyGlowstick, 70, 150)
			),
			Loot.group(3, 10, Items.CopperBar, Items.TinBar, Items.IronBar, Items.LeadBar),
			LootPotions.snowPotions(1, 2).c(.75), 
			Loot.group(Loot.item(Items.Grenade, 3, 5), Loot.item(Items.StickyGlowstick, 40, 75)).c(.66), 
			Loot.group(Loot.item(Items.IceTorch, 10, 20), Loot.item(Items.Rope, 50, 100)).c(.66), 
			Loot.group(Loot.item(Items.LesserHealingPotion, 3, 5), Loot.item(Items.RecallPotion, 1, 3)).c(.5)
			),
	
	spiderChestLoot: Loot.of(
			Loot.item(Items.WebSlinger),
			Loot.group(3, 10, Items.CopperBar, Items.TinBar, Items.IronBar, Items.LeadBar),
			Loot.group(1, 2, Items.BuilderPotion, Items.EndurancePotion, Items.FeatherfallPotion, Items.GravitationPotion, Items.HunterPotion, Items.MiningPotion, Items.NightOwlPotion, Items.SpelunkerPotion, Items.SwiftnessPotion, Items.TeleportationPotion
			).c(.75), 
			Loot.group(Loot.item(Items.Grenade, 3, 5), Loot.item(Items.StickyGlowstick, 40, 75)).c(.66), 
			Loot.group(Loot.item(Items.IceTorch, 10, 20), Loot.item(Items.Rope, 50, 100)).c(.66), 
			Loot.group(Loot.item(Items.LesserHealingPotion, 3, 5), Loot.item(Items.RecallPotion, 1, 3)).c(.5)
			),
	
	mushroomChestLoot: Loot.of(
			Loot.group(Items.ShroomMinecart, Items.MushroomHat, Items.MushroomPants, Items.MushroomVest),
			Loot.group(3, 10, Items.CopperBar, Items.TinBar, Items.IronBar, Items.LeadBar),
			Loot.group(1, 2, Items.BuilderPotion, Items.EndurancePotion, Items.FeatherfallPotion, Items.GravitationPotion, Items.HunterPotion, Items.MiningPotion, Items.NightOwlPotion, Items.SpelunkerPotion, Items.SwiftnessPotion, Items.TeleportationPotion
			).c(.75), 
			Loot.group(Loot.item(Items.Grenade, 3, 5), Loot.item(Items.StickyGlowstick, 40, 75)).c(.66), 
			Loot.group(Loot.item(Items.LesserHealingPotion, 3, 5), Loot.item(Items.RecallPotion, 1, 3)).c(.5)
			),

	// Towers
	forestTowerLoot: Loot.of(
			Loot.group(Items.BandOfRegeneration, Items.MagicMirror, Items.CloudInABottle, Items.HermesBoots, Items.EnchantedBoomerang, Items.ShoeSpikes, Items.FlareGun, Items.Mace, Items.Extractinator, Items.Starfury, Items.ShinyRedBalloon, Items.CelestialMagnet),
			Loot.group(3, 15, Items.IronBar, Items.LeadBar, Items.Glowstick, Items.Torch, Items.Bomb),
			LootPotions.forestPotions(1, 3).c(.75),
			Loot.group(Loot.item(Items.Shuriken, 75, 100), Loot.item(Items.ThrowingKnife, 150, 175), Loot.item(Items.Grenade, 5,10), Loot.item(Items.WoodenArrow, 50, 75)),
			Loot.item(Items.Dynamite).c(.5),
			Loot.item(Items.RecallPotion, 1, 3).c(.5),
			Loot.item(Items.SuspiciousLookingEye).c(.125),
			Loot.item(Items.Rope, 50, 100).c(.5)
			),

	snowTowerLoot: Loot.of(
			Loot.group(Items.IceBoomerang, Items.IceBlade, Items.IceSkates, Items.SnowballCannon, Items.BlizzardInABottle, Items.IceMirror),
			Loot.group(3, 15, Items.IronBar, Items.LeadBar, Items.StickyGlowstick, Items.IceTorch, Items.Bomb),
			LootPotions.snowPotions(1, 3).c(.75),
			Loot.group(Loot.item(Items.Shuriken, 75, 100), Loot.item(Items.ThrowingKnife, 150, 175), Loot.item(Items.Grenade, 5,10), Loot.item(Items.FrostburnArrow, 25, 50)),
			Loot.item(Items.Dynamite).c(.5),
			Loot.item(Items.RecallPotion, 1, 3).c(.5),
			Loot.item(Items.SuspiciousLookingEye).c(.125),
			Loot.item(Items.Rope, 50, 100).c(.5)
			),
			
	desertTowerLoot: Loot.of(
			Loot.group(Items.StormSpear, Items.ThunderZapper, Items.SnakeCharmersFlute, Items.AncientChisel, Items.DuneriderBoots, Items.BastStatue),
			Loot.group(3, 15, Items.GoldBar, Items.PlatinumBar, Items.DesertTorch, Items.ScarabBomb),
			LootPotions.desertPotions(1, 3).c(.75),
			Loot.group(Loot.item(Items.BoneThrowingKnife, 50, 75), Loot.item(Items.BoneThrowingJavelin, 50, 75)),
			Loot.item(Items.Dynamite).c(.5),
			Loot.item(Items.RecallPotion, 1, 3).c(.5),
			Loot.item(Items.SuspiciousLookingEye).c(.125),
			Loot.item(Items.Rope, 50, 100).c(.5)
			),
	
	jungleTowerLoot: Loot.of(
			Loot.group(Items.FeralClaws, Items.AnkletOfTheWind, Items.Boomstick),
			Loot.group(3, 15, Items.SilverBar, Items.TungstenBar, Items.JungleTorch, Items.Glowstick),
			LootPotions.junglePotions(1, 3).c(.75),
			Loot.group(Loot.item(Items.Grenade, 5,10), Loot.item(Items.PoisonedKnife, 50, 75)),
			Loot.item(Items.Dynamite).c(.5),
			Loot.item(Items.RecallPotion, 1, 3).c(.5),
			Loot.item(Items.SuspiciousLookingEye).c(.125),
			Loot.item(Items.Rope, 50, 100).c(.5)
			),
	
	hellTowerLoot: Loot.of(
			Loot.group(Items.Sunfury, Items.FlowerOfFire, Items.UnholyTrident, Items.Flamelash, Items.DarkLance, Items.HellwingBow, Items.DemonicHellcart, Items.TreasureMagnet, Items.LavaCharm),
			LootPotions.hellPotions(2, 4).c(.75),
			Loot.item(Items.MeteoriteBar, 10,15),
			Loot.item(Items.PotionOfReturn, 3, 7).c(.75)
			),
}
