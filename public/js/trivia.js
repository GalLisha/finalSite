//jshint esversion:6

//  const button = document.querySelector('#help-btn');

// document.getElementById('startBtn').addEventListener("click", function(){
//   console.log("in function");
//    var sec = 60;
//    var timer = setInterval(function(){
//        document.getElementById('safeTimerDisplay').innerHTML=sec;
//        sec--;
//        console.log("in function inside");
//        if (sec < 0) {
//            clearInterval(timer);
//        }
//    }, 1000);
// });
$("#startBtn").on("click",function(event){
  console.log("in function");
   var sec = 60;
   var timer = setInterval(function(){
       document.getElementById('safeTimerDisplay').innerHTML=sec;
       sec--;
       console.log("in function inside");
       if (sec < 0) {
           clearInterval(timer);
       }
   }, 1000);

});


// const button = document.getElementById('startBtn');
// console.log(button);
// button.addEventListener("click",function (){
//    console.log("in function");
//     var sec = 60;
//     var timer = setInterval(function(){
//         document.getElementById('safeTimerDisplay').innerHTML=sec;
//         sec--;
//         if (sec < 0) {
//             clearInterval(timer);
//         }
//     }, 1000);
// });


function timer(){
   console.log("in function");
    var sec = 60;
    var timer = setInterval(function(){
        document.getElementById('safeTimerDisplay').innerHTML=sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
        }
    }, 1000);
}

// const button = document.querySelector('.friendHelp');
//
// const disableButton = () => {
//   console.log("workeddddd");
//     // setTimeout(function (){
//
//      // }, 2000); // How long you want the delay to be, measured in milliseconds.
//
//
//
// };
//
// button.addEventListener('click', function(){
//       console.log("befoe ece");
//
//       setTimeout(function() {
//         console.log("here");
//         button.disabled = true; },1000);
//
// });

// const button = document.querySelector(".button-test");
//
// button.addEventListener('click', function(){
// console.log("click ditected");
//
//             disableButton();
//
// });
//
// const disableButton = () => {
//   button.disabled = true;
// };
//console.log("its worked outside");
