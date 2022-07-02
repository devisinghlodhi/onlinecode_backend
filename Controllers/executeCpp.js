const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');

const outputPath = path.join(__dirname, "outputs");

const executeCpp = (filepath)=>{

    
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive:true});
    }

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);
    const codeJobidfolderPath = path.join(__dirname, "codes" , jobId);  

    // console.log(__dirname, "\n", filepath,"\n", outputPath, "\n", outPath);

    return new Promise((resolve, reject)=>{
        // exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`, (error, stdout, stderr)=>{
        exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${outPath}`, (error, stdout, stderr)=>{
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
    executeCpp,
}