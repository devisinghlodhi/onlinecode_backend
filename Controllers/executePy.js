const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');


const executePy = (filepath)=>{

    const jobId = path.basename(filepath).split(".")[0];
    
    return new Promise((resolve, reject)=>{
        
        exec(`python ${filepath}`, (error, stdout, stderr)=>{
            if(error){
                deletefiles([filepath]);
                reject({error, stderr})
            }
            if(stderr){
                deletefiles([filepath]);
                reject({stderr})
            }
            deletefiles([filepath]);
            resolve(stdout);
        })
    })
}

module.exports = {
    executePy
}