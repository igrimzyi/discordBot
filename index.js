const { Client, Intents } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = 'OTA4ODU5ODUyOTMwMDM5ODI5.YY73sg.D_7WTD3sXKKCa_vUEb4usCbtm6s';

let dadJokes = giveMeAJoke.getRandomDadJoke(function (joke){
 return joke; 
})
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message' , msg =>{
    if (msg.content === "$dadJoke"){
        dadJokes().then(quote => msg.channel.send(quote))
    }
})

client.login(token)