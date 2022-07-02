const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');

const outputPath = path.join(__dirname, "outputs");

const executeCsharp = (filepath)=>{

    
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive:true});
    }

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const codeJobidfolderPath = path.join(__dirname, "codes" , jobId);  

    
    return new Promise((resolve, reject)=>{        
        exec(`mcs -out:${outPath} ${filepath} && cd ${outputPath} && mono ${outPath}`, (error, stdout, stderr)=>{
            if(error){
                deletefiles([filepath, outPath]);
                deletefolders([codeJobidfolderPath]);
                reject({error, stderr})
            }
            if(stderr){
                deletefiles([filepath, outPath]);
                deletefolders([codeJobidfolderPath]);
                reject({stderr})
            }
            deletefiles([filepath, outPath]);
            deletefolders([codeJobidfolderPath]);
            resolve(stdout);
        })
    })
}

module.exports = {
    executeCsharp,
}