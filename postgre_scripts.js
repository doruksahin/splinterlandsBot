module.exports = {
    saveBattle: `insert into battles(battle_queue_id, mana, red, blue, green, white, black, gold, rule, elo, winner, loser)
    values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning id;`,
    saveBattleCards: `insert into battle_cards(battle_id, is_summoner, position, card_detail_id, is_winner)
    values($1, $2, $3, $4, $5);`,
    getBattle: `select * from battles where battle_queue_id=$1;`,
    getBattleCards: `select * from battle_cards where battle_id=$1;`,
}