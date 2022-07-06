const Queue = require("bull");
const Job = require("../Models/job")
const {executeCpp} = require('./executeCpp');
const {executePy} = require('./executePy');
const {executeJavascript} = require('./executeJavascript');
const { executeJava } = require('./executeJava');
const { executeGo } = require('./executeGo');
const { executeR } = require('./executeR');
const { executeRuby } = require('./executeRuby');
const { executeKotlin } = require('./executeKotlin');
const { executePhp } = require('./executePhp');
const { executeCsharp } = require('./executeCsharp');
const { executeSwift } = require('./executeSwift');

const jobQueue = new Queue("job-queue");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
    console.log(data);
    const { id: jobId } = data;
    const job = await Job.findById(jobId);
    if (job === undefined) {
        throw Error("Job not found")
    }
    console.log("Fetched Job", job);

    try {

        job["startedAt"] = new Date();

        if (job.language == "cpp") {
            output = await executeCpp(job.filepath);
        }
        else if (job.language == "py") {
            output = await executePy(job.filepath);
        }
        else if (job.language == "java") {
            output = await executeJava(job.filepath);
        }
        else if (job.language == "js") {
            output = await executeJavascript(job.filepath);
        }
        else if (job.language == "go") {
            output = await executeGo(job.filepath);
        }
        else if (job.language == "cs") {
            output = await executeCsharp(job.filepath);
        }
        else if (job.language == "r") {
            output = await executeR(job.filepath);
        }
        else if (job.language == "rb") {
            output = await executeRuby(job.filepath);
        }
        else if (job.language == "kt") {
            output = await executeKotlin(job.filepath);
        }
        else if (job.language == "php") {
            output = await executePhp(job.filepath);
        }
        else if (job.language == "swift") {
            output = await executeSwift(job.filepath);
        }
        else {


        }

        job["completedAt"] = new Date();
        job["status"] = "success";
        job["output"] = output;

        await job.save();

        console.log(job)

    } catch (error) {
        console.log("error in code", error)

        job["completedAt"] = new Date();
        job["status"] = "error";
        job["output"] = JSON.stringify(error)
        await job.save();

        console.log(job);


    }


    return true;
})


jobQueue.on('failed', (error) => {
    console.log(error.data.id, "failed", error.failedReason);
})

jobQueue.on('error', ()=>{
    console.log("some error");
})

const addJobToQueue = async (jobId) => {
    await jobQueue.add({ id: jobId });
}


module.exports = {
    addJobToQueue
}