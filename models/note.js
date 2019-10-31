let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    noteText: String
});

let note = mongoose.model("Note", NoteSchema);

module.exports = note;