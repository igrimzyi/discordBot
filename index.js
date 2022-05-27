const { Client, Intents } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');
const levels = require('discord-xp');
require('dotenv').config();

const token = process.env.TOKEN;



levels.setURL(process.env.MONGOURI)

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = ("$");
const JokeID = ("joke");
const rankID = ("rank");


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async messageCreate =>{
    if (messageCreate.content === `${PREFIX}${JokeID}`|| `${PREFIX}${rankID}`){
        messageCreate.react("\u2764")
    }
})

client.on('message', async messageCreate =>{
    if (!messageCreate.guild) return;
    if (messageCreate.author.bot) return;

    const randomXp = Math.floor(Math.random()* 9)+ 1 ;

    const hasLeveledUp = await levels.appendXp(messageCreate.author.id, messageCreate.guild.id, randomXp);
    if (hasLeveledUp){
        const user = await levels.fetch(messageCreate.author.id, messageCreate.guild.id);
        messageCreate.channel.send(`You leveled up to ${user.level}! Keep it going!`);
    }
    if (messageCreate.content === `${PREFIX}${rankID}`){
        const user = await levels.fetch(messageCreate.author.id, messageCreate.guild.id);
        messageCreate.channel.send(`You are currently level **${user.level}**!`)
    }
})

client.on('message' , async messageCreate =>{
    if (messageCreate.content === `${PREFIX}${JokeID}`) {
        giveMeAJoke.getRandomDadJoke (function(joke) {
      messageCreate.channel.send(joke);
    });
}
})

client.login(token)
