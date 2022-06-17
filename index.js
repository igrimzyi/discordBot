// Setting env variables
const express = require('express')
const app = express();
const { request, fetch } = require('undici');
const { Client, Intents } = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');
const levels = require('discord-xp');
require('dotenv').config();
const token = process.env.TOKEN;
const stockKey = process.env.stockkey; 
levels.setURL(process.env.MONGOURI)

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const PREFIX = "$";
const JokeID = "joke";
const rankID = "rank";
const images = "images"; 
const help = 'help';
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
    //return if the requirements are not initially met 

    //implementation for doge images
    if (messageCreate.content.substring(0,7) != '$images' ){
        return; 
    }

    else if(messageCreate.content.substring(0,7) === `${PREFIX}${images}`){
   
    if(messageCreate.content.includes("-")){
    }
    
    //images for random dog
    if(messageCreate.content === `${PREFIX}${images} doge`){
        const {body} = await request('https://dog.ceo/api/breed/shiba/images/random')
        let response = await body.json();
        messageCreate.channel.send("Here I am!"); 
        messageCreate.channel.send({ files: [{ attachment: response.message}] });
    }
    
    else if(messageCreate.content === `${PREFIX}${images} dog`){
            const {body} = await request(`https://dog.ceo/api/breeds/image/random`)
            let response = await body.json();   
            messageCreate.channel.send("Here is what you asked for!");
            messageCreate.channel.send({ files: [{ attachment: response.message}] });

        }
    //images for any requested dog 
    else{
            let imageName = messageCreate.content.substring(8, messageCreate.content.length)
            const {body, statusCode} = await request(`https://dog.ceo/api/breed/${imageName}/images/random`); 
            
            if(statusCode === 404){
                messageCreate.channel.send("I was not able to find any images :(");
            }else{
                let response = await body.json();   
                messageCreate.channel.send("Here is what you asked for!");
                messageCreate.channel.send({ files: [{ attachment: response.message}] });
            }
    }
    }
})

client.on('messageCreate', async messageCreate =>{  
    if(messageCreate.content === `${PREFIX}stock`){

        //gettng the exact stock 
        const {body, statusCode} = await request(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2021-07-22/2021-07-22?adjusted=true&sort=asc&limit=120&apiKey=${stockKey}`);
        console.log(body)   

    }

})
//stocks portion
// example url of the stock option

// https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2020-06-01/2020-06-17?apiKey=hvRjf6RR_sfG6OMCmyPY1a9zS8tTCzh_ 
client.login(token)


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
