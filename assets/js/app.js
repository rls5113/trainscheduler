// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCj0kUF3Epp23cafO5cUs0RlZ9aLoDj-e0",
    authDomain: "train-scheduler-b0880.firebaseapp.com",
    databaseURL: "https://train-scheduler-b0880.firebaseio.com",
    projectId: "train-scheduler-b0880",
    storageBucket: "train-scheduler-b0880.appspot.com",
    messagingSenderId: "811684228677"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    // console.log("dte:"+ theDate);
    var trainStart = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#freq-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDest,
      start: trainStart,
      freq: trainFreq
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
    // database.ref().set(newTrain);
  
    // Logs everything to console
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.start);
    // console.log(newTrain.freq);
  
    alert("train successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#freq-input").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    // var tempDate = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().freq;
  
    // train Info
    console.log("name: "+trainName+" dest: "+trainDest+"   start: "+trainStart+"    frequency: " +trainFreq);
    // console.log(trainDest);
    // console.log(trainStart);
    // console.log(trainFreq);
  
    // Prettify the train start
    var trainStartPretty = moment.unix(trainStart).format("MM/DD/YYYY HH:mm");
    var trainStartTime = moment.unix(trainStart).format("MM/DD/YYYY HH:mm");
    // console.log("pretty:"+ trainStartPretty);
    // Calculate the next arrival
    var nextArrival = "";
    var minutesUntilArrival ="";

    var now = moment().format("X");
    // console.log("now:  "+ moment.unix(now).format("MM/DD/YYYY HH:mm"));
    // console.log("now:  "+now);
    // console.log("trainStart:  "+ moment.unix(trainStart).format("MM/DD/YYYY HH:mm"));
    // console.log("trainStart:  "+ trainStart);
    // var convertedStart = moment(trainStart,"X");
    var cnt = 0;
//     console.log("before:"+ moment.unix(trainStart).format("MM/DD/YYYY HH:mm"));
//     console.log("before:"+ trainStart);
   if(moment(moment.unix(now)).isSameOrBefore(moment.unix(trainStart))){
       console.log("train has not come yet.  now:"+now+"  start:"+trainStart);
        nextArrival = moment.unix(trainStart).format("HH:mm");
        minutesUntilArrival = moment.unix(now).diff(moment.unix(trainStart),"minutes",false);
        console.log(minutesUntilArrival);
    }
    else{
        console.log("train has left the station at least once.  now:"+now+"  start:"+trainStart);
        // var clone = moment(moment.unix(trainStart),"MM/DD/YYYY HH:mm");
        // console.log("after clone: "+clone);
        // console.log("after clone:"+moment.unix(clone).format("MM/DD/YYYY HH:mm"));
        var cnt = 0;
        
        // var temp = moment(trainStart);//.format("MM/DD/YYYY HH:mm");
        var temp = moment.unix(trainStart).format("MM/DD/YYYY HH:mm");
        var tempUnix = moment.unix(trainStart).format("X");
         // console.log(temp);

        while(moment(moment.unix(now)).isSameOrAfter(moment.unix(tempUnix))){
            cnt++;
            console.log("#adjustments "+cnt+"  before :    " + temp);
            temp = moment(temp).add(trainFreq,'m').format("MM/DD/YYYY HH:mm");
            tempUnix = moment(temp).format("X");
            console.log("  after :     " + temp);
         //just a safety to prevent endless loop   
        if(cnt > 10000) {
            break;
        }

        }
        // cnt++;
        // console.log("  final :" + moment.unix(clone).format("MM/DD/YYYY HH:mm"));

        nextArrival = moment.unix(tempUnix).format("HH:mm");
        minutesUntilArrival = moment.unix(tempUnix).diff(moment.unix(now),"minutes",false);
        console.log(minutesUntilArrival);

    }
 
    
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(nextArrival),
      $("<td>").text(minutesUntilArrival)
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  