var bitcore = require('zcore-lib');
var RpcClient = require('bitcoind-rpc-zcoin');
var conf = require( "./config");
var txns = require('./model/txns');

  var rpc = new RpcClient(conf.configMainnet);
  var txids = [];
var todayhash = "a82cfc23971d0ae23ae51ecb99e770c1a9659588439d2367d367c5db85080e24";
var opretfee = 1000;


 function mainService() {

  rpc.getRawMemPool(function(err, ret) {
    if (err) {
      console.error(err);
      return setTimeout(showNewTransactions, 10000);
    }

    function batchCall() {
      ret.result.forEach(function(txid) {
        if (txids.indexOf(txid) === -1) {
          rpc.getRawTransaction(txid);
        }
      });
    }

    rpc.batch(batchCall, function(err, rawtxs) {
      if (err) {
        console.error(err);
        return setTimeout(showNewTransactions, 10000);
      }

      rawtxs.map(function(rawtx) {
        //var tx = new bitcore.Transaction(rawtx.result);
        rpc.decodeRawTransaction(rawtx.result, function(err, ret) {
          console.log(ret.result);
            
          for (var i = 0; i < ret.result.vout.length; i++) {
            // console.log(ret.result.vout[i].scriptPubKey)
            var multiplier = 0
 

          var multiplier = returnMultiplier(ret.result.vout[i].scriptPubKey.addresses[0])
          if(multiplier > 0){
              var out = ret.result.vout[i];
              var add = ret.result.vin[0].address;
              var txid = ret.result.txid;
              if (out.scriptPubKey.type === "pubkeyhash") {

                console.log(out.value);
                console.log(out.scriptPubKey.addresses[0]);
                console.log(txid);
                var outCome = getOutcome(txid);
                console.log(outCome);
                if (outCome.bool) {
                  var satoshis = bitcore.Unit.fromBTC(out.value).toSatoshis();
                  var amount = satoshis * multiplier
                  var utxoAmount = ((satoshis * multiplier) + opretfee) - satoshis
                  console.log(utxoAmount);
                  console.log(satoshis);
                  var utxo = new bitcore.Transaction.UnspentOutput({
                    txid: txid,
                    vout: out.n,
                    address: out.scriptPubKey.addresses[0],
                    scriptPubKey: out.scriptPubKey.hex,
                    satoshis: satoshis
                  });
                  //answerBack(utxo);
                  // eslint-disable-next-line no-loop-func
                  rpc.listUnspent( function(err, ret) {
                    if (err) {
                      console.log(err);
                    }
                    //console.log(ret.result)
                   var utxos = getUtxos(ret.result, utxoAmount)
                    var transaction = new bitcore.Transaction()
                      .fee(opretfee)
                      .from(utxo)
                      .from(utxos)
                      .to(add, amount)
                      .change("a55yDzRBxgg32fJk47ZyCtBRYCSumGmrky");
                    //.addData('ionikara ole') // Add OP_RETURN data
                    //.sign(privateKey);
                    var fin = transaction.serialize({
                      disableIsFullySigned: true
                    });
                   

                   signandPublishRawTransaction(fin).then(function(ret){
                             var bet = {
                        'gameId': 'wrwrwr',
                        'depositTXID': 'txieted',
                        'betNumber': 'rwrweeterrwer',
                        'randomSeed': '12rtet3',
                        'diceRoll': '123',
                        'outcome': 'werwrw',
                    }
                    txns
                        .findOneAndUpdate({
                              app: 'zcoin'
                                }, {
                             $push: {
                                  bets: bet
                            }
                          })
                              .exec(function (err, user) {
                             if (err) throw err;
                            console.log("bet added");
                         });
                    
                       console.log(ret)
                
                   })
                  });
                }
                //Lost bets storage
              }
          } 
          }

        });

      });

      txids = ret.result;
      setTimeout(mainService, 2500);
    });
  });
  }

function signandPublishRawTransaction( fin ){
    return new Promise(function(resolve, reject){
             rpc.walletPassPhrase('YOUR PASSWORD', 10, function (err, ret) {
                      if(err){
                          console.log(err)
                      }
                    
                    rpc.signRawTransaction(fin, function(err, ret) {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log(ret.result);
                        rpc.sendRawTransaction(ret.result.hex, function(err,ret) {
                          if (err) {
                            console.log(err);
                            reject()
                          }
                          resolve("txid:" + ret)
                          //console.log("txid:" + ret);
                          
                        });
                      }
                    });
                    });

    })
}


function storeNewTx(){
    return new Promise(function(resolve, reject){

    })
}

function getUtxos(utxos, amount) {
    console.log(utxos + amount)
    var arr1 = []
    //create array with satoshis
   for(var i = 0; i < utxos.length; i++){
     arr1.push( bitcore.Unit.fromBTC(utxos[i].amount).toSatoshis())
   }
  console.log('arr: ' + arr1)
  //find the utxo i need

var fin = []
let sum = 0;
console.log(amount)
arr1.forEach((element, index) => {
    
    if (sum < amount){
    fin.push(utxos[index]);
    sum=element + sum;
    }
});
console.log(fin)
return fin;
}

function toHexString(byteArray) {
  return Array.prototype.map
    .call(byteArray, function(byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
}

function getOutcome(txid) {
  var out = txid + todayhash;
  let value = Buffer.from(out);
  let sha = bitcore.crypto.Hash.sha256(value);
  var sha1 = toHexString(sha);
  console.log(sha1);
  console.log(sha1.substr(0, 4));
  var fin = parseInt(sha1.substr(0, 4), 16);
  console.log(fin);
   var  outcome = {
            bool: true,
            value: fin
        }
  if (fin <= 60000) {
      outcome.bool = true;
      
    return (
        outcome
    )
  } else {
   outcome.bool = false
   
    return  ( 
        outcome
    )
  }
}

function returnMultiplier(address){

  switch(address){
    case 'MULTIPLIER ADDRESS HERE':
      return 2
    case 'MULTIPLIER ADDRESS HERE': 
      return 3
    default:
      break;
  }
}

module.exports = mainService;