const { Client, Intents } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');
const levels = require('discord-xp');




levels.setURL("mongodb+srv://bot:puWZ87TdL5FtBhDJ@cluster0.pm1sa.mongodb.net/Cluster0?retryWrites=true&w=majority")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const token = 'OTA4ODU5ODUyOTMwMDM5ODI5.YY73sg.D_7WTD3sXKKCa_vUEb4usCbtm6s';
const PREFIX = ("$");
const JokeID = ("joke");
const rankID = ("rank");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message =>{
    if (!message.guild) return;
    if (message.author.bot) return;

    const randomXp = Math.floor(Math.random()* 9)+ 1 ;

    const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, randomXp);
    if (hasLeveledUp){
        const user = await levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`You leveled up to ${user.level}! Keep it going!`);
    }
    if (message.content === `${PREFIX}${rankID}`){
        const user = await levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`You are currently level **${user.level}**!`)
    }
})

client.on('message' , message =>{
    if (message.content === `${PREFIX}${JokeID}`) {
        giveMeAJoke.getRandomDadJoke (function(joke) {
      message.channel.send(joke);
    });
}
})

client.login(token)
