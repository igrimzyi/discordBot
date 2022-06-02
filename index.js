// Setting env variables
const express = require('express')
const app = express();
const { request, fetch } = require('undici');
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
    if (messageCreate.content === `${PREFIX}${JokeID}`) {
        giveMeAJoke.getRandomDadJoke (function(joke) {
      messageCreate.channel.send(joke);
    });
}
})

//dog images
client.on('messageCreate', async messageCreate =>{  
  
    async function getJSONResponse(body) {
        let fullBody = '';
    
        for await (const data of body) {
            fullBody += data.toString();
        }
    
        return JSON.parse(fullBody);
    }
     
    

    if(messageCreate.content === `${PREFIX}doge`){

        const {
            statusCode,
            headers,
            trailers,
            body
        } = await request('https://dog.ceo/api/breed/shiba/images/random')

          console.log(body)

        const dogeResult = await fetch('https://dog.ceo/api/breed/shiba/images/random')
        
        console.log(dogeResult)
        // const catResult = await request('https://aws.random.cat/meow');
        // const { file } = await getJSONResponse(dogeResult.body);
		// interaction.editReply({ files: [file] });
        // messageCreate.channel.send("Here is me!", {files: ["https://dog.ceo/api/breed/Shiba/images/random"] });
    }

})


client.login(token)


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
