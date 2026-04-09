const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const deleteDockerFolder = require('./deleteDockerFolder');
const EXECUTE_ON_DOCKER = require('../config')
const ConId = process.env.CONTAINER_ID;

const outputPath = path.join(__dirname, "outputs");

const executeCpp = (filepath) => {


    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const codeJobidfolderPath = path.join(__dirname, "codes", jobId);

    // console.log(__dirname, "\n", filepath,"\n", outputPath, "\n", outPath);

    return new Promise((resolve, reject) => {

        const command = EXECUTE_ON_DOCKER
            ? `docker exec -i ${ConId} g++ ${jobId}/${jobId}.cpp -o ${jobId}/${jobId}.exe && docker exec -i --user normaluser ${ConId} ./${jobId}/${jobId}.exe`
            : `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${outPath}`

        exec(command, (error, stdout, stderr) => {
            if (stderr) {
                deletefiles([filepath, outPath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ stderr })
            }

            if (error) {
                deletefiles([filepath, outPath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ error, stderr })
            }

            deletefiles([filepath, outPath]);
            deletefolders([codeJobidfolderPath]);
            deleteDockerFolder(jobId);
            resolve(stdout);
        })
    })
}

module.exports = {
    executeCpp,
}