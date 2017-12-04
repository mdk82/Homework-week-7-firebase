
// Firebase //
// ======== //

var config = {
    apiKey: "AIzaSyCzgEZh6uLShPGF6XD3H_zrxOcSnxqnqwc",
    authDomain: "train-scheduler-9a8bc.firebaseapp.com",
    databaseURL: "https://train-scheduler-9a8bc.firebaseio.com",
    projectId: "train-scheduler-9a8bc",
    storageBucket: "",
    messagingSenderId: "423615945419"
};

firebase.initializeApp(config);

var dataRef = firebase.database();

// Globle Variables //
// ================ //

var trainName;
var trainDestination;
var trainFrequency;
var nextArrival;
var timeLeft;
var currentTime = moment();

    console.log('current time: ' + moment(currentTime).format('hh:mm:ss A'));

// On click push input values to variables //
// ======================================= //

$('#add-train').on('click', function() {
    console.log('working');

    event.preventDefault();

        trainName = $('#train-name').val().trim();
        trainDestination = $('#destination').val().trim();
        trainFrequency = $('#frequency').val().trim();
        nextArrival = $('#arrival').val().trim();

// Push to firebase //
// ================ //

    firebase.database().ref().push( {

        trainName: trainName,
        trainDestination: trainDestination,
        trainFrequency: trainFrequency,
        nextArrival: nextArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP

    });

    // Set form fields back to blank //
    // ============================= //

    $('#train-name').val("");
    $('#destination').val("");
    $('#frequency').val("");
    $('#arrival').val("");

});

// Logic for converting time in moment.js //
// ====================================== //

dataRef.ref().on('child_added', function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

    var arrivalTime = childSnapshot.val().nextArrival;
    var time = arrivalTime.split(":");
    var trainTime = moment().hours(time[0]).minutes(time[1]);
    var maxTime = moment.max(moment(), trainTime);

    var minutes;
    var arrival;

    if (maxTime === trainTime) {
        minutes = trainTime.format('hh:mm A');
        arrival = trainTime.diff(moment(), "minutes");
    } else {

        var timeDiff = moment().diff(trainTime, "minutes");
        var timeRemainder = timeDiff % childSnapshot.val().trainFrequency
        arrival = childSnapshot.val().trainFrequency - timeRemainder;

        minutes = moment().add(arrival, "m").format("hh:mm A");
    }

    console.log("arrival:", arrival);
    console.log("minutes:", minutes);

    // Append new trains to the schedule dynamicaly //
    // ============================================ //
    
    $('.schedule').append(
        ("<tr>") +
        ("<td>") + childSnapshot.val().trainName + ("</td>") +
        ("<td>") + childSnapshot.val().trainDestination + ("</td>") +
        ("<td>") + childSnapshot.val().trainFrequency + ("</td>") +
        ("<td>") + arrival + " mins" + ("</td>") +
        ("<td>") + minutes + ("</td>") +
        ("<tr>")
    )

});

