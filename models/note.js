let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    noteText: String
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;