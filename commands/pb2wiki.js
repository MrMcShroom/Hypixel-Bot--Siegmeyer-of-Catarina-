const Discord = require("discord.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function wikidata(dom,message,client,oldembed) 
{
    try {
        let title = dom.window.document.getElementById('firstHeading').textContent
        let info = dom.window.document.querySelectorAll("p");
        let links = dom.window.document.querySelectorAll("a");
        let image = dom.window.document.querySelectorAll('img');
        let n = 0
        
        function findintrop(info, title) {
            let i = 0;
            let ptext = info[i].textContent;
            let introparagraph = ptext.indexOf(title);
            do {
                let ptext = info[i].textContent;
                let introparagraph = ptext.indexOf(title);
                 if(introparagraph > -1) {
                    const infotext = ptext;
                    return infotext;
                }
                i++;
            }
            while (i < info.length || introparagraph === -1);
        } 

        if(links[8] && title === "Search results" || title.indexOf('disambiguation') > -1) {
            var newembed = new Discord.RichEmbed();
            newembed.setTitle("There were multiple results!")
            .setDescription("The wiki search has succeeded, but your search was too vague. Try a new search, or react with the result that is yours.")
            .setColor(colors[Math.floor(Math.random() * colors.length)])
            .addField("1", links[8])
            .addField("2", links[9])
            .addField("3", links[10])
            .addField("4", links[11])
            .setThumbnail("https://images-ext-1.discordapp.net/external/pfZ7dfVm6ixhnMfV5r4XOfC3uxnSm_tK1Bc-7uT2fds/%3Fcb%3D20120605174642/https/vignette.wikia.nocookie.net/plazmabursttwo/images/6/6c/Plazma_Burst_2_Wallpaper.jpg/revision/latest?width=80&height=47")
            .setFooter("Results", message.client.user.avatarURL)
            oldembed.edit(newembed).then(function (message) {
                message.react('1⃣').then( a => {
                    message.react('2⃣').then( b => {
                        message.react('3⃣').then( c => {
                            message.react('4⃣').then( d => {
                            //Filter
                            const rFilter = (reaction, user) => reaction.emoji.name === '1⃣' && user.id === originalauthor || reaction.emoji.name === '2⃣' && user.id === originalauthor || reaction.emoji.name === '3⃣' && user.id === originalauthor || reaction.emoji.name === '4⃣' && user.id === originalauthor;
                            //Reaction Collector
                            const rReaction = message.createReactionCollector(rFilter, { time: 90000 });

                            rReaction.on('collect', r => {
                                if(r.emoji.name === '1⃣') {
                                    JSDOM.fromURL(links[8], options).then(dom => {
                                        d.delete();
                                        wikidata(dom,message,client,oldembed);
                                    });

                                } else if(r.emoji.name === '2⃣') {
                                    JSDOM.fromURL(links[9], options).then(dom => {
                                                                                a.delete();                                         b.delete();                                         c.delete();                                         d.delete();
                                        wikidata(dom,message,client,oldembed);
                                    });
                                
                                } else if(r.emoji.name === '3⃣') {
                                    JSDOM.fromURL(links[10], options).then(dom => {
                                                                                a.delete();                                         b.delete();                                         c.delete();                                         d.delete();
                                        wikidata(dom,message,client,oldembed);
                                    });
                                
                                } else if (r.emoji.name === '4⃣') {
                                    JSDOM.fromURL(links[10], options).then(dom => {
                                                                                a.delete();                                         b.delete();                                         c.delete();                                         d.delete();
                                        wikidata(dom,message,client,oldembed);
                                    });
                            }
                            });
                        });
                    });
                });
            }); 
        });
        } else if (title === "Search Results") {
            var newembed = new Discord.RichEmbed();
            newembed.setTitle("There were no results for this search!")
            .setDescription("The wiki search has failed. Try a new search, or visit the wiki and try to find what you're looking for.")
            .setColor(colors[Math.floor(Math.random() * colors.length)])
            .setThumbnail("https://images-ext-1.discordapp.net/external/pfZ7dfVm6ixhnMfV5r4XOfC3uxnSm_tK1Bc-7uT2fds/%3Fcb%3D20120605174642/https/vignette.wikia.nocookie.net/plazmabursttwo/images/6/6c/Plazma_Burst_2_Wallpaper.jpg/revision/latest?width=80&height=47")
            .setFooter("Search failed.", message.client.user.avatarURL)
            oldembed.edit(newembed);
       
        } else {
            let introparagraph = findintrop(info, title);
            console.log(" intropara: " + introparagraph);
            var infoembed = new Discord.RichEmbed();
            infoembed.setTitle(title)
            .addField('Intro:', introparagraph)
            .addField('URL:', dom.window.document.URL)
            .setColor(colors[Math.floor(Math.random() * colors.length)])
            .setThumbnail(image[n].src)
            oldembed.edit(infoembed);
        } 

} catch(err) {
    console.log(err);
}   
};

exports.run = (client, message, args) => {
    var colors = ["0x67037b","0xff2492","0x1e90ff","0xc71585","0x7fff00","0xdc143c","0x48d1cc","0x9932cc"]
    const originalauthor =  message.author.id;
    let wikiitem = args.join("%20");
    let options = {
        includeNodeLocations: true
      }
    var embed = new Discord.RichEmbed();
        embed.setTitle("Loading the requested stats!")
        .setDescription("Be patient, the PB2 Wiki is working hard :)")
        .setColor(colors[Math.floor(Math.random() * colors.length)])
        .setThumbnail("https://images-ext-1.discordapp.net/external/pfZ7dfVm6ixhnMfV5r4XOfC3uxnSm_tK1Bc-7uT2fds/%3Fcb%3D20120605174642/https/vignette.wikia.nocookie.net/plazmabursttwo/images/6/6c/Plazma_Burst_2_Wallpaper.jpg/revision/latest?width=80&height=47")
        .setFooter("Loading your wiki info with love from the PB2 Wiki", message.client.user.avatarURL)
        message.channel.send({embed:embed}).then((oldembed) => {
            JSDOM.fromURL("https://plazmaburst.miraheze.org/w/index.php?search=" + wikiitem, options).then(dom => {
           try {
                    let title = dom.window.document.getElementById('firstHeading').textContent
                    let info = dom.window.document.querySelectorAll("p");
                    let links = dom.window.document.querySelectorAll("a");
                    let image = dom.window.document.querySelectorAll('img');
                    let n = 0
                    
                    function findintrop(info, title) {
                        let i = 0;
                        let ptext = info[i].textContent;
                        let introparagraph = ptext.indexOf(title);
                        do {
                            let ptext = info[i].textContent;
                            let introparagraph = ptext.indexOf(title);
                             if(introparagraph > -1) {
                                const infotext = ptext;
                                return infotext;
                            }
                            i++;
                        }
                        while (i < info.length || introparagraph === -1);
                    } 

                    if(links[8] && title === "Search results" || title.indexOf('disambiguation') > -1) {
                        var newembed = new Discord.RichEmbed();
                        newembed.setTitle("There were multiple results!")
                        .setDescription("The wiki search has succeeded, but your search was too vague. Try a new search, or react with the result that is yours.")
                        .setColor(colors[Math.floor(Math.random() * colors.length)])
                        .addField("1", links[8])
                        .addField("2", links[9])
                        .addField("3", links[10])
                        .addField("4", links[11])
                        .setThumbnail("https://images-ext-1.discordapp.net/external/pfZ7dfVm6ixhnMfV5r4XOfC3uxnSm_tK1Bc-7uT2fds/%3Fcb%3D20120605174642/https/vignette.wikia.nocookie.net/plazmabursttwo/images/6/6c/Plazma_Burst_2_Wallpaper.jpg/revision/latest?width=80&height=47")
                        .setFooter("Results", message.client.user.avatarURL)
                        oldembed.edit(newembed).then(function (message) {
                            message.react('1⃣').then( r => {
                                message.react('2⃣').then( r => {
                                    message.react('3⃣').then( r => {
                                        message.react('4⃣');
                                        //Filter
                                        const rFilter = (reaction, user) => reaction.emoji.name === '1⃣' && user.id === originalauthor || reaction.emoji.name === '2⃣' && user.id === originalauthor || reaction.emoji.name === '3⃣' && user.id === originalauthor || reaction.emoji.name === '4⃣' && user.id === originalauthor;
                                        //Reaction Collector
                                        const rReaction = message.createReactionCollector(rFilter, { time: 90000 });
    
                                        rReaction.on('collect', r => {
                                            if(r.emoji.name === '1⃣') {
                                                JSDOM.fromURL(links[8], options).then(dom => {
                                                                                            a.delete();                                         b.delete();                                         c.delete();                                         d.delete();
                                                });

                                            } else if(r.emoji.name === '2⃣') {console.log('2');
                                            
                                            } else if(r.emoji.name === '3⃣') {console.log('3');
                                            
                                            } else if (r.emoji.name === '4⃣') {console.log('4');
                                        }
                                        });
                                    });
                                });
                            });
                        }); 
                    } else if (title === "Search Results") {
                        var newembed = new Discord.RichEmbed();
                        newembed.setTitle("There were no results for this search!")
                        .setDescription("The wiki search has failed. Try a new search, or visit the wiki and try to find what you're looking for.")
                        .setColor(colors[Math.floor(Math.random() * colors.length)])
                        .setThumbnail("https://images-ext-1.discordapp.net/external/pfZ7dfVm6ixhnMfV5r4XOfC3uxnSm_tK1Bc-7uT2fds/%3Fcb%3D20120605174642/https/vignette.wikia.nocookie.net/plazmabursttwo/images/6/6c/Plazma_Burst_2_Wallpaper.jpg/revision/latest?width=80&height=47")
                        .setFooter("Search failed.", message.client.user.avatarURL)
                        oldembed.edit(newembed);
                   
                    } else {
                        let introparagraph = findintrop(info, title);
                        console.log(" intropara: " + introparagraph);
                        var infoembed = new Discord.RichEmbed();
                        infoembed.setTitle(title)
                        .addField('Intro:', introparagraph)
                        .addField('URL:', dom.window.document.URL)
                        .setColor(colors[Math.floor(Math.random() * colors.length)])
                        .setThumbnail(image[n].src)
                        oldembed.edit(infoembed);
                    } 

            } catch(err) {
                console.log(err);
            }
    });
});
}
