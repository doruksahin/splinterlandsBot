module.exports = {
    checkBattle: `select * from battles where battle_queue_id = $1`,
    saveBattle: `insert into battles(battle_queue_id, mana, red, blue, green, white, black, gold, rule, elo, winner, loser, league_id)
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning id;`,
    saveBattleCards: `insert into battle_cards(battle_id, is_summoner, position, card_detail_id, is_winner)
    values($1, $2, $3, $4, $5);`,
    getBattle: `select * from battles where battle_queue_id=$1;`,
    getBattleCards: `select * from battle_cards where battle_id=$1;`,
    saveCard: `insert into cards(id, name, color, type) values ($1, $2, $3, $4);`,
    getUniqueBattle: `select * from battles where mana=$1 and rule=$2 and red=$3 and blue=$4 and green=$5 and white=$6 and black=$7 and gold=$8;`,
    getCards: `select * from cards;`,

}