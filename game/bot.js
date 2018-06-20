'use strict';
//importe discord +fs(file system)
const Discord = require("discord.js");
var bot = new Discord.Client();

//importe les fichier du rpg
const rpg = require("./rpg.js")


//config
const prefix = "/";
const token = "MjE5MjU0Mjg2NTgyODA4NTc2.DI1e3g.gSdaFb_9taDCOJ0HO7MXiT6qH0w";
bot.login(token);


//les message 
bot.on('message', mes => {
	var resu = mes.content.toLowerCase();
	if (resu.startsWith("/rpg")) {
		rpg.cmd(mes, resu.substring(5));
	}
	//pour le sel et lequipment pour le moment limite a 30 pour tous les user
	if (resu < 30 && resu >= 0)
		rpg.choix(mes, resu);

	//pour acheter depuis le mag
	if (resu < 30 && resu >= 0)
		rpg.buy(mes, resu);
	
});