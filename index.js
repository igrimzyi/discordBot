const { Client, Intents } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = 'OTA4ODU5ODUyOTMwMDM5ODI5.YY73sg.D_7WTD3sXKKCa_vUEb4usCbtm6s';

giveMeAJoke.getRandomDadJoke(function(joke){
 console.log(joke);
})

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message' , msg =>{
    if (msg.content === "obunga"){
        msg.reply()}
})

client.login(token)