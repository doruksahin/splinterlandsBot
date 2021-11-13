const API3_BATTLE_HISTORY_URL = 'https://api.steemmonsters.io/players/history';
const API3_BATTLE_HISTORY_PARAMS = {
    params: { username: 'schwarszchild', types: 'sm_battle,battle' }
}
const API1_BATTLE_HISTORY_URL = 'https://api2.splinterlands.com/battle/history'
const API1_BATTLE_HISTORY_PARAMS = {
    params: { player: 'schwarszchild' }
}
const CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const { saveBattles, saveCardDetails } = require('./crawl.js');
const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'splinterlands',
    password: 'dodo1234',
    port: 5432,
})



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


async function main() {
    await client.connect()
    await saveBattles(client, API1_BATTLE_HISTORY_URL, API1_BATTLE_HISTORY_PARAMS);
    console.log("finished.")
}


main();