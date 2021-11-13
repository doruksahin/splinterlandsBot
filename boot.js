const API3_BATTLE_HISTORY_URL = 'https://api.steemmonsters.io/players/history';
const API3_BATTLE_HISTORY_PARAMS = {
    params: { username: 'schwarszchild', types: 'sm_battle,battle' }
}
const API1_BATTLE_HISTORY_URL = 'https://api2.splinterlands.com/battle/history';
const API_TOP100_USERS_URL = 'https://api2.splinterlands.com/players/leaderboard';
const API_CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const API_LEAGUE_LEADERBOARDS = 'https://api2.splinterlands.com/players/leaderboard_with_player';
const { getTopPlayers, savePlayerBattles, saveCardDetails, getTopOfLeaguePlayers } = require('./crawl.js');
const { Client } = require('pg');
const { analyse } = require('./analyse.js');
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


async function wrapperMain() {
    await client.connect();

    // await saveCardDetails(client, API_CARD_DETAILS_URL);
    // await savePlayerBattles(client, API1_BATTLE_HISTORY_URL, "allahiyedim");

    // const players = await getTopPlayers(API_TOP100_USERS_URL);
    // for (const player of players) {
    //     await savePlayerBattles(client, API1_BATTLE_HISTORY_URL, player);
    // }


    // const players = await getTopOfLeaguePlayers(API_LEAGUE_LEADERBOARDS, { params: { season: 74, leaderboard: 0, username: 'allahiyedim' } });
    // for (const player of players) {
    //     await savePlayerBattles(client, API1_BATTLE_HISTORY_URL, player);
    // }
    analyse(client);

}

wrapperMain();
