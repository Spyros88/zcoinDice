var mainService = require('./mainService')
var mongoose = require('mongoose');
var txns = require('./model/txns');
//connect database
async function connect(){

  await mongoose.connect('mongodb://192.168.1.152/zcoinDice', 
 {useNewUrlParser: true,
 useUnifiedTopology: true,
 useFindAndModify: false},
 () => console.log('Connected to DB!'))
}

 connect().then(() =>{
    mainService();   
})


