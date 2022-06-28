const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');

const executeJava = (filepath)=>{

    const jobId = path.basename(filepath).split(".")[0];
    const codefilePath = path.join(__dirname, "codes" , jobId);  
    
    return new Promise((resolve, reject)=>{
        
        exec(`python3 ${filepath}`, (error, stdout, stderr)=>{
            if(error){
                deletefiles([filepath]);
                deletefolders([codefilePath]);
                reject({error, stderr})
            }
            if(stderr){
                deletefiles([filepath]);
                deletefolders([codefilePath]);
                reject({stderr})
            }
            deletefiles([filepath]);
            deletefolders([codefilePath]);
            resolve(stdout);
        })
    })
}

module.exports = {
    executeJava
}