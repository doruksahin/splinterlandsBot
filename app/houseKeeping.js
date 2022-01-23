const schedule = require('node-schedule');
const axios = require('axios');
const scripts = require('./postgre_scripts');
const API_LEAGUE_LEADERBOARDS = 'https://api2.splinterlands.com/players/leaderboard_with_player';
const API1_BATTLE_HISTORY_URL = 'https://api2.splinterlands.com/battle/history';
const API_TOP100_USERS_URL = 'https://api2.splinterlands.com/players/leaderboard';
const API_CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const elements = ["red", "green", "blue", "black", "white", "gold"];
const { postgresErrorHandler } = require("./helpers/handleErrors");
const { clientQuery } = require('./helpers/helpers');

// return json obj.
function getActiveStatus(inactives) {
    const elementsObj = {};
    for (const element of elements) {
        elementsObj[element] = true;
    }
    if (inactives) {
        const inactivesArr = inactives.toLowerCase().split(',');
        for (const element of elements) {
            if (inactivesArr.includes(element)) {
                elementsObj[element] = false;
            }
        }
    }
    return elementsObj;
}

async function isBattleExists(battle_queue_id) {
    const res = await clientQuery(scripts.getBattle, [battle_queue_id])
        .catch(function (err) {
            console.log(err);
        });
    if (res.rows && res.rows.length > 0) {
        return true;
    } else {
        return false;
    }
}

async function getTopPlayers(url) {
    const res = await axios.get(url);
    const players = [];
    for (const playerObj of res.data) {
        players.push(playerObj.player);
    }
    return players;
}

async function getTopOfLeaguePlayers(url, params) {
    const res = await axios.get(url, params);
    const players = [];
    for (const playerObj of res.data.leaderboard) {
        // season, rating, battles, wins, longest_streak
        players.push(playerObj.player);
    }
    return players;
}

async function savePlayerBattles(battle_url, player, leagueId) {
    const res = await axios.get(battle_url, { params: { player: player } });

    if (res.data && res.data.battles) {
        for (const battle of res.data.battles) {
            const details = JSON.parse(battle.details);
            const mana = battle.mana_cap;
            const surrender = details.type == 'Surrender' ? true : false;
            if (mana && !surrender) {
                const winner = battle.winner;
                const loser = battle.player_1 === winner ? battle.player_2 : battle.player_1;
                const elo = battle.player_1_rating_final;
                const ruleset = battle.ruleset;
                const { red, blue, green, black, white, gold } = getActiveStatus(battle.inactive);
                const battle_id = battle.battle_queue_id_1;
                if (!await isBattleExists(battle_id)) {
                    const checkBattleQuery = await clientQuery(scripts.checkBattle, [battle_id])
                    if (checkBattleQuery.rows == 0) {
                        const saveBattleQuery = await clientQuery(scripts.saveBattle, [battle_id, mana, red, blue, green, black, white, gold, ruleset, elo, winner, loser, leagueId])
                            .catch(err => {
                                console.log(err);
                            });
                        const battleId = saveBattleQuery.rows[0].id;
                        await saveBattleCards(battleId, details, winner);
                    }
                }
            }
        }
    }
}
//details.team1.summoner.card_detail_id // 111
//details.team1.summoner.uid; //'C1-111-HIRTZTEH8W'
async function saveBattleCards(battleId, details, winner) {
    if (details.type != 'Surrender') {
        let is_winner = details.team1.player === winner ? true : false;
        for (let i = 0; i < details.team1.monsters.length; i++) {
            const monster = details.team1.monsters[i];
            await clientQuery(scripts.saveBattleCards, [battleId, false, i, monster.card_detail_id, is_winner]);
        }
        await clientQuery(scripts.saveBattleCards, [battleId, true, null, details.team1.summoner.card_detail_id, is_winner]);

        is_winner = !is_winner;
        for (let i = 0; i < details.team2.monsters.length; i++) {
            const monster = details.team2.monsters[i];
            await clientQuery(scripts.saveBattleCards, [battleId, false, i, monster.card_detail_id, is_winner]);
        }
        await clientQuery(scripts.saveBattleCards, [battleId, true, null, details.team2.summoner.card_detail_id, is_winner]);
    }

}



async function saveCardDetails() {
    const res = await axios.get(API_CARD_DETAILS_URL);
    for (const card of res.data) {
        await clientQuery(scripts.saveCard, [card.id, card.name, card.color, card.type]);
    }
}



async function saveBattles() {
    console.log("saveBattles() started.");
    const players = await getTopPlayers(API_TOP100_USERS_URL);
    let playerCounter = 0;
    let promiseArray = [];
    for (const player of players) {
        console.log("player: ", playerCounter++);
        promiseArray.push(savePlayerBattles(API1_BATTLE_HISTORY_URL, player, null));
        if (promiseArray.length == 2) {
            await Promise.all(promiseArray);
            promiseArray = [];
        }
    }

    for (let leagueId = 0; leagueId < 4; leagueId++) {
        console.log("leagueId: ", leagueId);
        const players = await getTopOfLeaguePlayers(API_LEAGUE_LEADERBOARDS, { params: { season: 74, leaderboard: leagueId, username: 'allahiyedim' } });
        let playerCount = 0;
        for (const player of players) {
            console.log("playerCount: ", playerCount++);
            promiseArray.push(savePlayerBattles(API1_BATTLE_HISTORY_URL, player, leagueId));
            if (promiseArray.length == 2) {
                await Promise.all(promiseArray);
                promiseArray = [];
            }
        }
    }
}


function initSchedule() {
    saveCardDetails();
    saveBattles();
    schedule.scheduleJob("0 */1 * * *", function () {
        saveBattles();
    });
}


module.exports = {
    initSchedule,
    saveBattles,
};
