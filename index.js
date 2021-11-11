const axios = require('axios');
const { writeToJson } = require('helpers');

const CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const BATTLE_HISTORY_URL = 'https://api.steemmonsters.io/players/history';
const BATTLE_HISTORY_PARAMS = {
    params: { username: 'solaito', types: 'sm_battle,battle' }
}







async function neww() {
    const res = await axios.get(BATTLE_HISTORY_URL, BATTLE_HISTORY_PARAMS);
    const j = [];
    const data = res.data[0];
    //const obj = JSON.parse(json);
    j.push(Object.keys(res.data[0]));

    j.push(res.data[0].result);
    console.log(res.data[0].result)
    writeToJson(j, './data.json');


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