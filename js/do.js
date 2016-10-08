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

function display(hook){
    if (millisec>=9){
        millisec=0
        seconds+=1
    } else {
        millisec+=1
    }
    document.getElementById(hook).innerHTML = seconds + "." + millisec;
    timer = setTimeout(function(){
        display(hook);
    }, 100);
}

function starttimer(hook) {

  if (timer > 0) {
	return;
  }
  display(hook);
}

function stoptimer() {
  clearTimeout(timer);
  timer = 0;
}

function startstoptimer(hook) {
  if (timer > 0) {
     clearTimeout(timer);
     timer = 0;
  } else {
     display(hook);
  }
}

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

    $(".impbutton").on('click touch', function(){
        $(".impdata").toggle();
        $("#impress").css("width", "100%");
    });
});
