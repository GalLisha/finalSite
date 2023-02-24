const buttonColors = ["red","blue","green","yellow"];
var gamePattern = [];
var index = 0;

$(document).on("keydown",function(event){//perss a button to start
  console.log("key was pressed");


     var randomChosenColor = buttonColors[nextSequnce()];
     gamePattern.push(randomChosenColor);
     $("." +randomChosenColor).fadeOut(100).fadeIn(100);
     makeSound(randomChosenColor);


});

$(".btn").on("click",function(event){
  var randomChosenColor = buttonColors[nextSequnce()];
  gamePattern.push(randomChosenColor);
  $("." +randomChosenColor).fadeOut(100).fadeIn(100);
  makeSound(randomChosenColor);

});


$(".btn1").on("click",function(event){
  console.log("btn pressed");
  var userChosenColour = event.target.id;
  var isSuccsess = true;

  if( userChosenColour === gamePattern[index]){
    makeSound(userChosenColour);
    index++;
    if(index == gamePattern.length){//all pattern okey
      (function(){

          setTimeout(function() {
            generateColor(); },1000);
      })();

       index=0;

    }

  }
  else{
    makeSound("wrong");
    gamePattern = [];
    userClickedPattern= [];
    index=0;
  }

});


function generateColor(){
    var randomChosenColor1 = buttonColors[nextSequnce()];
    gamePattern.push(randomChosenColor1);

    for (let i = 0; i < gamePattern.length; i++) {

     (function(i){

         setTimeout(function() {
           makeSound(gamePattern[i]);
           $("." +gamePattern[i]).fadeOut(50).fadeIn(50);
           console.log(i) },700*i);
     })(i);

}
}
function helpTimeStop(position){
  setTimeout(function(){
    alert(position);
    makeSound(gamePattern[position]);
    $("." +gamePattern[position]).fadeOut(50).fadeIn(50);
  }, 5000);

}

function nextSequnce(){
  var randomNumber = Math.floor(Math.random()*4);
  return randomNumber;
}


function makeSound(key){
//alert(key);
  switch (key) {
    case "green":
        var audio = new Audio("sounds/green.mp3");
        audio.play();

      break;
    case "blue":
        var audio = new Audio("sounds/blue.mp3");
        audio.play();

      break;
    case "red":
        var audio = new Audio("sounds/red.mp3");
        audio.play();

      break;
    case "yellow":
        var audio = new Audio("sounds/yellow.mp3");
        audio.play();

      break;
    case "wrong":
        var audio = new Audio("sounds/wrong.mp3");
        audio.play();

      break;

    default:
  }
}
