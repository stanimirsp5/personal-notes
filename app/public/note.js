let notesCounter = 10;
let noteText = "";
function loadNote() {
    if (notesCounter != 0) {
        multiplyNotes();
    } else {
        addNote();
    }
}

function addNote() {
    var n = Math.random() * 20 - 10;
    $("#container")
        .append('<div id="noteText" contenteditable="true"></div>')
        .children(":last")
        .css({ "transform": "rotate(" + n + "deg)" });
    // debugger
    $("#addNote").attr("disabled", true);
    $("#saveNote").attr("disabled", false);

    $("body").on('DOMSubtreeModified', "#noteText", function () {
        noteText = $("#noteText").text();
    });
}

function saveNote() {
    console.log(noteText)
}
function multiplyNotes() {
    for (let i = 0; i < notesCounter; i++) {
        addNote();
    }
}

function createDB() {
    var db;
    var request = indexedDB.open("NotesDatabase");
    request.onerror = function (event) {
        alert("Can`t access IndexedDB!");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
    };
    // const customerData = [
    //     { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    //     { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
    // ];

    // const dbName = "the_name";

    // var request = indexedDB.open(dbName, 2);

    // request.onerror = function (event) {
    //     // Handle errors.
    // };
    // request.onupgradeneeded = function (event) {
    //     var db = event.target.result;

    //     // Create an objectStore to hold information about our customers. We're
    //     // going to use "ssn" as our key path because it's guaranteed to be
    //     // unique - or at least that's what I was told during the kickoff meeting.
    //     var objectStore = db.createObjectStore("notes", { keyPath: "ssn" });

    //     // Create an index to search customers by name. We may have duplicates
    //     // so we can't use a unique index.
    //     objectStore.createIndex("name", "name", { unique: false });

    //     // Create an index to search customers by email. We want to ensure that
    //     // no two customers have the same email, so use a unique index.
    //     objectStore.createIndex("email", "email", { unique: true });

    //     // Use transaction oncomplete to make sure the objectStore creation is 
    //     // finished before adding data into it.
    //     objectStore.transaction.oncomplete = function (event) {
    //         // Store values in the newly created objectStore.
    //         var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
    //         customerData.forEach(function (customer) {
    //             customerObjectStore.add(customer);
    //         });
    //     };
    // };
}

