var mongoose = require('mongoose');

var txns = mongoose.Schema({
    app:{
        type: String,
    },
    bets:[{
        gameId: {
            type: String
        },
        depositTXID: {
            type: String
        },
        betNumber: {
            type: String
        },
        randomSeed: {
            type: String
        },
        diceRoll: {
            type: String
        },
        outcome: {
            type: String
        },
        payoutTXID: {
            type: String
        },
        betAmount: {
            type: String
        },
        payoutAmount: {
            type: String
        },
        serverSeedTX: {
            type: String
        },
        serverSeedHash: {
            type: String
        },
        betAmount: {
            type: String
        }

    }]

 });

module.exports = mongoose.model('txns', txns);