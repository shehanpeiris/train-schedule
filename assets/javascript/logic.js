// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to calculate the time till next train. Use start time & frequency to calculate
//    next train and current time. Then use moment.js formatting to set difference in mins.
// 4. Calculate Time Till Next Train.

// 1. Initialize Firebase
  var config = {
    apiKey: "AIzaSyAhG_m7jnOkbwCCGua8rMoCZy-Kh7dIpJs",
    authDomain: "train-tracker-306ca.firebaseapp.com",
    databaseURL: "https://train-tracker-306ca.firebaseio.com",
    projectId: "train-tracker-306ca",
    storageBucket: "train-tracker-306ca.appspot.com",
    messagingSenderId: "845034243054"
  };

  firebase.initializeApp(config);
  
  var database = firebase.database();
  var ref = database.ref("/train-data")
  
  // 2. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainFirst =  moment($("#first-train-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
    var trainFreq = $("#frequency-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDest,
      first: trainFirst,
      frequency: trainFreq
    };
  
    // Uploads train data to the database
    ref.push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.first);
    console.log(newTrain.frequency);
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  ref.on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainFirst = childSnapshot.val().first;
    var trainFreq = childSnapshot.val().frequency;
  
    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);
  
    // To calculate the diff between the first train time and right now
    var timeRemainder = moment().diff(moment.unix(trainFirst), "minutes") % trainFreq;
    var timeMinutes = trainFreq - timeRemainder;

    // To calculate the arrival time, add the timeMinutes to the current time
    var timeArrival = moment().add(timeMinutes, "m").format("HH:mm A");
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(timeArrival),
      $("<td>").text(timeMinutes),
    );
  
    // Append the new row to the table
    $("#schedule-table > tbody").append(newRow);
  });
  
  