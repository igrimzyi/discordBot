// Setting env variables
const express = require('express')
const app = express();
const { request, fetch } = require('undici');
const { Client, Intents, MessageEmbed} = require('discord.js');
let giveMeAJoke = require('give-me-a-joke');
const levels = require('discord-xp');
require('dotenv').config();
const token = process.env.TOKEN;
// fetching images from reddit 
const RedditImageFetcher = require("reddit-image-fetcher");
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
    if(messageCreate.content.substring(0,1) && messageCreate.content.length === 1 ){
        return;
    }else if (messageCreate.content.substring(0,1)=== '$' ){
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
        const message = new MessageEmbed()
        .setColor('#304281')
        .setTitle(`You are currently level **${user.level}**!`)
        .setImage(messageCreate.author.displayAvatarURL())
        messageCreate.channel.send({embeds: [message]})
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
//random meme 
client.on('messageCreate', async messageCreate =>{
    if(messageCreate.content.substring(0,1)!= '$'){
        return; 
    } 
    //send memes :)
    if(messageCreate.content === `${PREFIX}meme`){
        RedditImageFetcher.fetch({
            type: 'meme'
        }).then(result => {
            const message = new MessageEmbed()
            .setColor('#304281')
            .setTitle(result[0].title)
            .setImage(result[0].image)
            console.log(message)
            messageCreate.channel.send({embeds: [message]})
        });
    }
    //soooo satisfying
    else if(messageCreate.content === `${PREFIX}interesting`){
        RedditImageFetcher.fetch({
            type: 'custom',
            subreddit:['satisfyingasfuck','interestingasfuck','satisfying']
        }).then(result => {
            console.log(result)
            const message = new MessageEmbed()
            .setColor('#304281')
            .setTitle(result[0].title)
            .setImage(result[0].image)
            .setDescription(`r/${result[0].subreddit}`)
           
            messageCreate.channel.send({embeds: [message]})
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
        const message = new MessageEmbed()
        .setColor('#304281')
        .setTitle("Here I am!")
        .setImage(response.image)
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

client.login(token)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
