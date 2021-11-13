const axios = require('axios');
const { writeToJson } = require('./helpers');
const scripts = require('./postgre_scripts');
const { Client } = require('pg')

const CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const API3_BATTLE_HISTORY_URL = 'https://api.steemmonsters.io/players/history';
const API3_BATTLE_HISTORY_PARAMS = {
    params: { username: 'schwarszchild', types: 'sm_battle,battle' }
}


const API1_BATTLE_HISTORY_URL = 'https://api2.splinterlands.com/battle/history'
const API1_BATTLE_HISTORY_PARAMS = {
    params: { player: 'schwarszchild' }
}

//https://api2.splinterlands.com/battle/history2?player=allahiyedim&leaderboard=0&v=1636663692027&token=YW40LCTVB4&username=allahiyedim
// bu apide inactive race'ler yer aliyor.


const elements = ["red", "green", "blue", "black", "white", "gold"];
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'splinterlands',
    password: 'dodo1234',
    port: 5432,
})


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

async function neww() {
    await client.connect()

    //const res = await axios.get(API3_BATTLE_HISTORY_URL, API3_BATTLE_HISTORY_PARAMS);
    const res = await axios.get(API1_BATTLE_HISTORY_URL, API1_BATTLE_HISTORY_PARAMS);

    const j = [];
    writeToJson(j, './data.json');

    for (const battle of res.data.battles) {
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
        await iterateBattleCards(battleId, details, winner);

    }
}

//details.team1.summoner.card_detail_id // 111
//details.team1.summoner.uid; //'C1-111-HIRTZTEH8W'
async function iterateBattleCards(battleId, details, winner) {
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


//TODOS: 
// take best 10 players
// crawl their match history.
// group this cards by mana, rule, 

// TODO: Hangi summoner % kaç kazanmis onu bul.
// Summoner'larin hangi sartlarda % kac kazandigini bul.
// TODO: leaderboards'tan top kisilere odaklanip en cok oynadiklari desteleri bul.
// Top oyuncularin kart listesini getir.
// TODO: karşılaşılan oyuncunun günlük görevi duruyor mu bak.

// OTOMATIK OYNAMA



async function getCardDetails() {
    const res = await axios.get(CARD_DETAILS_URL)
    console.log(Object.keys(res.data))
}

neww();