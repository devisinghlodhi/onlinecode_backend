const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const deleteDockerFolder = require('./deleteDockerFolder');
const ConId = process.env.CONTAINER_ID;

const executeJavascript = (filepath) => {

    const jobId = path.basename(filepath).split(".")[0];
    const codeJobidfolderPath = path.join(__dirname, "codes", jobId);

    return new Promise((resolve, reject) => {
        
        exec(`docker exec -i --user normaluser ${ConId} node ${jobId}/${jobId}.js`, (error, stdout, stderr) => {
            // exec(`node ${filepath}`, (error, stdout, stderr)=>{
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