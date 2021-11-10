const axios = require('axios');

const BATTLE_HISTORY_URL = 'https://api2.splinterlands.com/battle/history2';
const CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const BATTLE_HISTORY_URL = 'https://api.steemmonsters.io/players/history?username=solaito'; //&types=sm_battle,battle
// &limit=1000, shows all battles during the last 30 days.
const BATTLE_HISTORY_PARAMS = {
    player: 'schwarszchild',
};



// TODO: Hangi summoner % kaç kazanmis onu bul.
// Summoner'larin hangi sartlarda % kac kazandigini bul.
// TODO: leaderboards'tan top kisilere odaklanip en cok oynadiklari desteleri bul.
// Top oyuncularin kart listesini getir.
// TODO: karşılaşılan oyuncunun günlük görevi duruyor mu bak.

// OTOMATIK OYNAMA


async function main() {
    const res = await axios.get(BATTLE_HISTORY_URL, { BATTLE_HISTORY_PARAMS });
    console.log(Object.keys(res.data)); // { answer: 42, time: "\"2016-06-01T04:00:00.000Z\"" }
    console.log(Object.keys(res.data.battles["0"]))

    // res.data.battles["0"].current_streak -- is this player worthy?
    // res.data.battles["0"].mana_cap
    // res.data.battles["0"].ruleset
    // res.data.battles["0"].inactive

    // res.data.battles["0"].dec_info
    // res.data.battles["0"].details.team1.summoner.uid
    // res.data.battles["0"].details.team1.summoner.card_detail_id
    // res.data.battles["0"].details.team1.summoner.state.stats
    // res.data.battles["0"].details.team1.summoner.state.abilities

    // res.data.battles["0"].details.team1.monsters
    // res.data.battles["0"].details.team1.monsters.["0"].uid
    // res.data.battles["0"].details.team1.monsters.["0"].card_detail_id
    // res.data.battles["0"].details.team1.monsters.["0"].state.base_health
    // res.data.battles["0"].details.team1.monsters.["0"].state.stats // array

    // card_detail_id: 282 -> dark ferryman
    // uid: "C3-282-FRZUZPMGOG"
    // 

    // 0. melee    
    // 1. ranged
    // 2. magic
    // 3. shield
    // 4. hp
    // 5. speed
    // [2, 0, 0, 0, 7, 2] 
    // [1, 0, 0, 0, 2, 4] skeleton assasin
    // [0, 0, 1, 0, 2, 3]

    // https://api.splinterlands.io/cards/get_details
    // "id": 2,
    // "name": "Giant Roc",
    // "color": "Red",
    // "type": "Monster",
    // "sub_type": null,



    const cardDetailsRes = await axios.get(CARD_DETAILS_URL, {});
    console.log(Object.keys(cardDetailsRes.data));
    console.log("branch 1");

}



async function getCardDetails() {
    const res = await axios.get(CARD_DETAILS_URL)
    console.log(Object.keys(res.data))
}

main()