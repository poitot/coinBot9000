// Imports discord.js library for interacting with the discord API
const Discord = require('discord.js');
const client = new Discord.Client();

// fetch & dotenv: packages used to make requests to the coinbase API, allows discord API token to be stored
// in an enviroment variable
const fetch = require("node-fetch");
const dotenv = require('dotenv');
dotenv.config();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    // bug fix: fixed url params trigering spot price check; include() => startsWith()
	if (message.content.startsWith('?')) {
        let reg = /(\?*)(( )|[0-9])([dwmy])/;
        let matches = message.content.match(reg);
        if (matches != null)
        {
            let endIndex = matches[0].length - 1
            let dwmy = matches[0].charAt(endIndex);
            let num = matches[0].split(/([dwmy])/)[0];
            let date = getDate(num, dwmy);
            let coin = message.content.match(/(\?\w*)/)[0].replace("?", "");
		
            let m = getSpot(coin + "-gbp", date = date).then(function (msg) {
                console.log("sending message: " + msg);
                message.channel.send(msg).catch(function (error) {
                    console.log(error);
                })
            });
        }
        else {
		
        // send back spot price of btc from  coinbase API in GBP
        let m = getSpot(message.content.replace('?', '').replace(/ /g, '') + "-gbp").then(function (msg) {
            console.log("sending message: " + msg);
            message.channel.send(msg).catch(function (error) {
                console.log(error);
            })
        });
    }
        
    }
	

    if (message.content === '?help' || message.content === '?h') {
	    
        const msg = "Use ?btc to check the spot price of bitcoin, historic prices are also available using ?btc {(n)d, (n)w, (n)m, (n)y}"
        message.channel.send(msg).catch(function (error) {
            console.log(error);

        });
	    
        console.log("client sent help msg: " + m);
    }

    
});

async function getSpot(curr, date = null) {
	
    if (date === null)
    {
        var response = await fetch("https://api.coinbase.com/v2/prices/" + curr +"/spot");
    }
	
    else {
        var response = await fetch("https://api.coinbase.com/v2/prices/" + curr +"/spot"+"?date="+date);
    }
    
    let res = await fetch("https://api.coinbase.com/v2/prices");
	
    if (res.ok) {
        let j = await res.json();
	console.log("res OK")
    }
	
    if (response.ok) {
        let json = await response.json();
        
        console.log("async " + response.content);
        console.log(json);
	    
        return "£ " + roundToTwo(json.data.amount) + " " + json.data.currency;
    }
	
    else
    {
        console.log(curr.split('-'));
        console.log(curr);
	    
        return "failed to get " + curr.split('-')[0] +" price";
    }
	
    return "hello";
}

function roundToTwo(num) {    
	
    return +(Math.round(num + "e+2")  + "e-2");
}

function getDate(nAd, lAd) {
	
    let date = new Date();
	
    switch(lAd) {
		    
        case "d":
            date.setDate(date.getDate() - nAd);
            break;
		    
        case "w":
            date.setDate(date.getDate() - (7 * nAd));
            break;
		    
        case "m":
            date.setMonth(date.getMonth() -nAd);
            break;
		    
        case "y":
            date.setFullYear(date.getFullYear() -nAd);
            break;
    }
	
    let date_str = date.toISOString().split("T")[0];
    console.log(date_str);
    return date_str;
}

client.login(process.env.TOKEN);
