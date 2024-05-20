var lang = navigator.language || navigator.userLanguage;
// let blob = null;
// fetch(`http://127.0.0.1:8000/world`).then(response => response.blob().then(b => {blob=b;console.log(b)}));
const bungle = {
	title:			{en:"Terraria flying islands generator", 				ru:'Генератор летающих островов для Террарии'},
	askme:			{en:"Ask me in ", 				ru:'Задай вопрос в личку '},
	donate: 		{en:"Support me in", 			ru:'Поддержать меня '},

	worldname:		{en:"Flying islands", 			ru:'Летающие острова'},
	loading: 		{en:"Loading", 					ru:'Загрузка'},
	distribution: 	{en:"Distribution", 			ru:'Распределение'},
	baseislands: 	{en:"Creating islands", 		ru:'Создание островов'}, 
	hives: 			{en:"Creating hives", 			ru:'Создание ульев'},
	honey: 			{en:"Аilling with honey", 		ru:'Заполнение медом'},
	phyramid: 		{en:"Creating pyramids", 		ru:'Укладка пирамиды'},
	jungletmple: 	{en:"Luring the lizards", 		ru:'Заманивание ящериц'},
	towers: 		{en:"Building towers", 			ru:'Строительство башен'},
	dirt: 			{en:"Grounding", 				ru:'Заземление'},
	dungeon: 		{en:"Collecting the bones",		ru:'Сбор костей'},
	grass: 			{en:"Planting plants",			ru:'Посадка растений'},
	ores: 			{en:"Gilding of stones",		ru:'Золочение камней'},
	orbs: 			{en:"Inflating the orbs",		ru:'Надувание сфер'},
	macrostructures:{en:"Setting up the lanterns",	ru:'Расстановка фонарей'},
	waterfalls:		{en:"Watering the world",		ru:'Поливаем мир'},
	fixing:			{en:"Fixing the world",			ru:'Подправляем мир'},
	saving:			{en:"Creaing file",				ru:'Создание файла'},
	create: 		{en:"Create", 					ru:'Создать'},

	name:			{en:"Name: ", 					ru:'Название: '},
	seed:			{en:"Seed: ",					ru:'Семечко: '},

	small:			{en:"Small",					ru:'Маленький'},
	medium:			{en:"Medium",					ru:'Средне'},
	large:			{en:"Large",					ru:'Большой'},

	jounery:		{en:"Jounery",					ru:'Путешествие'},
	classic:		{en:"Classic",					ru:'Классика'},
	expert:			{en:"Expert",					ru:'Эксперт'},
	master:			{en:"Master",					ru:'Мастер'},

	random:			{en:"Random",					ru:'Случайно'},
	corruption:		{en:"Corruption",				ru:'Порча'},
	crimsone:		{en:"Crimsone",					ru:'Багрянец'},

	generationupdatedon: 	{en:"Generation has been updated by ",					ru:'Генерация обновлена на '},
	spoilerwarn: 			{
		en:'All structures have been updated too\n Pyramid, skeletron dungeon, jungle temple, beehives, nests, etc\n\n Do not scroll through the page below if you do not want spoilers (for more "wow effect")',
		ru:'Все структуры так же обновлены:\n пирамида, подземелье скелетрона, храм джунглей, ульи, гнезда и др\n\nне пролистывайте страницу ниже если не хотите спойлеров (для большего "вау-эффекта")'
	},

	generation: 		{en:"Generating", ru:"Генерация"},
	aspawn: {
		en: `The world consists of many flying islands, of various shapes and sizes, their shape depends on the biome.`,
		ru: `Мир состоит из множества летающих островов, различных форм и размеров\nИх форма зависит от биома.`
	},
	aphyramid: {
		en: `The pyramid is now much more spacious and beautiful and also contains all types of loot (Sandstorm in a bottle, flying carpet and a pharaoh's set)`,
		ru: `Пирамида теперь намного просторнее и красивее, а также содержит все виды лута (Буря в бутылке, ковер-самолет и одеяние фараона).`
	},
	adungeon: {
		en: `Skeletron's dungeon is divided into sub-biomes, each in its own style. Also dungeon has a arena`,
		ru: `Подземелье Скелетона разделено на подбиомы, А еще подземелье имеет готовую арену`
	},
	ajungletmple: {
		en: `The jungle Temple has a structure of passes`,
		ru: `Храм джунглей имеет другую структуру проходов`,
	}
};

let generator = undefined;

window.onload = function() {
	generator = new Worker("generator.js");
	generator.addEventListener("message", function(e) {
		if(e.data.name == 'progress') {
			setProgress(e.data.precents);
		} else if(e.data.name == 'mark') {
			setLabel(e.data.mark);
		} else if(e.data.name == 'download-link') {
			setProgress(100);
			if(e.data.error) {
			   console.error("Download error: ", e.data.error);
			} else {
				const link = document.createElement("a");
				link.download = "world.wld";
				link.href = e.data.link;
				link.click();
				document.getElementById('world-select').style.display = 'flex';
				document.getElementById('world-generating').style.display = 'none';
			}
		} else {
			console.error("Unknown message:", e.data.name);
		}
	});

	config(null, 'small');
	let seed = new Random().nextLong();
	document.getElementById('seed').setAttribute("value", seed);
	configs.seed = seed;
	document.getElementById('name').setAttribute("value", text('worldname'));

	document.getElementById('name').oninput = e => {
		console.log(e);
		configs.name = document.getElementById('name').value;
	};

	document.getElementById('seed').oninput = e => {
		console.log(e);
		configs.seed = document.getElementById('seed').value;
	};

	for (let e of document.getElementsByTagName('*')) {
		if(e.getAttribute('text') == null) continue;
		for (let t of text(e.getAttribute("text")).split('\n')) {
			e.append(t);
			e.append(document.createElement('br'));
		}
	}
	document.title = text('title');
}

function setLabel(mark) {
	if(mark == null) {
		document.getElementById('mark').textContent = "";
		return;
	}
	let b = mark.replaceAll(" ", '').toLowerCase();
	let bung = bungle[b];
	if(bung == undefined) {
		document.getElementById('mark').textContent = b;
	} else {
		let text = bung[lang];
		if(text == undefined) text = bung.en;
		if(text == undefined) text = mark;
		document.getElementById('mark').textContent = text;
	}
}

function text(mark) {
	if(mark == null) return "";
	let b = mark.replaceAll(" ", '').toLowerCase();
	let bung = bungle[b];
	if(bung == undefined) return b;
	let text = bung[lang];
	if(text == undefined) text = bung.en;
	if(text == undefined) text = mark;
	return text;
}

function setProgress(value) {
	document.getElementById('progress').style.width = `${value}%`;

	//setAttribute("value", value);
}

let configs = {
	name: text('worldname'),
	width: 	4200,
	height: 1200,
	mode: 1,
	evil: 'corruption'
};

function config(e, arg) {
	// world size
	if(arg == 'small') {
		configs.width = 4200;
		configs.height = 1200;
	}
	if(arg == 'medium') {
		configs.width = 6400;
		configs.height = 1800;
	}
	if(arg == 'large') {
		configs.width = 8400;
		configs.height = 2400;
	}
	// game mode
	if(arg == 'jounery') 	configs.mode = 3;
	if(arg == 'classic') 	configs.mode = 0;
	if(arg == 'expert') 	configs.mode = 1;
	if(arg == 'master') 	configs.mode = 2;

	if(arg == 'random') 	configs.evil = undefined;
	if(arg == 'corruption') configs.evil = 'corruption';
	if(arg == 'crimsone') 	configs.evil = 'crimsone';

	if(e != undefined && e != null) for (let a of e.parentElement.children) {
		a.setAttribute("selected", a==e?'1':'0');
	}
}


// let progress = 0;
// setInterval(function() {
// 	setProgress(progress+=10);
// 	progress %= 100;
// }, 1000 / 5);

function create() {
	setProgress(0);
	document.getElementById('world-select').style.display = 'none';
	document.getElementById('world-generating').style.display = 'flex';
	setLabel('loading');
    generator.postMessage({name:"create", config:configs});
}