
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

async function getDetailedAnalyse(mana, rule, red, green, blue, black, white, gold) {
    const winners = [];
    const cardMap = await getCardIdNameMap();
    try {
        const uniqueBattleQuery = await client.query(scripts.getUniqueBattle, [mana, rule, red, green, blue, black, white, gold]);
        for (const battle of uniqueBattleQuery.rows) {
            const winner = {};
            winner['minions'] = [];
            const battleCardsQuery = await client.query(scripts.getBattleCards, [battle.id]);
            battleCardsQuery.rows.map(card => {
                const cardName = cardMap[card.card_detail_id];
                if (card.is_winner) {
                    if (card.is_summoner) {
                        winner['summoner'] = cardName;
                    } else {
                        winner['minions'].push(cardName);
                    }
                }
            });
            winners.push(winner);
        }
    } catch (e) {
        return e;
    }
    return winners;
}

module.exports = {
    getGeneralAnalyseSummoner,
    getDetailedAnalyse,
}