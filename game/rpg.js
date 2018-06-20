//pour acceder a mon json blob

var options = {
  "method": "PUT",
  "hostname":"jsonblob.com",
  "path":"/api/jsonBlob/b3232b4d-2229-11e8-b7b9-51f8982918cc",
  "headers": {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};



const fs = require("fs");

//importe le fichier utilisateur et enrengstre sur eux
var joueur = {};
var joueurs = fs.readFileSync("./user.json");
joueur = JSON.parse(joueurs);


//improte le fichier du boss
const boss = require("./boss.json");

//importe le fichier des combat en cour et enregistre sur lui
var battle = {};
var battles = fs.readFileSync("./battle.json");
battle = JSON.parse(battles);
//pour les chois
var ok = false;
var ty = "";
var use = {};//ce qui utilise la cmd il yaure le temp + type
var funtim = {}//pour les setTimeout de joueur
//importe le fichier des lvl
const lvl = require("./lvl.json");

//importe le fichier des item
const item = require("./item.json");

//importe le magasin pour le achette
const shop = require("./shop.json");

var commands = [

	//1er cmd fini

	{
		command: "attaque",
		description: "attaque le monstre <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id])
				if (battle[mes.author.id].battle)
					combat(mes, "attaque");
				else
					mes.reply("vous nete pas en battle faite /rpg battle");
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
	},

	//2er cmd fini

	{
		command: "xp",
		description: "recois 200 xp par jour <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id]) {
				var date = new Date();
				//dure 1 jour
				if (joueur[mes.author.id].time.xptime + 86400000<= date.getTime()) {
					joueur[mes.author.id].time.xptime=date.getTime();
					joueur[mes.author.id].xp+=200;
					mes.channel.send(`${mes.author.username} a recu 200 xp`);
					lvlup(mes);
					data2 = JSON.stringify(joueur, null, 2);
					fs.writeFile("user.json", data2);
				}
				else{
					let datexp = new Date(joueur[mes.author.id].time.xptime);
					let interval = 86400000 - (date - datexp);
					let heur = Math.floor(interval / 3600000);
					let minute = Math.floor((interval - heur * 3600000) / 60000);
					let seconde = Math.floor((interval - heur * 3600000 - minute * 60000) / 1000);;
					mes.channel.send(`il te reste ${heur} heur et ${minute} minute et ${seconde} seconde`);}
			}
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
	},

	//3er cmd en cour

	{
		command: "equipment",
		description: "voir son equipment et sequipe /rpg equipment help<fini>",
			execute: function (mes) {
				if (joueur[mes.author.id]) {
					let user = mes.author.id;
					let phrase = mes.content.split(" ");
					if (phrase[2] == "view" && phrase.length == 3) {
						mes.reply(`vous ete equipez de:\ntete: \`${item[joueur[mes.author.id].equipment.tete].nom}\` \ncorp: \`${item[joueur[mes.author.id].equipment.corp].nom}\` \nbras: \`${item[joueur[mes.author.id].equipment.bras].nom}\` \njambe: \`${item[joueur[mes.author.id].equipment.jambe].nom}\` \narme: \`${item[joueur[mes.author.id].equipment.arme].nom}\` `);
					}
					if (phrase[2] == "arme" && phrase.length == 3) { equip(mes, "arme",user); }
					if (phrase[2] == "tete" && phrase.length == 3) { equip(mes, "tete",user); }
					if (phrase[2] == "corp" && phrase.length == 3) { equip(mes, "corp",user); }
					if (phrase[2] == "bras" && phrase.length == 3) { equip(mes, "bras",user); }
					if (phrase[2] == "jambe" && phrase.length == 3) { equip(mes, "jambe",user); }
					if (phrase[2] == "help" && phrase.length == 3) { mes.channel.send("vous avez apre /rpg equipe +\t view\tarme \ttete \tcorp\tbras\tjambe"); }
				}
				else
					mes.reply("cree un compte avec la cmd /rpg create");
			}
	},

	//4er cmd fini

	{
		command: "inventaire",
		description: "voir son inventaire <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id]) {
				mes.reply("dans votre inventaire il ya");
				if (joueur[mes.author.id].item.length == 0)
					mes.channel.send("rien");
				else {
					let tous = "";
					for (let i = 0; i < joueur[mes.author.id].item.length; i++)
						if (item[joueur[mes.author.id].item[i]])
							tous += "solt " + i + "-->" + item[joueur[mes.author.id].item[i]].nom + "\n";
						else
							tous += "solt " + i + "--> comming song \n"
					mes.channel.send(tous);
				}
			}
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
	},

	//5er cmd

	{
		command: "mine",
		description: "??????",
		execute: function (mes) {
			mes.channel.send("en cour cmd 5");
		}
	},

	//6eme cmd fini

	{
		command: "or",
		description: "voire son argent <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id])
				mes.reply("vous avez \`\`\`" + joueur[mes.author.id].or + "$\`\`\`");
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
	},

	//7eme cmd

	{
		command: "craft",
		description: "cree des objet a partire des item<en cour>",
		execute: function (mes) {
			mes.channel.send("en cour cmd 7");
		}
	},

	//8eme cmd

	{
		command: "stat",
		description: "voir les info sur les equipment <en cour>",
		execute: function (mes) {
			mes.channel.send("en cour cmd 8");
		}
	},

	//9eme cmd  fini

	{
		command: "battle",
		description: "pour ce battre vs un boss <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id]) {
				if (battle[mes.author.id].battle==true)
					mes.channel.send("vous ete deja on combat");
				else {
					let monster = Math.floor((Math.random() * 3) + 1);
					if (boss[monster])
					{
						battle[mes.author.id].battle = true;
						battle[mes.author.id].boss_hp = boss[monster].hp;
						battle[mes.author.id].user_hp = joueur[mes.author.id].stat.hp;
						battle[mes.author.id].id_boss = monster;
						let data2 = JSON.stringify(battle, null, 2);
						fs.writeFile("battle.json", data2);
						mes.channel.send("vous entre en combat contre " + boss[monster].nom + " et son lvl " + boss[monster].lvl);
					}
					else
					mes.channel.send("comming song veuille reillesier avec /rpg battle");
				}
			}
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
	},

	//10eme cmd
	{
		command: "buy",
		description: "acheter des truk au magasin<fini>",
		execute: function (mes) {
			if (joueur[mes.author.id])
				if (!use[mes.author.id]) {
					if (joueur[mes.author.id].item.length < 30) {
						let txt = "";
						for (let i in shop)
							txt += "solt:" + i + " tu a:" + item[shop[i]].nom + " et il cout " + item[shop[i]].buy+"$\n";
						mes.channel.send(txt);
						mes.channel.send("et ton argent est de "); commands[5].execute(mes);
						ok = true;
						ty = "buy";
						var me = mes.author.id;
						use[me] = { time: true, type: ty };
						mes.channel.send("tu a 30 seconde");
						funtim[me] = { exucute: setTimeout(function () { ok = false; use[(mes.author.id)].time = false; ty = ""; funtim[mes.author.id].time = false; mes.reply("temp ecoule"); clear(); }, 30000), time: true };
					}
					else
						mes.channel.send("ton inventaire est deja full vide le");
				}
				else
					mes.channel.send("tu fais deja un truk");
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
		},
	//11eme cmd
	{
		command: "sell",
		description: "vendre des truk qui ce trouve dans linventaire <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id])
				if (!use[mes.author.id]) {
					if (joueur[mes.author.id].item.length > 0) {
						commands[3].execute(mes);
						ok = true;
						ty = "sell";
						var me = mes.author.id;
						use[me] = { time: true, type: ty };
						mes.channel.send("tu a 30 seconde");
						funtim[me] = { exucute: setTimeout(function () { ok = false; use[(mes.author.id)].time = false; ty = ""; funtim[mes.author.id].time = false; mes.reply("temp ecoule"); clear(); }, 30000), time: true };
					}
					else
						mes.channel.send("tu a rien dans ton inventaire");
					}
					else
						mes.channel.send("tu fais deja un truk(le temps nai pas termine)");
		else
			mes.reply("cree un compte avec la cmd /rpg create");
		}
	},
	//12eme cmd  fini
	{
		command: "status",
		description: "voir son statut <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id])
				mes.reply(`\`\`\`votre status est: \nhp:${joueur[mes.author.id].stat.hp} \nlvl:${joueur[mes.author.id].lvl}\t\t\t\t\t\t\t\txp:${joueur[mes.author.id].xp}/${lvl[joueur[mes.author.id].lvl]} \nattack:${joueur[mes.author.id].stat.atk}+(${item[joueur[mes.author.id].equipment.arme].atk}) \ndefence:${joueur[mes.author.id].stat.dfn}+(${item[joueur[mes.author.id].equipment.tete].dfn + item[joueur[mes.author.id].equipment.corp].dfn + item[joueur[mes.author.id].equipment.bras].dfn + item[joueur[mes.author.id].equipment.jambe].dfn}) \`\`\``);
			else
				mes.reply("cree un compte avec la cmd /rpg create");
		}
	},
	//13eme cmd  fini
	{
		command: "create",
		description: "cree un compte <fini>",
		execute: function (mes) {
			if (joueur[mes.author.id])
				mes.reply("vous avez deja un compte");
			else {
				joueur[mes.author.id] = { xp: 0, lvl: 1, or: 0, equipment: { tete: 0, corp: 0, bras: 0, jambe: 0, arme: 0 }, time: { xptime: 0 }, item: [], stat: { hp: 100, atk: 5, dfn: 6 } };
				let data2 = JSON.stringify(joueur, null, 2);
				fs.writeFile("user.json", data2);
				battle[mes.author.id] = { battle: false, boss_hp:0,user_hp:0, id_boss:0};
				data2 = JSON.stringify(battle, null, 2);
				fs.writeFile("battle.json", data2);
				mes.reply("user add avec succes!");
			}
		}
	},

	//14eme cmd

	{
		command: "help",
		description: "affiche toute les cmd avec leur discription<fini>",
		execute: function (mes) {
			let tous = "";
			for (let i = 0; i < commands.length; i++)
				tous += `${commands[i].command} --> ${commands[i].description}\n`;
			mes.channel.send(tous);
		}
	}
]
//les fonction qui sont assosier avec les cmd



//cette fonction cherche si la cmd exisiste
function recherche_cmd(mes, cmd) {
	for (let i = 0; i < commands.length; i++) {
		if (cmd == commands[i].command) {
			return commands[i];
		}
	}
	return false;
}

//pour lire les cmd
this.cmd = function (mes, text) {
	let parm = text.split(" ");
	let cmd = recherche_cmd(mes, parm[0]);
	if (cmd)
		cmd.execute(mes);
	else
		mes.channel.send("pour laide fait /rpg help");
}




//fonction de combat

function combat(mes) { //act ->cest laction defence ou attaque
	let atkt = joueur[mes.author.id].stat.atk + item[joueur[mes.author.id].equipment.arme].atk;//attaque total du joueur stat + son equipment
	let deft = joueur[mes.author.id].stat.dfn + item[joueur[mes.author.id].equipment.tete].dfn + item[joueur[mes.author.id].equipment.corp].dfn + item[joueur[mes.author.id].equipment.bras].dfn + item[joueur[mes.author.id].equipment.jambe].dfn;//defence total du joueur stat +son equipment
	let dega_donne;
	let dega_recu;
	let tous = "";
	let win;//si le joue a gg ou perdu
	while (battle[mes.author.id].boss_hp > 0 && battle[mes.author.id].user_hp) {
		dega_donne = atkt - boss[battle[mes.author.id].id_boss].dfn > 0 ? atkt - boss[battle[mes.author.id].id_boss].dfn : 0;
		battle[mes.author.id].boss_hp = battle[mes.author.id].boss_hp - dega_donne > 0 ? battle[mes.author.id].boss_hp - dega_donne:0;
		tous += mes.author.username +" a donne " + dega_donne + " dega et le boss lui reste " + battle[mes.author.id].boss_hp + "\n";
		//si le monstre a 0hp donc ko
		if (battle[mes.author.id].boss_hp <= 0) {
			break;
		}
		else {
			dega_recu = boss[battle[mes.author.id].id_boss].atk - deft * 0.5 > 0 ? boss[battle[mes.author.id].id_boss].atk - deft * 0.5 : 0;
			battle[mes.author.id].user_hp = battle[mes.author.id].user_hp - dega_recu > 0 ? battle[mes.author.id].user_hp - dega_recu:0;
			tous += mes.author.username +" a recu " + dega_recu + " dega et il te reste " + battle[mes.author.id].user_hp+"\n";
		}
	}
	mes.channel.send(tous);
	//pour if he win or lose
	if (battle[mes.author.id].boss_hp > 0 && battle[mes.author.id].user_hp <= 0) {
		win = false;
		mes.reply("dsl tu a perdu game over");
		battle[mes.author.id].battle = false;
	}
	 if (battle[mes.author.id].boss_hp <= 0 && battle[mes.author.id].user_hp > 0){
		win = true;
		mes.reply("GG tu a battue le boss");
		battle[mes.author.id].battle = false;
	}
	//pour enrengistre les donne de la bataille
	let data2 = JSON.stringify(battle, null, 2);
	fs.writeFile("battle.json", data2);
	//pour les prix +passage de lvl
	if (win) {
		//pour les drop
		let tabdrop = [];
		let txt = "";
		let con = 0;

		for (let i in boss[battle[mes.author.id].id_boss].drop)
			if (Math.random() >= 1 - ((boss[battle[mes.author.id].id_boss].drop[i])/100))
				tabdrop.push(i);
			//pour affiche ce quil a drope + add chez lutilisateur
			for (let i = 0; i < tabdrop.length; i++)
			{
				if (joueur[mes.author.id].item.length<30) {
					txt += item[tabdrop[i]].nom + " +\t";
					joueur[mes.author.id].item.push(parseInt(tabdrop[i]));
				}
				else {
					mes.channel.send("votre inventaire est full");
					break;
				}
			}
		if(txt)
		mes.channel.send("tu a drope "+txt);


		//pour les xp et or
		joueur[mes.author.id].xp += boss[battle[mes.author.id].id_boss].xp;
		joueur[mes.author.id].or += boss[battle[mes.author.id].id_boss].or;
		lvlup(mes);
		data2 = JSON.stringify(joueur, null, 2);
		fs.writeFile("user.json", data2);
	}
}





//fonction pour utilise et sequipe dequipment
function equip(mes, type, user) {
	let all = "";
	//afficher les type darme
	for (let i = 0; i < joueur[mes.author.id].item.length; i++)
	{
		if (item[joueur[mes.author.id].item[i]].type == type)
			all += `solt ${i}-->${item[joueur[mes.author.id].item[i]].nom}\n`
	}
	if (all) {
		mes.channel.send(all);
		if (!use[(mes.author.id)]) {
			ok = true;
			ty = type;
			var me = mes.author.id;
			use[me] = { time: true, type: type };
			mes.channel.send("tu a 30 seconde");
			funtim[me] = { exucute: setTimeout(function () { ok = false; use[(mes.author.id)].time = false; ty = ""; funtim[mes.author.id].time = false; mes.reply("temp ecoule"); clear(); }, 30000), time: true };
		}
		else
			mes.channel.send("le temps nai pas fini");
	}
	else
		mes.channel.send("ya pas ce type dequipment dans ton inventaire dsl");
}

//function qui fais passe les lvl
function lvlup(mes){
var xp=true;
while (xp)
			if (joueur[mes.author.id].xp >= lvl[joueur[mes.author.id].lvl]) {
				joueur[mes.author.id].xp -= lvl[joueur[mes.author.id].lvl];
				joueur[mes.author.id].stat.atk += Math.floor((Math.random() * 5) + 1);//ajoute de 1 a 5
				joueur[mes.author.id].stat.dfn += Math.floor((Math.random() * 5) + 1);//ajoute de 1 a 5
				joueur[mes.author.id].stat.hp += Math.floor((Math.random() * 26) + 25);//ajoute de 25 a 50
				joueur[mes.author.id].lvl += 1;
				mes.reply('lvl up');
			}
			else
				xp = false;
}


//fonction pour les choix
this.choix = function (mes, choix) {
	if (use[mes.author.id])
		if (use[mes.author.id].time) {
			if (item[joueur[mes.author.id].item[choix]]) {
				if (ty == item[joueur[mes.author.id].item[choix]].type || ty == "sell") {
					ok = false;
					let per;
					switch (ty) {
						//pour larme
						case "arme":
							per = joueur[mes.author.id].equipment.arme;
							joueur[mes.author.id].equipment.arme = joueur[mes.author.id].item[choix];
							change(mes.author.id, per, choix)
							break;
						case "tete":
							per = joueur[mes.author.id].equipment.tete;
							joueur[mes.author.id].equipment.tete = joueur[mes.author.id].item[choix];
							change(mes.author.id, per, choix)
							break;
						case "corp":
							per = joueur[mes.author.id].equipment.corp;
							joueur[mes.author.id].equipment.corp = joueur[mes.author.id].item[choix];
							change(mes.author.id, per, choix)
							break;
						case "bras":
							per = joueur[mes.author.id].equipment.bras;
							joueur[mes.author.id].equipment.bras = joueur[mes.author.id].item[choix];
							change(mes.author.id, per, choix)
							break;
						case "jambe":
							per = joueur[mes.author.id].equipment.jambe;
							joueur[mes.author.id].equipment.jambe = joueur[mes.author.id].item[choix];
							change(mes.author.id, per, choix)
							break;
						case "sell":
							joueur[mes.author.id].or += item[joueur[mes.author.id].item[choix]].sell;
							joueur[mes.author.id].item[choix] = 0;
							for (var i = joueur[mes.author.id].item.length - 1; i >= 0; i--)
								if (joueur[mes.author.id].item[i] == 0)
									joueur[mes.author.id].item.splice(i, 1);
							break;
					}

					if (ty == "arme" || ty == "tete" || ty == "corp" || ty == "bras" || ty == "jambe")
						mes.channel.send("ton arme a ete bien equipe");
					else if(ty=="sell")
						mes.channel.send("objet vendu avec succes");
						ty = "";
						clearTimeout(funtim[mes.author.id].exucute);
						ok = false; use[(mes.author.id)].time = false; ty = ""; funtim[mes.author.id].time = false; clear();
						var data2 = JSON.stringify(joueur, null, 2);
						fs.writeFile("user.json", data2);

				}

				else if (ok && ty!="buy") mes.channel.send("cest pas le bon equipment");

		}
			else if(ty!="buy" && ok) mes.channel.send("tu a rien ici");
		}
}
//pour lechange darme
function change(user, equipe, choix) {
	joueur[user].item[choix] = equipe;
	for (var i = joueur[user].item.length - 1; i >= 0; i--)
		if (joueur[user].item[i] == 0)
			joueur[user].item.splice(i, 1);

}
//pour achete depuis le mag
this.buy = (mes, choix) => {
	if (ty == "buy" && shop[choix]) {
		ok = false;
		if (joueur[mes.author.id].or >= item[shop[choix]].buy) {
			joueur[mes.author.id].or -= item[shop[choix]].buy;
			joueur[mes.author.id].item.push(parseInt(shop[choix]));
			mes.channel.send("objet acheter avec succes");
		} else {
			ty = "";
			mes.channel.send("tu a pas pas trop dargent");
		}
		clearTimeout(funtim[mes.author.id].exucute);
		ok = false; use[(mes.author.id)].time = false; ty = ""; funtim[mes.author.id].time = false; clear();
		if (ty) {
			var data2 = JSON.stringify(joueur, null, 2);
			fs.writeFile("user.json", data2);
			ty = "";
		}
	}
		else if(ok&&ty=="buy")
			mes.channel.send("dans cette case ya pas de item a achete");
	}


//function pour netoille
function clear() {
	var use2 = {};
	for (let i in use) {
		if (use[i].time)
			use2[i] = use[i];
		use = use2;
}}

//chaque 10 seconde sa se nettoi des attente (settimeout)
setInterval(function () {
	var use2 = {};
	for (let i in funtim)
	{
		if (funtim[i].time)
			use2[i] = funtim[i];
		funtim = use2;
	}

}, 10000);
