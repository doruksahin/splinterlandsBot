const axios = require('axios');
const { writeToJson } = require('./helpers');
const scripts = require('./postgre_scripts');
const elements = ["red", "green", "blue", "black", "white", "gold"];



// return json obj.
function getActiveStatus(inactives) {
    const inactivesArr = inactives.toLowerCase().split(',');
    const elementsObj = {};
    for (const element of elements) {
        elementsObj[element] = false;

    }
    for (const element of elements) {
        if (inactivesArr.includes(element)) {
            elementsObj[element] = true;
        }
    }
    return elementsObj;
}

async function saveBattles(client, url, params) {
    const res = await axios.get(url, params);

    let count = 0;
    for (const battle of res.data.battles) {
        console.log(count++);
        const winner = battle.winner;
        const elo = battle.player_1_rating_final;
        const ruleset = battle.ruleset;
        const mana = battle.mana_cap;
        const { red, blue, green, black, white, gold } = getActiveStatus(battle.inactive);
        const saveBattleRes = await client.query(scripts.saveBattle, [mana, red, blue, green, black, white, gold, ruleset, elo])
            .catch(err => {
                console.log(err);
            });
        const battleId = saveBattleRes.rows[0].id;

        const details = JSON.parse(battle.details);
        await saveBattleCards(battleId, details, winner);

    }
}

//details.team1.summoner.card_detail_id // 111
//details.team1.summoner.uid; //'C1-111-HIRTZTEH8W'
async function saveBattleCards(client, battleId, details, winner) {
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








async function saveCardDetails(url) {
    const res = await axios.get(url);
    console.log(Object.keys(res.data));
}




module.exports = {
    saveBattles,
    saveCardDetails
}