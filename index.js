// Setting env variables
const express = require('express')
const app = express();
const { request, fetch } = require('undici');
const { Client, Intents, MessageActionRow, MessageAttachment } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');
const levels = require('discord-xp');
require('dotenv').config();
const token = process.env.TOKEN;
levels.setURL(process.env.MONGOURI)
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = "$";
const JokeID = "joke";
const rankID = "rank";
const images = "images"; 
const port = 3000;



// functions
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

//react 
client.on('messageCreate', async messageCreate =>{ 
    if (messageCreate.content.substring(0,1)=== '$' ){
        messageCreate.react("\u2764")
    }
})

// levels 
client.on('messageCreate', async messageCreate =>{
    if (messageCreate.content.substring(0,1) != '$' ){
        return; 
    }

    if (!messageCreate.guild) return;

    if (messageCreate.author.bot) return;

    const randomXp = Math.floor(Math.random()* 9)+ 1 ;

    const hasLeveledUp = await levels.appendXp(messageCreate.author.id, messageCreate.guild.id, randomXp);
    if (hasLeveledUp){
        const user = await levels.fetch(messageCreate.author.id, messageCreate.guild.id);
        messageCreate.channel.send(`You leveled up to level ${user.level}! Keep it going!`);
    }
    if (messageCreate.content === `${PREFIX}${rankID}`){
        const user = await levels.fetch(messageCreate.author.id, messageCreate.guild.id);
        messageCreate.channel.send(`You are currently level **${user.level}**!`)
    }
})
// random joke
client.on('messageCreate' , async messageCreate =>{
    if (messageCreate.content.substring(0,1) != '$' ){
        return; 
    }
    if (messageCreate.content === `${PREFIX}${JokeID}`) {
        giveMeAJoke.getRandomDadJoke (function(joke) {
      messageCreate.channel.send(joke);
    });
}
})

//images commands 
client.on('messageCreate', async messageCreate =>{  
    if (messageCreate.content.substring(0,1) != '$' ){
        return; 
    }
    if(messageCreate.content === `${PREFIX}${images} doge`){
        const {body} = await request('https://dog.ceo/api/breed/shiba/images/random')

        let response = await body.json();
        messageCreate.channel.send("Here I am!");
        messageCreate.channel.send({ files: [{ attachment: response.message}] });
    }else if(messageCreate.content.substring(0,7) === `${PREFIX}${images}`){
        let imageName = messageCreate.content.substring(8, messageCreate.content.length)
        const {body, statusCode} = await request(`https://dog.ceo/api/breed/${imageName}/images/random`); 
        if(statusCode === 404){
            messageCreate.channel.send("I was not able to find any images :(");
        }else{
            let response = await body.json();   
            messageCreate.channel.send("Here is what you asked for!");
            messageCreate.channel.send({ files: [{ attachment: response.message}] });
        }
        
        // let response = await body.json();
        // messageCreate.channel.send(`Heres's your ${imageName}!`);
        // messageCreate.channel.send({ files: [{ attachment: response.message}] });

    }


})


client.login(token)


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
