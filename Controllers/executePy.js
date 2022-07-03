const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const ConId = process.env.CONTAINER_ID;

const executePy = (filepath)=>{

    const jobId = path.basename(filepath).split(".")[0];
    const codeJobidfolderPath = path.join(__dirname, "codes" , jobId);  
    
    return new Promise((resolve, reject)=>{
        
        // exec(`docker exec -i ${ConId} mkdir ${jobId} && docker cp ${filepath} ${ConId}:/data/${jobId}/${jobId}.py && docker exec -i --user normaluser ${ConId} python3 ${jobId}/${jobId}.py && docker exec -i ${ConId} rm -r ${jobId}`, (error, stdout, stderr)=>{
        // exec(`docker exec -it ${ConId} mkdir ${jobId} && docker cp ${filepath} ${ConId}:/data/${jobId}/${jobId}.py && docker exec -it --user normaluser ${ConId} python3 ${jobId}.py`, (error, stdout, stderr)=>{
        exec(`python3 ${filepath}`, (error, stdout, stderr)=>{
            if(error){
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                reject({error, stderr})
            }
            if(stderr){
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                reject({stderr})
            }
            deletefiles([filepath]);
            deletefolders([codeJobidfolderPath]);
            resolve(stdout);
        })
    })
}

module.exports = {
    executePy
}