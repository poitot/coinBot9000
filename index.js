const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const dotenv = require('dotenv');
dotenv.config();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.includes("?")) {
        console.log("hit");
        
        // send back spot price of btc from  coinbase API in GBP
        let m = getSpot(message.content.replace('?', '') + "-gbp").then(function (msg) {
            console.log("sending message: " + msg);
            message.channel.send(msg).catch(function (error) {
                console.log(error);
            })
        });
        console.log("client.on.message " + m);
        

    }

    if (message.content === '!eth') {
        let m = getSpot("eth-gbp").then(function (msg) {
            console.log("sending message: " + msg);
            message.channel.send(msg).catch(function (error) {
                console.log(error);
            })
        });
        console.log("client.on.message " + m);
    }

    if (message.content === '!help' || message.content === '!h') {
        let m = getSpot("eth-gbp").then(function (msg) {
            console.log("sending message: " + msg);
            message.channel.send(msg).catch(function (error) {
                console.log(error);
            })
        });
        console.log("client.on.message " + m);
    }
    
});



async function getSpot(curr) {
    let response = await fetch("https://api.coinbase.com/v2/prices/" + curr +"/spot");
    let res = await fetch("https://api.coinbase.com/v2/prices");
    if (res.ok) {
        let j = await res.json();
        console.log("res " + JSON.stringify(j));
    }
    if (response.ok) {
        let json = await response.json();
        //let mes = "£" + json.amount + " " + json.currency;
        
        
        console.log("async " + response.content);
        console.log(json);
        return "£ " + roundToTwo(json.data.amount) + " " + json.data.currency;
 
    }
    else
    {
        console.log(curr.split('-'));
        return "failed to get " + curr.split('-')[0] +" price";
    }
    return "hello";
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}


client.login(process.env.TOKEN);
