const { Client } = require("discord.js");
const mongoose =require("mongoose");

module.exports = (client) => {
    client.dblogin = async =>{
        await mongoose.connect(process.index.dbtoken, {
            useFindAndModify: false,
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
    };
};