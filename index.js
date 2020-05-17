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
        let reg = /[0-9]+[dwmy]+/;
        let matches = message.content.match(reg);
        if (matches != null)
        {
            let endIndex = matches[0].length - 1
            let dwmy = matches[0].charAt(endIndex);
            console.log(endIndex);
            let num = matches[0].split(/([dwmy])/)[0];
            console.log(num + " " + dwmy);
            let date = getDate(num, dwmy);
            let coin = message.content.match(/(\?\w*)/)[0].replace("?", "");


            console.log(matches);
            let m = getSpot(coin + "-gbp", date).then(function (msg) {
                console.log("sending message: " + msg);
                message.channel.send(msg).catch(function (error) {
                    console.log(error);
                })
            });
        }
        else {
            console.log("null")
        // send back spot price of btc from  coinbase API in GBP
        let m = getSpot(message.content.replace('?', '') + "-gbp").then(function (msg) {
            console.log("sending message: " + msg);
            message.channel.send(msg).catch(function (error) {
                console.log(error);
            })
        });
    }
        

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



async function getSpot(curr, date) {
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
