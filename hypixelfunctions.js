// JavaScript source code
// Converted From: https://github.com/HypixelDev/PublicAPI/blob/master/Java/src/main/java/net/hypixel/api/util/ILeveling.java
const config = require("./config.json");


const BASE = 10000;
const GROWTH = 2500;

/* Constants to generate the total amount of XP to complete a level */
const HALF_GROWTH = 0.5 * GROWTH;

/* Constants to look up the level from the total amount of XP */
const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
const REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
const GROWTH_DIVIDES_2 = 2 / GROWTH;

/**
* This method returns players network level. Uses direct values from the API.
*/
function getTrueLevel(networkExp, networkLevel) {
    return getLevel(networkExp + getTotalExpToLevel(networkLevel + 1))
}

/**
* This method returns the level of a player calculated by the current experience gathered. The result is
* a precise level of the player The value is not zero-indexed and represents the absolute visible level
* for the player.
* The result can't be smaller than 1 and negative experience results in level 1.
* <p>
* Examples:
* -        0 XP = 1.0
* -     5000 XP = 1.0
* -    10000 XP = 2.0
* -    50000 XP = 4.0
* - 79342431 XP = 249.0
*
* @param exp Total experience gathered by the player.
* @return number level of player (Smallest value is 1.0)
*/
function getLevel(exp) {
    return exp <= 1 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp));
}

/**
* This method returns the level of a player calculated by the current experience gathered. The result is
* a precise level of the player The value is not zero-indexed and represents the visible level
* for the player.
* The result can't be smaller than 1 and negative experience results in level 1.
* <p>
* Examples:
* -        0 XP = 1.0
* -     5000 XP = 1.5
* -    10000 XP = 2.0
* -    50000 XP = 4.71...
* - 79342431 XP = 249.46...
*
* @param exp Total experience gathered by the player.
* @return Exact level of player (Smallest value is 1.0)
*/
function getExactLevel(exp) {
    return getLevel(exp) + getPercentageToNextLevel(exp);
}

/**
* This method returns the amount of experience that is needed to progress from level to level + 1. (5 to 6)
* The levels passed must absolute levels with the smallest level being 1. Smaller values always return
* the BASE constant. The calculation is precise and if a decimal is passed it returns the XP from the
* progress of this level to the next level with the same progress. (5.5 to 6.5)
* <p>
* Examples:
* -   1 (to 2)   =  10000.0 XP
* -   2 (to 3)   =  12500.0 XP
* -   3 (to 4)   =  15000.0 XP
* -   5 (to 6)   =  20000.0 XP
* - 5.5 (to 6.5) =  21250.0 XP
* - 130 (to 131) = 332500.0 XP
* - 250 (to 251) = 632500.0 XP
*
* @param level Level from which you want to get the next level with the same level progress
* @return number to reach the next level with same progress
*/
function getExpFromLevelToNext(level) {
    return level < 1 ? BASE : GROWTH * (level - 1) + BASE;
}

/**
* This method returns the experience it needs to reach that level. If you want to reach the given level
* you have to gather the amount of experience returned by this method. This method is precise, that means
* you can pass any progress of a level to receive the experience to reach that progress. (5.764 to get
* the experience to reach level 5 with 76.4% of level 6.
* <p>
* Examples:
* -    1.0 =        0.0 XP
* -    2.0 =    10000.0 XP
* -    3.0 =    22500.0 XP
* -    5.0 =    55000.0 XP
* -  5.764 =    70280.0 XP
* -  130.0 = 21930000.0 XP
* - 250.43 = 79951975.0 XP
*
* @param level The level and progress of the level to reach
* @return The experience required to reach that level and progress
*/
function getTotalExpToLevel(level) {
    const lv = Math.floor(level), x0 = getTotalExpToFullLevel(lv);
    if (level === lv) return x0;
    return (getTotalExpToFullLevel(lv + 1) - x0) * (level % 1) + x0;
}

/**
* Helper method that may only be called by full levels and has the same functionality as getTotalExpToLevel()
* but doesn't support progress and returns wrong values for progress due to perfect curve shape.
*
* @param level Level to receive the amount of experience to
* @return Experience to reach the given level
*/
function getTotalExpToFullLevel(level) {
    return (HALF_GROWTH * (level - 2) + BASE) * (level - 1);
}

/**
* This method returns the current progress of this level to reach the next level. This method is as
* precise as possible due to rounding errors on the mantissa. The first 10 decimals are totally
* accurate.
* <p>
* Examples:
* -     5000.0 XP   (Lv. 1) = 0.5                               (50 %)
* -    22499.0 XP   (Lv. 2) = 0.99992                       (99.992 %)
* -  5324224.0 XP  (Lv. 62) = 0.856763076923077   (85.6763076923077 %)
* - 23422443.0 XP (Lv. 134) = 0.4304905109489051 (43.04905109489051 %)
*
* @param exp Current experience gathered by the player
* @return Current progress to the next level
*/
function getPercentageToNextLevel(exp) {
    const lv = getLevel(exp), x0 = getTotalExpToLevel(lv);
    return (exp - x0) / (getTotalExpToLevel(lv + 1) - x0);
}
//xp - getTotalExpToLevel(ILeveling.getLevel(XP))
function rank(rank, purchasedrank, uuid, oldrank, monthly) {
    if (uuid === "9429fd48459b439c9dfacda578c9f393" && uuid === config.mcuuid) { //this just defines MrMcShroom as the bot creator and host, if he is running the bot
        return "Stats Bot Creator & Host"
    }
    if (uuid === "dd55aff75e584d068bf1691b5d08cb58") { //this just defines MrMcShroom as the bot creator
        return "Official Helper :)"
    }
    if (uuid === "9429fd48459b439c9dfacda578c9f393") { //this just defines MrMcShroom as the bot creator
        return "Hypixel Stats Bot Creator"
    } else if (uuid === config.mcuuid) {
        return "Hypixel Stats Bot Host" //if you set your ID as config.mcuuid, this will define you as the bot host
    } else if (monthly === "SUPERSTAR"){
        return "MVP++ <3";
    }
     else {
        switch (rank) {
            case "YOUTUBER":
                return "Youtuber";
                break;
            case "ADMIN":
                return "Administrator";
                break;
            case "HELPER":
                return "Helper";
                break;
            case "BUILD_TEAM":
                return "Build Team";
                break;
            case "OWNER":
                return "Hypixel Owner";
                break;
            case "MODERATOR":
                return "Moderator";
                break;
            case "JR_HELPER":
                return "Junior Helper";
                break;
            case "MOJANG":
                return "Mojang";
                break;
            case "MCProHosting":
                return "MCProHosting";
                break;
            case "APPLE":
                return "APPLE";
                break;
            case "SLOTH":
                return "SLOTH";
                break;
            case "ANGUS":
                return "ANGUS";
                break;
            case "EVENTS":
                return "Events";
                break;
            case "Mixer":
                return "Mixer";
                break;
            case "BUILD_TEAM_PLUS":
                return "Build Team +";
                break;
            case "LOL":
                return "LOL";
                break;
            case "LOL_PLUS":
                return "LOL+";
                break;
            case "RETIRED":
                return "Retired";
                break;
            case "SPECIAL":
                return "Special";
                break;
            case "BETA_TESTER":
                return "Beta Tester";
                break;
            case undefined:
                switch (purchasedrank) {
                    case undefined:
                        switch (oldrank) {
                            case "MVP_PLUS":
                                return "MVP+";
                                break;
                            case "VIP_PLUS":
                                return "VIP+";
                                break;
                            case "VIP":
                                return "VIP";
                                break;
                            case "MVP":
                                return "MVP";
                                break;
                            case undefined:
                                return "Non-Donator";
                                break;
                        }
                        return "Non-Donator";
                        break;
                    case "MVP_PLUS":
                        return "MVP+";
                        break;
                    case "VIP_PLUS":
                        return "VIP+";
                        break;
                    case "VIP":
                        return "VIP";
                        break;
                    case "MVP":
                        return "MVP";
                        break;
                }
                break;
        }
    }
}

function getrankcolor(latestpackage, rank, pluscolor, uuid, oldrank,monthly) { // function to turn rank into 0xFFFFFF color format, mvp being aqua, vip and vip plus being green, undefined being gray and MVP + being the color of the plus, and youtube being yellow
    if (uuid === config.mcuuid) {
        return config.embedcolor;
    } else {
        if (uuid === 'c53454db59db4c508cdca9afaf547873') {
            return '0xFFFFFF';
        }
        if (uuid === '5d49b8fcedf6474eacbc877f8006501e') {
            return '0xFFFFFF';
        }
        if (uuid === 'dd55aff75e584d068bf1691b5d08cb58') {
            return '0xBF00FF';
        }
        if (uuid === 'faceafe71d93480ea747171d4690eebe') {
            return '0x660066';
        }
        if (uuid === '8d26e9b2398b4680aa045ae0d92c127a') {
            return '0x3333ff';
        }
        if (monthly === "SUPERSTAR") {
            return '0xFFAA00';
        }
        if (rank === "YOUTUBER") {
            return '0xFFAA00';
        } else if (rank === "ADMIN") {
            return '0xAA0000';
        } else if (rank === "MODERATOR") {
            return '0x00AA00';
        } else if (rank === "HELPER") {
            return '0x0000AA';
        } else if (rank === "BUILD_TEAM") {
            return '0x00AAAA';
        } else if (rank === "OWNER") {
            return '0x00AAAA';
        } else if (rank === "JR_HELPER") {
            return '0x00AAAA';
        } else if (rank === "MOJANG") {
            return '0x00AAAA';
        } else if (rank === "MCProHosting") {
            return '0x00AAAA';
        } else if (rank === "APPLE") {
            return '0x00AAAA';
        } else if (rank === "SLOTH") {
            return '0x00AAAA';
        } else if (rank === "ANGUS") {
            return '0x00AAAA';
        } else if (rank === "EVENTS") {
            return '0x00AAAA';
        } else if (rank === "Mixer") {
            return '0x00AAAA';
        } else if (rank === "BUILD_TEAM_PLUS") {
            return '0x00AAAA';
        } else if (rank === "LOL") {
            return '0x00AAAA';
        } else if (rank === "LOL_PLUS") {
            return '0x00AAAA';
        } else if (rank === "RETIRED") {
            return '0x00AAAA';
        } else if (rank === "SPECIAL") {
            return '0x00AAAA';
        } else if (rank === "BETA_TESTER") {
            return '0x00AAAA';
        } else {
            if (latestpackage === "MVP_PLUS" || oldrank === 'MVP_PLUS' && pluscolor) {
                if (pluscolor === 'BLACK') {
                    return '0x000000';
                } else if (pluscolor === 'DARK_BLUE') {
                    return '0x0000AA';
                } else if (pluscolor === 'DARK_GREEN') {
                    return '0x00AA00';
                } else if (pluscolor === 'DARK_AQUA') {
                    return '0x00AAAA';
                } else if (pluscolor === 'DARK_RED') {
                    return '0xAA0000';
                } else if (pluscolor === 'DARK_PURPLE') {
                    return '0xAA00AA';
                } else if (pluscolor === 'GOLD') {
                    return '0xFFAA00';
                } else if (pluscolor === 'GRAY') {
                    return '0xAAAAAA';
                } else if (pluscolor === 'DARK_GRAY') {
                    return '0x555555';
                } else if (pluscolor === 'BLUE') {
                    return '0x5555FF';
                } else if (pluscolor === 'GREEN') {
                    return '0x55FF55';
                } else if (pluscolor === 'AQUA') {
                    return '0x55FFFF';
                } else if (pluscolor === 'RED') {
                    return '0xFF5555';
                } else if (pluscolor === 'LIGHT_PURPLE') {
                    return '0xFF55FF';
                } else if (pluscolor === 'YELLOW') {
                    return '0xFFFF55';
                } else if (pluscolor === 'WHITE') {
                    return '0xFFFFFF';

                }
            } else if (latestpackage === 'VIP_PLUS' || oldrank === 'VIP_PLUS') {
                return "0x55FF55";
            } else if (latestpackage === 'VIP' || oldrank === 'VIP') {
                return "0x55FF55";
            } else if (latestpackage === 'MVP' || oldrank === 'MVP') {
                return "0x55FFFF";
            } else if (latestpackage === 'MVP_PLUS' || oldrank === 'MVP_PLUS') {
                return "0xFF5555";
            } else {
                return "0xAAAAAA";
            }
        }
    }
}

function getBedwarsLevel(exp) { // DOES NOT WORK FOR ANYONE ABOVE LEVEL 100, TRY bedwars_level value from API!!!!!!!
    // first few levels are different
    if (exp < 500) {
        return 0;
    } else if (exp < 1500) {
        return 1;
    } else if (exp < 3500) {
        return 2;
    } else if (exp < 5500) {
        return 3;
    } else if (exp < 9000) {
        return 4;
    }

    exp -= 9000;
    return exp / 5000 + 4;
}


function validatePlayer(input) {
    function removeDashes(string) {
        return string.replace(/-/g, "");
    }
    // Check if input is non dashed uuid.
    if ((/^[0-9a-f]{32}$/i).test(input)) {
        return removeDashes(input);
    }
    else if ((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(input)) {
        return input;
    } else {
        return input;
}
}

function validateUUID(input) {
    function removeDashes(string) {
        return string.replace(/-/g, "");
    }
    // Check if input is non dashed uuid.
    if ((/^[0-9a-f]{32}$/i).test(input)) {
        return input.replace(/-/g, "");
    }
    else if ((/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i).test(input)) {
        return input.replace(/-/g, "");
    } else {
        return;
    }
}



function parkourTime(data) {
    try {
var time = Math.min(...data.map(value => value.timeTook)) / 1000;
var minutes = Math.floor(time / 60);
var seconds = time - minutes * 60;
minutes = minutes.toFixed(2);
seconds = seconds.toFixed(2);
if (minutes > 1) {
    return minutes + " minutes and " + seconds + "seconds.";
} else if (minutes === 1) {
    return minutes + " minute and " + seconds + " seconds.";
} else {
    return seconds + " seconds."
}

} catch(e) { return "This user has not completed the parkour!";
}

}



module.exports = {
    getTrueLevel,
    getLevel,
    getExactLevel,
    getExpFromLevelToNext,
    getTotalExpToLevel,
    getTotalExpToFullLevel,
    getPercentageToNextLevel,
    getBedwarsLevel,
    rank,
    getrankcolor,
    validatePlayer,
    validateUUID,
    parkourTime
    };