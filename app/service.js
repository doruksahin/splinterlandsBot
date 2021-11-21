
const scripts = require('./postgre_scripts');


async function getCardIdNameMap() {
    const cardMap = {};
    const cardsQuery = await client.query(scripts.getCards, []);
    for (const card of cardsQuery.rows) {
        cardMap[card.id] = card.name;
    }
    return cardMap;
}


async function getGeneralAnalyseSummoner() {
    const rule = "Standard";
    const j = {}
    const cardMap = await getCardIdNameMap();

    for (let mana = 0; mana < 30; mana++) {
        console.log(mana);
        const uniqueBattleQuery = await client.query(scripts.getUniqueBattle, [mana, rule, true, true, true, true, true, true]);
        if (uniqueBattleQuery.rows.length > 0) {
            j[mana] = {};
        }
        for (const battle of uniqueBattleQuery.rows) {
            const battleCardsQuery = await client.query(scripts.getBattleCards, [battle.id]);
            const summoner = battleCardsQuery.rows.filter(card => {
                if (card.is_summoner && card.is_winner) {
                    return card.card_detail_id;
                }
            })[0];
            const summonerName = cardMap[summoner.card_detail_id];
            j[mana][summonerName] ? j[mana][summonerName]++ : j[mana][summonerName] = 1;
        }
    }
    return j;
}


function generateDetailedAnalyseScript(mana, rule, red, green, blue, black, white, gold) {
    let script = `select * from battles`;
    const params = [
        { name: 'mana', operator: '=', value: mana },
        { name: 'rule', operator: 'like', value: rule ? `'%${rule}%'` : rule },
        { name: 'red', operator: '=', value: red },
        { name: 'blue', operator: '=', value: blue },
        { name: 'green', operator: '=', value: green },
        { name: 'white', operator: '=', value: white },
        { name: 'black', operator: '=', value: black },
        { name: 'gold', operator: '=', value: gold },
    ]
    if (mana || rule || red || green || blue || black || white || gold) script += ` where `;
    for (const param of params) {
        if (param.value !== undefined) {
            script += ` ${param.name} ${param.operator} ${param.value} and`;
        }
    }
    script = script.slice(0, -3); // deleting last "and" 
    return script;
}

function getSortedMap(winnerMinions, firstNth) {
    // Create items array
    var winnerMinionsArray = Object.keys(winnerMinions).map(key => {
        return [key, winnerMinions[key]];
    });

    // Sort the array based on the second element
    winnerMinionsArray.sort((first, second) => {
        return second[1] - first[1];
    });
    if (firstNth && winnerMinionsArray.length > firstNth) {
        winnerMinionsArray = winnerMinionsArray.slice(0, firstNth);
    }
    const prunedWinnerMinions = {};
    winnerMinionsArray.forEach(minion => {
        prunedWinnerMinions[minion[0]] = minion[1];
    });
    return prunedWinnerMinions;
}

async function getDetailedAnalyse(mana, rule, red, green, blue, black, white, gold) {
    const result = {};
    result['winnerDecks'] = [];
    result['winnerSummoners'] = {};
    result['winnerMinions'] = {};
    const cardMap = await getCardIdNameMap();
    try {
        const script = generateDetailedAnalyseScript(mana, rule, red, green, blue, black, black, white, gold);
        const uniqueBattleQuery = await client.query(script, []);
        for (const battle of uniqueBattleQuery.rows) {
            const winner = {};
            winner['minions'] = [];
            const battleCardsQuery = await client.query(scripts.getBattleCards, [battle.id]);
            battleCardsQuery.rows.map(card => {
                const cardName = cardMap[card.card_detail_id];
                if (card.is_winner) {
                    if (card.is_summoner) {
                        winner['summoner'] = cardName;
                        result['winnerSummoners'][cardName] ? result['winnerSummoners'][cardName] += 1 : result['winnerSummoners'][cardName] = 1;
                    } else {
                        winner['minions'].push(cardName);
                        const key = `${cardName}-${card.position}`;
                        result['winnerMinions'][key] ? result['winnerMinions'][key] += 1 : result['winnerMinions'][key] = 1;

                    }
                }
            });
            result['winnerDecks'].push(winner);
        }
        result['winnerSummoners'] = getSortedMap(result['winnerSummoners']);
        result['winnerMinions'] = getSortedMap(result['winnerMinions'], 5);
    } catch (e) {
        return e;
    }

    return result;
}

module.exports = {
    getGeneralAnalyseSummoner,
    getDetailedAnalyse,
}