const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');

const executePhp = (filepath)=>{

    const jobId = path.basename(filepath).split(".")[0];
    const codeJobidfolderPath = path.join(__dirname, "codes" , jobId);  
    
    return new Promise((resolve, reject)=>{
        
        exec(`php ${filepath}`, (error, stdout, stderr)=>{
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
    executePhp
}