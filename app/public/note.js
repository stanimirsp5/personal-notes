var noteText = "";
var lastNoteId = 0;
var notesMap = new Map();

loadNotes();
function loadNotes() {
    databaseExists("NotesDB", function (isExists) {
        if (!isExists) {
            createDB();
        } else {
            loadSavedNotes();
        }
    });
}
function addNote() {
    let n = Math.random() * 20 - 10;
    let newNoteId = lastNoteId + 1;
    $("#container")
        .append(`<div id="${newNoteId}" contenteditable="true"></div>`)
        .children(":last")
        .css({ "transform": "rotate(" + n + "deg)" });
    $("#addNote").attr("disabled", true);
    $("#saveNote").attr("disabled", true);
    let newNoteIdTag = $(`#${newNoteId}`);

    newNoteIdTag.dblclick(function () {
        removeDivTagNote(newNoteIdTag);
    });
    $("#container").on('DOMSubtreeModified', newNoteIdTag, function () {
        noteText = newNoteIdTag.text();
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
    }
    let request = indexedDB.open("NotesDB");

    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(["notes"], "readwrite");
        let objectStore = transaction.objectStore("notes");

        let request = objectStore.add(noteObj);
        request.onsuccess = function (event) {
            lastNoteId++;
            addNote();
            $(`#${lastNoteId}`).attr('contenteditable', 'false');
        };
    }
}
function loadSavedNotes() {
    let request = indexedDB.open("NotesDB");
    request.onsuccess = function (event) {
        let db = event.target.result;
        var objectStore = db.transaction("notes").objectStore("notes");
        objectStore.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                lastNoteId = cursor.key;
                notesMap.set(cursor.key, cursor.value.text);
                cursor.continue();
            }
            else {
                multiplyNotes(notesMap);
            }
        };
    }
}
function databaseExists(dbname, callback) {
    var req = indexedDB.open(dbname);
    var existed = true;
    req.onsuccess = function () {
        req.result.close();
        if (!existed)
            indexedDB.deleteDatabase(dbname);
        callback(existed);
    }
    req.onupgradeneeded = function () {
        existed = false;
    }
}
function isDbExists() {
    var dbExists = true;
    var request = indexedDB.open("NotesDB");
    request.onupgradeneeded = function (e) {
        e.target.transaction.abort();
        dbExists = false;
    }
    return dbExists;
}
function multiplyNotes(notesMap) {
    for (let [key, value] of notesMap) {
        reloadNotes(value, key);
    }
}
function reloadNotes(noteText, noteKey) {
    let n = Math.random() * 20 - 10;
    $("#container")
        .append(`<div id="${noteKey}" contenteditable="false"></div>`)
        .children(":last")
        .css({ "transform": "rotate(" + n + "deg)" });
    $("#addNote").attr("disabled", false);
    $("#saveNote").attr("disabled", true);
    let currentNote = $(`#${noteKey}`);
    currentNote.text(noteText);
    currentNote.dblclick(function () {
        removeDivTagNote(currentNote)
    });
}
function removeDivTagNote(currentNote) {
    if (currentNote.text() === "") {
        return;
    }
    let noteId = currentNote.selector.substring(1);
    currentNote.remove();
    removeNote(+noteId);
}
function createDB() {
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
        objectStore.transaction.oncomplete = function (event) {
            let customerObjectStore = db.transaction("notes", "readwrite").objectStore("notes");
            noteData.forEach(function (customer) {
                customerObjectStore.add(customer);
            });
            loadSavedNotes();
        };
    };
}

function removeNote(noteId) {
    let request = indexedDB.open("NotesDB");
    request.onsuccess = function (event) {
        let db = event.target.result;
        var objectStore = db.transaction("notes").objectStore("notes");
        objectStore.openCursor(noteId).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var request = db.transaction(["notes"], "readwrite")
                    .objectStore("notes")
                    .delete(cursor.key);
                request.onsuccess = function () {
                };
            } else {
                alert("Can`t delete note")
            }
        };
    }
}

