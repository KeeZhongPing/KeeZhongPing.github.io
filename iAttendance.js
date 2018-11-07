var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition = new SpeechRecognition();
// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = false;

var noteTextarea = $('#note-textarea');
var noteContent='';
 

recognition.onresult = function(event) {

 
    var current = event.resultIndex;
  
    //put the words into transcript
    var transcript = event.results[current][0].transcript;
  
    //add transcript inside content to textbox to show
      noteContent += transcript;
      noteTextarea.val(noteContent);
    };
  

$('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
      noteContent = '';
    }
    recognition.start();
  });
  $('#submitBtn').on('click', function(e) {
    var d=new Date;
    //month to plus 1 cus starts from 0
    var tdydate = (d.getDate()*100)+d.getMonth()+1;
    
      firebase.database().ref('Question of the day/').set({
        question:noteContent,
        date:tdydate
       
      });
    
  });
  $('#submitDate').on('click', function(e) {
    document.getElementById("QnA").innerHTML="";
    var qnalist = document.getElementById("QnA");
    var dateinput = document.getElementById("getDate").value;
    firebase.database().ref().child("Past Questions/").on("value", function(snapshot) {
      var ind = 0;
          snapshot.forEach(function(data) {
            var key = Object.keys(snapshot.val())[ind];
            var snap = snapshot.child(key).val();
           if(snap.date==dateinput){
          var ans = snap.answer;
          var metric = snap.metricNo;
          var list = document.createElement("li");
          list.appendChild(document.createTextNode(metric));
          qnalist.appendChild(list);
          var listAns = document.createElement("dl");
          listAns.appendChild(document.createTextNode(ans));
          qnalist.appendChild(listAns);

           }
      
              ind++;
          });
      });
  });
  $('#submitAbsent').on('click', function(e) {
    document.getElementById("Abs").innerHTML="";
    var abslist = document.getElementById("Abs");
    var dateinputID = document.getElementById("getAbsent").value;
    var count=0;
    firebase.database().ref().child("StudentIDs/").on("value", function(snapshotID) {
snapshotID.forEach(function(dataID) {
  var complete = false;
  var id = "ID"+count;
console.log(snapshotID.child(id).val());
    firebase.database().ref().child("Past Questions/").on("value", function(snapshot) {
     //Check every pass question for id
      var ind = 0;
          snapshot.forEach(function(data) {
            var key = Object.keys(snapshot.val())[ind];
            var snap = snapshot.child(key).val();
           if((snap.date==dateinputID)&&(snap.metricNo==snapshotID.child(id).val())){
            //Inside key
            complete=true;
           }
      
              ind++;
          });
      
console.log(complete);
    if(complete==false){
console.log("This guy is absent"+snapshotID.child(id).val());
var list = document.createElement("li");
          list.appendChild(document.createTextNode(snapshotID.child(id).val()));
          abslist.appendChild(list);

    }
  });
    count++;
    });
  });

});


  // Sync the text with the note
noteTextarea.on('input', function() {
    noteContent = $(this).val();
  })
  