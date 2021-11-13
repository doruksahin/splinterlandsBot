async function analyse(client) {
    await client.query(scripts.getBatleCards, [battleId, true, null, details.team1.summoner.card_detail_id, is_winner]);

}

module.exports = {
    analyse
}