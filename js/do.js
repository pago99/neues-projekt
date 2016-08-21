/* Effects & Animation */

/*
document.querySelector(".dot").addEventListener('click', click);

function click() {
  var e = document.querySelector(".rankuser");
  if(e.style.display == 'block') {
    e.style.display = 'none';
  }else{
    e.style.display = 'block';
  };
};
*/


/* Timer! */

var millisec = 0;
var seconds = 0;
var timer;

function display(){

  if (millisec>=9){
     millisec=0
     seconds+=1
  }
  else
     millisec+=1
     document.getElementById("time").innerHTML = seconds + "." + millisec;
     timer = setTimeout("display()",100);
  }

function starttimer() {

  if (timer > 0) {
	return;
  }
  display();
}

function stoptimer() {
  clearTimeout(timer);
  timer = 0;
}

function startstoptimer() {
  if (timer > 0) {
     clearTimeout(timer);
     timer = 0;
  } else {
     display();
  }
};

/* ---- Buttons etc ---- */

$(document).ready(function() {
    $(".registerlink").on('click touch', function(){
        $(".foermchen").animate({right: '-=500px'}, "fast");
    });
    $(".loginlink").on('click touch', function(){
        $(".foermchen").animate({right: '+=500px'}, "fast");
    });
    $(".exit").on('click touch', function(){
        $("#overlay").css("display", "none");
    });
    $(".registerlink").on('click touch', function(){
        $(".exit").animate({left: '430px'}, "fast");
    });
    $(".loginlink").on('click touch', function(){
        $(".exit").animate({left: '30px'}, "fast");
    });
});
