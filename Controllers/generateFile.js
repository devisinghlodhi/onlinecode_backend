
const fs = require('fs');
// const {exec} = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { v4: uuid } = require("uuid");
const fsfile = require('fs').promises;

const path = require('path');
const ConId = process.env.CONTAINER_ID;

const generateFile = async (format, content) => {
    const jobId = uuid();

    const dirCodes = path.join(__dirname, "codes", jobId);
    if (!fs.existsSync(dirCodes)) {
        fs.mkdirSync(dirCodes, { recursive: true });
    }
    try {
        const filename = `${jobId}.${format}`;
        const filepath = path.join(dirCodes, filename);        
        await fsfile.writeFile(filepath, content);
        
        const { stdout, stderr } = await exec(`docker exec -i ${ConId} mkdir ${jobId} && docker cp ${filepath} ${ConId}:/data/${jobId}/${jobId}.${format}`);
        console.log("file copied:", stdout, stderr);

        return filepath;
    } catch (error) {
        console.log(error)
        return "error in generating file";
    }

};


module.exports = {
    generateFile,
};


