
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

module.exports = {
    getGeneralAnalyseSummoner,
}