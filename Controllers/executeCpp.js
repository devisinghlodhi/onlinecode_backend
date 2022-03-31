const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');

const outputPath = path.join(__dirname, "outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath, {recursive:true});
}

const executeCpp = (filepath)=>{

    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);  

    // console.log(__dirname, "\n", filepath,"\n", outputPath, "\n", outPath);

    return new Promise((resolve, reject)=>{
        // exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`, (error, stdout, stderr)=>{
        exec(`g++ ${filepath} -o ${outPath} && cd ${outputPath} && ${outPath}`, (error, stdout, stderr)=>{
            if(error){
                deletefiles([filepath, outPath]);
                reject({error, stderr})
            }
            if(stderr){
                deletefiles([filepath, outPath]);
                reject({stderr})
            }
            deletefiles([filepath, outPath]);
            resolve(stdout);
        })
    })
}

const deletefiles = (files)=>{
    files.forEach((currentfilepath)=>{
        if(fs.existsSync(currentfilepath)){
            fs.unlinkSync(currentfilepath);
        }
    })
}

module.exports = {
    executeCpp,
}