

firebase.database().ref('Question of the day/').on("value",function(snapshot){
   //Returns the obj
    var snap = snapshot.val();
    document.getElementById("stuQuestion").innerHTML = snap.question;
   
  });


 
//Submit the students answer
  $('#submitBtnstudent').on('click', function(e) {
    
    var noteContent = document.getElementById("studentNote").value;
    var d=new Date;
    console.log(d.getHours());
    //Check if student is inputting during class time
    if((d.getHours()>8)&&(d.getHours()<10)){
    //month to plus 1 cus starts from 0
    var tdydate = (d.getDate()*100)+d.getMonth()+1;
    var metric = document.getElementById("studentMatric").value.toLowerCase();
      firebase.database().ref('Past Questions/').push({
        answer:noteContent,
        date:tdydate,
        metricNo:metric

       
      });
    }
    else{
      alert("SORRY YOU HAVE MISSED YOUR CLASS TIME WINDOW! DONT BE LATE NEXT TIME!");

    }

  });
