const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const deleteDockerFolder = require('./deleteDockerFolder');
const ConId = process.env.CONTAINER_ID;

const executePhp = (filepath)=>{

    const jobId = path.basename(filepath).split(".")[0];
    const codeJobidfolderPath = path.join(__dirname, "codes" , jobId);  
    
    return new Promise((resolve, reject)=>{
        
        // exec(`docker exec -i --user normaluser ${ConId} php ${jobId}/${jobId}.php `, (error, stdout, stderr) => {
        exec(`php ${filepath}`, (error, stdout, stderr)=>{
            if(stderr){
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({stderr})
            }

            if(error){
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({error, stderr})
            }
            
            deletefiles([filepath]);
            deletefolders([codeJobidfolderPath]);
            deleteDockerFolder(jobId);
            resolve(stdout);
        })
    })
}

module.exports = {
    executePhp
}