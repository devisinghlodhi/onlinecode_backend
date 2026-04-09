const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const deleteDockerFolder = require('./deleteDockerFolder');
const EXECUTE_ON_DOCKER = require('../config')
const ConId = process.env.CONTAINER_ID;


const outputPath = path.join(__dirname, "outputs");

const executeCsharp = (filepath) => {


    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const codeJobidfolderPath = path.join(__dirname, "codes", jobId);


    return new Promise((resolve, reject) => {

        const command = EXECUTE_ON_DOCKER
            ? `docker exec -i ${ConId} mcs -out:${jobId}/${jobId}.exe ${jobId}/${jobId}.cs && docker exec -i --user normaluser ${ConId} mono ./${jobId}/${jobId}.exe`
            : `mcs -out:${outPath} ${filepath} && cd ${outputPath} && mono ${outPath}`


        exec(command, (error, stdout, stderr) => {
            if (error) {
                deletefiles([filepath, outPath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ error, stderr })
            }
            if (stderr) {
                deletefiles([filepath, outPath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ stderr })
            }
            deletefiles([filepath, outPath]);
            deletefolders([codeJobidfolderPath]);
            deleteDockerFolder(jobId);
            resolve(stdout);
        })
    })
}

module.exports = {
    executeCsharp,
}