const axios = require('axios');
const { writeToJson } = require('./helpers');
const scripts = require('./postgre_scripts');
const elements = ["red", "green", "blue", "black", "white", "gold"];



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


async function isBattleExists(client, battle_queue_id) {
    const res = await client.query(scripts.getBattle, [battle_queue_id])
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

async function savePlayerBattles(client, battle_url, player, leagueId) {
    const res = await axios.get(battle_url, { params: { player: player } });

    let count = 0;
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
            if (!await isBattleExists(client, battle_id)) {
                const saveBattleRes = await client.query(scripts.saveBattle, [battle_id, mana, red, blue, green, black, white, gold, ruleset, elo, winner, loser, leagueId])
                    .catch(err => {
                        console.log(err);
                    });
                const battleId = saveBattleRes.rows[0].id;
                await saveBattleCards(client, battleId, details, winner);
            }
        }
    }
}

//details.team1.summoner.card_detail_id // 111
//details.team1.summoner.uid; //'C1-111-HIRTZTEH8W'
async function saveBattleCards(client, battleId, details, winner) {
    if (details.type != 'Surrender') {
        let is_winner = details.team1.player === winner ? true : false;
        for (let i = 0; i < details.team1.monsters.length; i++) {
            const monster = details.team1.monsters[i];
            await client.query(scripts.saveBattleCards, [battleId, false, i, monster.card_detail_id, is_winner]);
        }
        await client.query(scripts.saveBattleCards, [battleId, true, null, details.team1.summoner.card_detail_id, is_winner]);

        is_winner = !is_winner;
        for (let i = 0; i < details.team2.monsters.length; i++) {
            const monster = details.team2.monsters[i];
            await client.query(scripts.saveBattleCards, [battleId, false, i, monster.card_detail_id, is_winner]);
        }
        await client.query(scripts.saveBattleCards, [battleId, true, null, details.team1.summoner.card_detail_id, is_winner]);
    }

}



async function saveCardDetails(client, url) {
    const res = await axios.get(url);
    for (const card of res.data) {
        await client.query(scripts.saveCard, [card.id, card.name, card.color, card.type]);
    }
}





module.exports = {
    savePlayerBattles,
    saveCardDetails,
    getTopPlayers,
    getTopOfLeaguePlayers
}