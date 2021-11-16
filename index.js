const { Client, Intents } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = 'OTA4ODU5ODUyOTMwMDM5ODI5.YY73sg.D_7WTD3sXKKCa_vUEb4usCbtm6s';
const PREFIX = ("$");
const JokeID = ("joke");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message' , message =>{
    if (message.content === `${PREFIX}${JokeID}`) {
        giveMeAJoke.getRandomDadJoke (function(joke) {
      message.channel.send(joke);
    });
}
})

client.login(token)
