var turn=0;
var playerOneScore=0;
var playerTwoScore=0;
var isPlayerOne = true;
var cardMatrix = [],booleanMatrix = [],rows = 4,cols =10,lastImgName,lastId;
var imgNames = ["banana","bird","boy","bob","caveMan","corona","doctor","girl","girrafe","light","lion","man","mario","mask","mini","monkey","monkey1","pink","sendy","six_card"];
shuffleCards();

$(".btn1").on("click",function(event){
  turn++;
  var imgId = event.target.id;
  var imgName = cardMatrix[imgId.slice(0,1)][imgId.slice(1,2)];

  if(turn!=1){
    if(isPlayerOne){
      isPlayerOne = false;
      turn=0;
    }else{isPlayerOne = true;turn=0;}

    console.log("is player one? "+!isPlayerOne + ",turn is over");
    var imgName = cardMatrix[imgId.slice(0,1)][imgId.slice(1,2)];
    $(this).css('backgroundImage', 'url(\'images/'+imgName+'.png\')');
    if(lastImgName == imgName){
      makeSound("equals");
      (!isPlayerOne ? playerOneScore++ : playerTwoScore++);
      if(playerOneScore + playerTwoScore == 20){
        if(playerOneScore == playerTwoScore){
          alert("its a duce");
        }else{(playerOneScore > playerTwoScore ? makeSound("playerOne"): makeSound("playerTwo"));};
        initArrays();
        shuffleCards();
      }
       else{


          (function(){

              setTimeout(function() {
              $("#"+imgId).css('backgroundImage', 'url(\'images/'+"blank"+'.png\')');$("#"+lastId).css('backgroundImage', 'url(\'images/'+"blank"+'.png\')'); },1000);
          })();
      }
    }
    else{
      //$(this).css('backgroundImage', '');
      makeSound("green");
      (function(){

          setTimeout(function() {
            //$("#"+imgId).css('backgroundImage', '');$("#"+lastId).css('backgroundImage', ''); },2000);
          $("#"+imgId).css('backgroundImage', '');$("#"+lastId).css('backgroundImage', ''); },1000);
      })();
    }
  }
  else{
    makeSound("green");
    lastImgName = imgName;
    lastId = imgId;
    $(this).css('backgroundImage', 'url(\'images/'+imgName+'.png\')');
    console.log(imgId);
    console.log(imgName);

  }


});


function shuffleCards(){
  for(var i =0;i<rows;i++){
     cardMatrix[i] = [];
     booleanMatrix[i] = [false,false,false,false,false,false,false,false,false,false];
  }

  for(var i=0;i<imgNames.length;i++){
     var tempName = imgNames[i];
     var numberOfImages = 0;
     while(numberOfImages<2){
        var randRow = Math.floor(Math.random()*4);
        var randCol = Math.floor(Math.random()*10);
        if(!booleanMatrix[randRow][randCol]){
          booleanMatrix[randRow][randCol] = true;
          numberOfImages++;
          cardMatrix[randRow][randCol] = tempName;
        }
     }
  }


  for(var i =0;i<rows;i++){
     console.log(booleanMatrix[i]);
     console.log(cardMatrix[i]);
  }

}

  function initArrays(){
    for(var i =0;i<rows;i++){
       cardMatrix[i] = [];
       booleanMatrix[i] = [false,false,false,false,false,false,false,false,false,false];
    }
    $(".btn1").css('backgroundImage', 'url(\'images/'+"backCard"+'.png\')');
  }

  function makeSound(key){
      if(key == "green"){
        var audio = new Audio("sounds/green.mp3");
        audio.play();
      }
      else if(key == "equals"){
        var audio = new Audio("sounds/equals.mp3");
        audio.play();
      }
      else{
        var audio = new Audio("sounds/"+key+".mp3");
        audio.play();
      }
  }
