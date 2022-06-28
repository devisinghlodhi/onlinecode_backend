var mongoose = require("mongoose");

var jobscheema = new mongoose.Schema({
    language : {
        type: String,
        required: true,
        enum : ["cpp", "py" , "java" , "js" ,"php"]
    },
    filepath : {
        type: String,
        required: true
    },
    submitedAt : {
        type: Date,
        default: Date.now
    },
    startedAt : {
        type: Date
    },
    completedAt : {
        type: Date
    },
    output : {
        type: String
    },
    status : {
        type: String,
        default : "pending",
        enum : ["pending", "success", "error"]
    }
});

module.exports = mongoose.model("Job", jobscheema);