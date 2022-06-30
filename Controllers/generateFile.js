
const fs = require('fs');
const {v4:uuid} = require("uuid");

const path = require('path');
// const dirCodes = path.join(__dirname, "codes");


// if(!fs.existsSync(dirCodes)){
//     fs.mkdirSync(dirCodes, {recursive:true});
// }

const generateFile = async (format, content)=>{
    const jobId = uuid();

    const dirCodes = path.join(__dirname, "codes" , jobId);
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive:true});
}
    try {
        const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCodes, filename);
    await fs.writeFileSync(filepath, content);
    console.log(filepath)
    return filepath;        
    } catch (error) {
        console.log(error)
        return "error in generating file";    
    }
    
};


module.exports = {
    generateFile,
};


