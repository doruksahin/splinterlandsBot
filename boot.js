const API3_BATTLE_HISTORY_URL = 'https://api.steemmonsters.io/players/history';
const API3_BATTLE_HISTORY_PARAMS = {
    params: { username: 'schwarszchild', types: 'sm_battle,battle' }
}
const API1_BATTLE_HISTORY_URL = 'https://api2.splinterlands.com/battle/history';
const API_TOP100_USERS_URL = 'https://api2.splinterlands.com/players/leaderboard';
const API_CARD_DETAILS_URL = 'https://api2.splinterlands.com/cards/get_details';
const API_LEAGUE_LEADERBOARDS = 'https://api2.splinterlands.com/players/leaderboard_with_player';
const { getTopPlayers, savePlayerBattles, saveCardDetails, getTopOfLeaguePlayers } = require('./crawl');
const { Client } = require('pg');
const { analyse } = require('./analyse');
const { writeToJson } = require('./helpers');
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
    //await fetchData();
    await analyseData();
}

async function fetchData() {
    const players = await getTopPlayers(API_TOP100_USERS_URL);
    let playerCounter = 0;
    for (const player of players) {
        console.log("player: ", playerCounter++);
        await savePlayerBattles(client, API1_BATTLE_HISTORY_URL, player, null);
    }

    for (let leagueId = 0; leagueId < 4; leagueId++) {
        console.log("leagueId: ", leagueId);
        const players = await getTopOfLeaguePlayers(API_LEAGUE_LEADERBOARDS, { params: { season: 74, leaderboard: leagueId, username: 'allahiyedim' } });
        let playerCount = 0;
        for (const player of players) {
            console.log("playerCount: ", playerCount++);
            await savePlayerBattles(client, API1_BATTLE_HISTORY_URL, player, leagueId);
        }
    }
}

async function analyseData() {
    const j = await analyse(client);
    console.log(j);
    writeToJson(j, "analyse.json");
}

wrapperMain();
