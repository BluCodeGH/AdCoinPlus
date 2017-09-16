$(document).ready(function(){
var port = chrome.extension.connect({
  name: "Sample Communication"
});

$('[data-toggle="tooltip"]').tooltip();


var maxThreads = 0;
chrome.system.cpu.getInfo(function(info){
  maxThreads = info.numOfProcessors;
  $("#threads2").text( maxThreads - 1 );
});

$("#threads-plus").click(function(){
  if ( parseInt($("#threads").text()) < maxThreads ) {
    $("#threads").text( parseInt($("#threads").text()) + 1 );
  }
})

$("#threads-minus").click(function(){
  if ( parseInt($("#threads").text()) > 1) {
    $("#threads").text( parseInt($("#threads").text()) - 1 );
  }
})

$("#threads-plus-2").click(function(){
  if ( parseInt($("#threads2").text()) < maxThreads ) {
    $("#threads2").text( parseInt($("#threads2").text()) + 1 );
  }
})

$("#threads-minus-2").click(function(){
  if ( parseInt($("#threads2").text()) > 1) {
    $("#threads2").text( parseInt($("#threads2").text()) - 1 );
  }
})

var bg = chrome.extension.getBackgroundPage();

port.onMessage.addListener(function(msg) {
  if (msg == true) {
    $("#action-button").removeClass('btn-success');
    $("#action-button").addClass('btn-warning');
    $("#action-button").text("Stop");
  } else {
    $("#action-button").addClass('btn-success');
    $("#action-button").removeClass('btn-warning');
    $("#action-button").text("Start");
  }
});

port.postMessage("status");

$(".dropdown-option").click(function(){
  var clickedText = $(this).text()
  console.log(clickedText);
  $("#dropdown-title").text(clickedText)
});
$("#action-button").click(function(){
  if ($(this).hasClass('btn-success')) {
    // CLICK TO STOP
    $(this).removeClass('btn-success');
    $(this).addClass('btn-warning');
    $(this).text("Stop");
    port.postMessage("start");
  } else {
    // CLICK TO START AGAIN
    $(this).removeClass('btn-warning');
    $(this).addClass('btn-success');
    $(this).text("Start");
    port.postMessage("stop");
  }
})

setInterval(function() { //Update UI
  var totalHashes = bg.miner.getTotalHashes(true);

  $("#total").text(bg.initialTotalHashes + totalHashes);
  $("#session").text(totalHashes);
}, 100)

setInterval(function() { //Update UI
  var HPS = bg.miner.getHashesPerSecond();

  $("#hps").text(HPS.toFixed(1));
}, 1000)

});
