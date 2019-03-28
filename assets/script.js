// initialize Firebase
var config = {
    apiKey: "AIzaSyAUGsOk3ZKwobw1yD12m3bDByr7wrK3maQ",
    authDomain: "train-schedule-project-85167.firebaseapp.com",
    databaseURL: "https://train-schedule-project-85167.firebaseio.com",
    projectId: "train-schedule-project-85167",
    storageBucket: "train-schedule-project-85167.appspot.com",
    messagingSenderId: "202914585920"
};
firebase.initializeApp(config);

//   variable to reference database
var database = firebase.database();

// initial values
var trainName = "";
var trainDestination = "";
var trainFrequency = "";
var firstTrainTime = "";

// click function to add train
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // grab values from input fields
    trainName = $("#train-name").val().trim();
    trainDestination = $("#destination").val().trim();
    trainFrequency = $("#frequency").val().trim();
    firstTrainTime = $("#first-train").val().trim();

    // set values in the databse
    database.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainFrequency: trainFrequency,
        firstTrainTime: firstTrainTime,
    });
    
    // clear text boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#frequency").val("");
    $("#first-train").val("");
});

// firebase watcher 
database.ref().on("child_added", function (childSnap) {

    // store childSnaps into variables
    var trainFreq = childSnap.val().trainFrequency;
    var firstTrainTime = childSnap.val().firstTrainTime;
    var trainName = childSnap.val().trainName;
    var trainDestination = childSnap.val().trainDestination;

    // time variables

    // store current time in variable
    var currentTime = moment();
    console.log("Current time " + currentTime.format("hh:mm"));

    // time difference between current time and first train time
    var timeDiff = moment().diff(moment(firstTrainTime, "HH:mm"), "minutes");
    console.log("difference in time:" + timeDiff);

    // calculate the time since the last train arrived
    var timeSinceLastTrain = timeDiff % trainFreq;
    console.log(timeSinceLastTrain);

    // calculate time difference between the train frequency and the last train arrival
    var minutesTillTrain = trainFreq - timeSinceLastTrain;
    console.log("minutes till train: " + minutesTillTrain);

    // calculate next train arrival time
    var nextTrain = moment().add(minutesTillTrain, "minutes");
    console.log("Arrival time " + moment(nextTrain).format("HH:mm"));

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain.format("LT")),
        $("<td>").text(minutesTillTrain),
    );

    // Append the new row to the table
    $("#table-body-id").append(newRow);
});







