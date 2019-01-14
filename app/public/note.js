let notesCounter = 10;
let noteText = "";
loadNotes();
function loadNote() {
    // if (notesCounter != 0) {
    //     loadNotes();
    //     // multiplyNotes();
    // } else {
    //     addNote();
    // }
}


function addNote() {
    let n = Math.random() * 20 - 10;
    $("#container")
        .append('<div id="noteText" contenteditable="true"></div>')
        .children(":last")
        .css({ "transform": "rotate(" + n + "deg)" });
    $("#addNote").attr("disabled", true);
    $("#saveNote").attr("disabled", true);

    $("body").on('DOMSubtreeModified', "#noteText", function () {
        noteText = $("#noteText").text();
        if (noteText !== "") {
            $("#saveNote").attr("disabled", false);
        } else {
            $("#saveNote").attr("disabled", true);
        }
    });
}

function saveNote() {
    let noteObj = {
        text: noteText
        // consecutiveNote: 1
    }
    let request = indexedDB.open("NotesDB");

    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(["notes"], "readwrite");
        let objectStore = transaction.objectStore("notes");

        let request = objectStore.add(noteObj);
        request.onsuccess = function (event) {
            // alert("note added")
        };
    }
    addNote();
}

function loadNotes() {
    // request.transaction.db.name
    // let dbExists = isDbExists();
    // debugger
    // if (!dbExists) {
    //     var promise1 = new Promise(function (resolve, reject) {
    //         createDB();
    //     });
    //     promise1.then(function (value) {
    //         loadNotes()
    //     });
    // }

    // debugger
    let notes = [];
    let request = indexedDB.open("NotesDB");
    // if (request.transaction === null) {
    //     createDB();
    // }
    request.onsuccess = function (event) {
        let db = event.target.result;
        var objectStore = db.transaction("notes").objectStore("notes");
        objectStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                notes.push(cursor.value);
                cursor.continue();
            }
            else {
                // alert("Got all notes: " + notes);
                console.log(notes[1])
                multiplyNotes(notes)

            }
        };
    }
}

// function isDbExists() {
//     debugger
//     var dbExists = true;
//     var request = indexedDB.open("NotesDB");
//     request.onupgradeneeded = function (e) {
//         debugger
//         e.target.transaction.abort();
//         dbExists = false;
//     }

//     return dbExists;
// }

function multiplyNotes(notes) {
    for (let i = 0; i < notes.length; i++) {
        reloadNotes(notes[i], i);
    }
}
function reloadNotes(note, noteNum) {
    let n = Math.random() * 20 - 10;
    $("#container")
        .append(`<div id="noteText${noteNum}" contenteditable="true"></div>`)
        .children(":last")
        .css({ "transform": "rotate(" + n + "deg)" });
    $("#addNote").attr("disabled", false);
    $("#saveNote").attr("disabled", true);
    $(`#noteText${noteNum}`).text(note.text);
}

function createDB() {
    let db;
    let request = indexedDB.open("NotesDB");
    request.onerror = function (event) {
        alert("Can`t access IndexedDB!");
    };
    request.onsuccess = function (event) {
        db = event.target.result;
    };
    request.onupgradeneeded = function (event) {
        let db = event.target.result;
        const noteData = [
            { text: "buy eggs" },
            { text: "do my homework" },
            { text: "train legs" },
            { text: "wash the car" }
        ];
        let objectStore = db.createObjectStore("notes", { autoIncrement: true });
        objectStore.createIndex("text", "text", { unique: false });
        // objectStore.createIndex("consecutiveNote", "consecutiveNote", { unique: false });
        objectStore.transaction.oncomplete = function (event) {
            let customerObjectStore = db.transaction("notes", "readwrite").objectStore("notes");
            noteData.forEach(function (customer) {
                customerObjectStore.add(customer);
            });
        };
    };
}

