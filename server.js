//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const date = require(__dirname + "/date.js");
require('dotenv').config({ path: './mongo.env' });
//const date = require(__dirname + "gfjkhgdjk/date.js");
//const triviaHelp = require(__dirname+"/public/js/trivia.js");
//C:\Users\גל לישה\Desktop\round 2\GalWeb\public\js\trivia.js

const app = express();

const mongoose = require('mongoose');

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

//cluster user pass: Galisha12345
//const MONGODB_URI = "mongodb+srv://katya:${process.env.MONGODB_PASSWORD}@todolist.niaely8.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_URI = `mongodb+srv://katya:${process.env.MONGOD_PASSWORD}@todolist.niaely8.mongodb.net/?retryWrites=true&w=majority`;
//mongoose.connect('mongodb://localhost:27017/todolistDB',{useNewUrlParser: true});
mongoose.connect(MONGODB_URI ,
{useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
  console.log("mongoose is connected!");
});

//to do list Schema
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  name: String,
  date: String
});

const Item = mongoose.model('Item',ItemSchema);

//poker list Schema
const Schema1 = mongoose.Schema;
const RecordSchema = new Schema1({
  name: String,
  rebuys: Number
});

const Record = mongoose.model('Record',RecordSchema);

//trivia Schema
const Schema2 = mongoose.Schema;
const QuestionSchema = new Schema2({
question: String,
optionA: String,
optionB: String,
optionC: String,
optionD: String,
answer: String,
difficulty: String
});

const Question = mongoose.model('Question',QuestionSchema);

//work Schema
const Schema3 = mongoose.Schema;
const AppLogSchema = new Schema3({
Firstname: String,
Lastname: String,
CompaniesLog: [{
  companyCode: Number,
  changes: [{
    isSynchronized: Boolean
  }]
}]

});

const AppLog = mongoose.model('AppLog',AppLogSchema);



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render("index", {});
});

app.get("/toDoList", function(req, res) {
  const day = date.getDate();//for the title

  let ans = [];

    Item.find({},function(err,foundItems){
      if(err){
      console.log("cannot read from document");
      res.render("list", {listTitle: day, newListItems: ans});
    }else{
      foundItems.forEach(function(temp){

          ans.push(temp.name);

      });
      res.render("list", {listTitle: day, newListItems: ans});
    }
    });
});

app.post("/toDoList", function(req, res){

  const tempItem = req.body.newItem;
  const removeItem = req.body.removeMission;

  if(tempItem != null && tempItem != ""){
    let  today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    const item = new Item ({
        name: tempItem,
        date: today
    });

    const result = Item.insertMany(item,function(err){
      err ? "eror in insert" : "insrt success";
    });
    res.redirect("/toDoList");
  }

  if(removeItem != null){
    Item.deleteOne({name:removeItem},function (error, docs) {
            if (error){
             console.log(err)
            }
            else{
             console.log("doc is deleted : ", docs);
             res.redirect("/toDoList");
             }
             });
  }


});

app.get("/pokerList", function(req, res) {
const day = date.getDate();

let ans = [];
let totalMoney=0;
let totalChips=0;
  Record.find({},function(err,foundItems){
    if(err){
    console.log("cannot read from document");
    res.render("pokerList", {listTitle: day, newListItems: ans});
  }else{
    foundItems.forEach(function(temp){
        ans.push(temp);
        totalMoney += temp.rebuys *20;
        totalChips += temp.rebuys * 5000;
    });
    res.render("pokerList", {listTitle: day, newListItems: ans,totalMoney:totalMoney,totalChips:totalChips});
  }
  });

});

app.post("/pokerListHome", function(req, res){
  res.redirect("/");
});

app.post("/pokerList", function(req, res){

  const tempRecord = req.body.newPlayer;


  if(tempRecord != null && tempRecord != ""){
    const record = new Record ({
        name: tempRecord,
        rebuys: 1
    });

    const result = Record.insertMany(record,function(err){
      err ? "eror in insert" : "insrt success";
    });
    res.redirect("/pokerList");
  }

  const addrebuys = req.body.addRebuy;
  const removerebuys = req.body.removeRebuy;
  const refresh = req.body.refresh;
  if(refresh != null){
    console.log("refresh clicked" + tempRecord);
    //prompt("Please enter your name", "Harry Potter");
    Record.deleteMany({},function(err){
      if(err){
        console.log("cannot delete all records");
      }
    });

    res.redirect("/pokerList");
  }
  if(addrebuys != null){

    //console.log("+ is clicked");
    //console.log( addrebuys);
     Record.findOne({name: addrebuys},function(err,obj){
      if(err){
        console.log("cannot find any parson with that name");
      }else{
        //console.log(obj.rebuys);
        Record.updateOne({name:obj.name},
                {rebuys:obj.rebuys+1}, function (error, docs) {
                if (error){
                 console.log(err)
                }
                else{
                 //console.log("Updated Docs : ", docs);
                 res.redirect("/pokerList");
                 }
                 });
      }
    });
  }
  if(removerebuys != null){
    console.log("- is clicked");
    Record.findOne({name: removerebuys},function(err,obj){
     if(err){
       console.log("cannot find any parson with that name");
     }else{
       //console.log(obj.rebuys);
       if(obj.rebuys === 1){
         Record.deleteOne({name:obj.name},function (error, docs) {
                 if (error){
                  console.log(err)
                 }
                 else{
                  console.log("doc is deleted : ", docs);
                  res.redirect("/pokerList");
                  }
                  });
       }else{
         Record.updateOne({name:obj.name},
                 {rebuys:obj.rebuys-1}, function (error, docs) {
                 if (error){
                  console.log(err)
                 }
                 else{
                  //console.log("Updated Docs : ", docs);
                  res.redirect("/pokerList");
                  }
                  });
       }

     }
   });

  }

});

app.get("/memoryGame", function(req, res) {
    res.render("memoryGame", {});
});

app.get("/simonGame", function(req, res) {
    res.render("simonGame", {});
});

let doPress = "no";
let questionNumber=1;
let questionsAsked = [];
let ans = ["","","","","",""];
let difficult = "easy";

const currentPrice = ["100₪","200₪","300₪","500₪","1000₪","2000₪","4000₪","8000₪","16000₪","32000₪","64000₪"
,"125000₪","250000₪","500000₪","1000000₪"];
let currentPriceIndex = 0;
let quitprice = "0";
let safetyNet = "0";
let wrongAnswer = false;

//help vars
let frinedSentences = ["I think the answer is:","Im not realy sure, maybe the anser is:","Dont trust me, i think its:",
"let me focus for a second, go for:","its a hard one, maybe its:"];
let friendHelp = false;
let fiftyFifty = false;
let audienceHelp = false;
let toDis = "";//for friend help
let forAudience = "";
let forFiftyFifty="";
let doQuit = false;
let doWinner = false;

app.get("/millionaire", function(req, res) {
  console.log(friendHelp);
  //console.log(friendHelp +""+ fiftyFifty+""+ audienceHelp);
  if(doWinner){
    res.render("millionaire", {newQuestion: "",questionA:"",questionB:"",questionC:"",questionD:"",currentPrice:"",help:"",
    quitprice:quitprice,safetyNet:safetyNet,win: "Congratulations you won the big prize:1000000₪, press start to start again",toDis:toDis,
    toFifty:forFiftyFifty,toAudience:forAudience});
    wrongAnswer = false;
    quitprice = "0";
    safetyNet = "0";
    doWinner=false;
    finishGame();
    return ;
  }
  if(wrongAnswer){
    res.render("millionaire", {newQuestion: "",questionA:"",questionB:"",questionC:"",questionD:"",currentPrice:"",help:"",
    quitprice:quitprice,safetyNet:safetyNet,win: "You Won: "+safetyNet+", press start to start again",toDis:toDis,
    toFifty:forFiftyFifty,toAudience:forAudience});
    wrongAnswer = false;
    quitprice = "0";
    safetyNet = "0";
    return ;
  }
  if(doQuit){
    res.render("millionaire", {newQuestion: "",questionA:"",questionB:"",questionC:"",questionD:"",currentPrice:"",help:"",
    quitprice:quitprice,safetyNet:safetyNet,win: "You Won: "+quitprice+", press start to start again",toDis:toDis,
    toFifty:forFiftyFifty,toAudience:forAudience});
    doQuit = false;
    quitprice = "0";
    safetyNet = "0";
    return ;
  }
  if(friendHelp || fiftyFifty || audienceHelp){
    let check = handleHalp();
    console.log(friendHelp +""+ fiftyFifty+""+ audienceHelp);
    res.render("millionaire", {newQuestion: ans[0] ,questionA:"A:"+ans[1],questionB:"B:"+ans[2],
          questionC:"C:"+ans[3],questionD:"D:"+ans[4],currentPrice: currentPrice[currentPriceIndex],help:check,
          quitprice:quitprice,safetyNet:safetyNet,win:"",toDis:toDis,toFifty:forFiftyFifty,toAudience:forAudience});
          //let check = handleHalp();
          return;
  }

  if(doPress === "yes"){
     if(currentPriceIndex > 4 && currentPriceIndex <= 10){//was bigger than 6
       difficult = "medium";
     }else if(currentPriceIndex>10){//need to add hell diffucult for half mill and mill QUESTION:
       difficult = "hard";
     }

    var i;
    Question.find({difficulty:difficult},function(err,foundItems){
       if(err){
       console.log("cannot read from document");
       }else{
         while(true){
           i = Math.floor((Math.random() * foundItems.length));

           for(var j=0;j<questionsAsked.length;j++){
             if(questionsAsked[j] === foundItems[i].question){
                break;
             }
           }
           if(j === questionsAsked.length){
             break;
           }
         }
         questionsAsked.push(foundItems[i].question);
         //console.log(foundItems);
         //console.log("i = "+i + "qa = "+ questionsAsked[0] + "q1 = " +foundItems[i].optionA );
         var counter =1;
         while(counter <=4){
            var index = Math.floor((Math.random() * 4)+1);
            if(ans[index] === ""){
              switch(counter){
                case 1:
                  ans[index] = foundItems[i].optionA;
                  //console.log("case1: " + ans[index] + foundItems[i].questionA);
                  counter++;
                  break;
                case 2:
                  ans[index] = foundItems[i].optionB;
                  counter++;
                  break;
                case 3:
                  ans[index] = foundItems[i].optionC;
                  counter++;
                  break;
                case 4:
                  ans[index] = foundItems[i].optionD;
                  counter++;
                  break;
              }
            }
         }
         ans[0] = foundItems[i].question;
         ans[5] = foundItems[i].answer;
        //questionsAsked = foundItems.question;
        //console.log(foundItems);
        res.render("millionaire", {newQuestion: ans[0] ,questionA:"A:"+ans[1],questionB:"B:"+ans[2],
              questionC:"C:"+ans[3],questionD:"D:"+ans[4],currentPrice: currentPrice[currentPriceIndex],help:"",
              quitprice:quitprice,safetyNet:safetyNet,win:"",toDis:toDis,toFifty:forFiftyFifty,toAudience:forAudience});
      }
       });
      }
    //res.redirect("millionaire", {newQuestion: "hey",questionA:"one",questionB:"two",questionC:"three",questionD:"four"});
  else{//wrong answer is pressed
    res.render("millionaire", {newQuestion: "",questionA:"",questionB:"",questionC:"",questionD:"",currentPrice:"",help:"",
    quitprice:quitprice,safetyNet:safetyNet,win:"",toDis:toDis,toFifty:forFiftyFifty,toAudience:forAudience});

  }

});

app.post("/millionaire",function(req,res){
  console.log("in post miilonaire");
  const dostart = req.body.start;
  const quit = req.body.quitGame;
  if(dostart === ""){
    console.log("start click");
    doPress = "yes";

    // const question = new Question({
    //  question: "In which Disney movie can you see a character named Mr. Banks?",
    //  optionA: "The Aristocats",
    //  optionB: "Mary Poppins",
    //  optionC: "Pinocchio",
    //  optionD: "The Beauty and the Tramp",
    //  answer: "Mary Poppins",
    //  difficulty: "hard"
    //  });
    //
    // const result = Question.insertMany(question,function(err){
    //  if(err){
    //    console.log("error in insert");
    //  }else{
    //    console.log("insert success");
    //  }
    // });

    // const appLog = new AppLog({
    //   Firstname: 'dani',
    //   Lastname: 'lisha',
    //   CompaniesLog: [{
    //     companyCode: 7,
    //     changes: [{
    //       isSynchronized: false
    //     },{
    //       isSynchronized: true
    //     }]
    //   }]
    //  });
    //
    //  const result = AppLog.insertMany(appLog,function(err){
    //   if(err){
    //     console.log("error in insert");
    //   }else{
    //     console.log("insert success");
    //   }
    //  });

  }
  if(quit === ""){
    console.log("quit is pressed");
    doQuit = true;
  }
  let A =  req.body.option1;
  let B =  req.body.option2;
  let C =  req.body.option3;
  let D =  req.body.option4;
  console.log(A + B + C + D);
  if(A != null){
    if(A.slice(2) == ans[5]){
      currentPriceIndex++;
    }else{
      wrongAnswer = true;
      finishGame();
    }
  }
  else if(B != null ){
    if(B.slice(2) == ans[5]){
      currentPriceIndex++;
    }else{
      wrongAnswer = true;
      finishGame();
    }

  }
  else if(C != null ){
    if(C.slice(2) == ans[5]){
      currentPriceIndex++;
    }else{
      wrongAnswer = true;
      finishGame();
    }
  }

  else if(D != null ){
    if(D.slice(2) == ans[5]){
      currentPriceIndex++;
    }else{
      wrongAnswer = true;
      finishGame();
    }

  }

  if(currentPriceIndex>4 && currentPriceIndex <8){
    safetyNet = "1000₪";
    quitprice = currentPrice[currentPriceIndex-1];
  }
  else if(currentPriceIndex>8){
    safetyNet = "16000";
    quitprice = currentPrice[currentPriceIndex-1];
  }
  if(currentPriceIndex === 15){// we had a Winner - 1000000 price
    doWinner = true;
  }
  ans = ["","","","","",""];
  res.redirect("/millionaire");
});

app.post("/millionaireHelp",function(req,res){
  let friend =  req.body.callAfriend;
  let audience =  req.body.audience;
  let fifty =  req.body.fifty;

  if(friend != null){
    console.log(friend);
    friendHelp = true;
  }
  if(audience != null){
    audienceHelp=true;
    console.log(audience);
  }
  if(fifty != null){
    fiftyFifty = true;
    console.log(fifty);
  }
  res.redirect("/millionaire");
});

function handleHalp(){
  if(friendHelp){
    let index = Math.floor((Math.random() * frinedSentences.length));
    friendHelp = false;
    toDis = "disabled";
    return frinedSentences[index] + ans[5];
  }else if(audienceHelp){
    audienceHelp = false;
    forAudience = "disabled";
    let optionAnswer = checkCurrentAsnwer();
    let base = 5;//10 % for every answer
    let forAnswer = Math.floor((Math.random() * 49)+21);

    let aVotes,bVotes,cVotes,dVotes;
    let restVotes = 100 - forAnswer - 4*base;
    if(optionAnswer === "A"){
      aVotes = forAnswer + base;
      bVotes = Math.floor((Math.random() * restVotes/2)+base);
      cVotes = Math.floor((Math.random() * (100-aVotes-bVotes)/2)+base);
      dVotes = 100-aVotes-bVotes-cVotes;
    }else if(optionAnswer === "B"){
      bVotes = forAnswer + base;
      aVotes = Math.floor((Math.random() * restVotes/2)+base);
      cVotes = Math.floor((Math.random() * (100-aVotes-bVotes)/2)+base);
      dVotes = 100-aVotes-bVotes-cVotes;
    }else if(optionAnswer === "C"){
      cVotes = forAnswer + base;
      aVotes = Math.floor((Math.random() * restVotes/2)+base);
      bVotes = Math.floor((Math.random() * (100-aVotes-cVotes)/2)+base);
      dVotes = 100-aVotes-bVotes-cVotes;
    }else{
      dVotes = forAnswer + base;
      aVotes = Math.floor((Math.random() * restVotes/2)+base);
      bVotes = Math.floor((Math.random() * (100-aVotes-dVotes)/2)+base);
      cVotes = 100-aVotes-bVotes-dVotes;
    }
    if(aVotes <0){aVotes = 0;}
    if(bVotes <0){bVotes = 0;}
    if(cVotes <0){cVotes = 0;}
    if(dVotes <0){dVotes = 0;}

    let finalVotes = "A: " + aVotes +"%, B: " + bVotes + "%, C: " +cVotes + "%, D: " + dVotes+"%";
    console.log(finalVotes);
    return finalVotes;
  }
  else{
    fiftyFifty = false;
    forFiftyFifty = "disabled";
    let optionAnswer = checkCurrentAsnwer();
    let curAns;
    let option=0;
    if(optionAnswer === "A"){
       option = Math.floor((Math.random() *3 )+2);
       curAns = 1;
    }else if(optionAnswer === "B"){
       curAns = 2;
       while(option ===0 || option ===2){
         option = Math.floor((Math.random() *4 )+1)
       }
    }else if(optionAnswer === "C"){
       curAns = 3;
       while(option ===0 || option ===3){
         option = Math.floor((Math.random() *4 )+1)
       }
    }else{
      curAns = 4;
      option = Math.floor((Math.random() *3 )+1)
    }
    for(let i=1;i<5;i++){
      if(i != curAns && i != option){
        ans[i] = "";
      }
    }
  }

}

function checkCurrentAsnwer(){
   if(ans[1] === ans[5]){
      return "A";
   }else if(ans[2] === ans[5]){
      return "B";
   }else if(ans[3] === ans[5]){
      return "C";
   }else{
      return "D";
   }


}

function finishGame(){
   //initial all variables
   friendHelp = false;
   fiftyFifty = false;
   audienceHelp = false;
   doPress = "no";
   questionNumber=1;
   ans = ["","","","","",""];
   difficult = "easy";
   currentPriceIndex = 0;
   toDis="";
   forAudience="";
   forFiftyFifty="";
}

//let history = "Guess History:";
let numbers = [false,false,false,false,false,false,false,false,false,false];
let randomNumber = "";
let guesses = [];
let isWin = false;

app.get("/bullsAndCows",function(req,res){
  if(isWin){
    res.render("bullsAndCows", {guesses:guesses});
    numbers = [false,false,false,false,false,false,false,false,false,false];
    randomNumber = "";
    guesses = [];
    isWin = false;
  }else{
    res.render("bullsAndCows", {guesses:guesses});
  }

});

app.post("/bullsAndCows",function(req,res){
  const start = req.body.start;
  if(start != null){
    numbers = [false,false,false,false,false,false,false,false,false,false];
    randomNumber = "";
    guesses = [];
    isWin = false;
    let counter = 1;
    while(counter <= 4 ){
      let random = 0;
      if(counter === 1){
        random = Math.floor((Math.random() * 9)+1);//1 to 9
        if(numbers[random] === false){
          numbers[random] = true;
          counter++;
          randomNumber += random;
        }
      }else{
        random = Math.floor((Math.random() * 10));//0 to 9
        if(numbers[random] === false){
          numbers[random] = true;
          counter++;
          randomNumber += random;
        }
      }
    }

  }else{
    console.log("not press");
  }
  res.redirect("/bullsAndCows");
});

app.post("/bullsAndCowsGuess",function(req,res){
   const tempGuess = req.body.newGuess;
   if(guesses.length === 0){
     guesses.push("Guess History:");
   }
   checkNumbersPositions(tempGuess);
   res.redirect("/bullsAndCows");
});

function checkNumbersPositions(tempGuess){
  let currentBulls = 0;
  let currentCows = 0;

  for(let i =0;i<4;i++){
    for(let j =0;j<4;j++){
      if(tempGuess[i] === randomNumber[j]){
        if(i === j){
          currentBulls++;
        }
        else{
          currentCows++;
        }
      }
    }
  }
  if(currentBulls === 4){
    guesses.push("You Found The Secret Number");
    isWin = true;
  }else{
    guesses.push(tempGuess+": "+"Bulls:"+currentBulls+", Cows:"+currentCows);

  }
}


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
