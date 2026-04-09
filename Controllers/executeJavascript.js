const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const deleteDockerFolder = require('./deleteDockerFolder');
const EXECUTE_ON_DOCKER = require('../config')
const ConId = process.env.CONTAINER_ID;

const executeJavascript = (filepath) => {

    const jobId = path.basename(filepath).split(".")[0];
    const codeJobidfolderPath = path.join(__dirname, "codes", jobId);

    return new Promise((resolve, reject) => {

        const command = EXECUTE_ON_DOCKER
            ? `docker exec -i --user normaluser ${ConId} node ${jobId}/${jobId}.js`
            : `node ${filepath}`

        exec(command, (error, stdout, stderr) => {
            if (stderr) {
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ stderr })
            }

            if (error) {
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ error, stderr })
            }

            deletefiles([filepath]);
            deletefolders([codeJobidfolderPath]);
            deleteDockerFolder(jobId);
            resolve(stdout);
        })
    })
}

module.exports = {
    executeJavascript
}