const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");
const dotenv = require('dotenv');
dotenv.config();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('voiceStateUpdate', (oldmember, newmember)=>{
    let oldvoice = oldmember.voiceChannel;
    let newvoice = newmember.voiceChannel;
    if (newmember.member.user.username === "Yung Muriy") {
        console.log("hit");
        client.channels.fetch("471825896425259021").then( chan =>
            chan.send("The non believer, has entered the ring. BTC = £100000000000").catch(function(error) {
                console.log(error);
            })
        );
        
        
    }
   
})

client.on('message', message => {
    // bug fix: fixed url params trigering spot price check; include() => startsWith()
	if (message.content.startsWith('?')) {
        let reg = /(\?*)(( )|[0-9])([dwmy])/;
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
            let m = getSpot(coin + "-gbp", date = date).then(function (msg) {
                console.log("sending message: " + msg);
                message.channel.send(msg).catch(function (error) {
                    console.log(error);
                })
            });
        }
        else if (message.content.match(/[dwmy]/)) {

        }
        else {
            console.log("null")
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
        console.log("client.on.message " + m);
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
