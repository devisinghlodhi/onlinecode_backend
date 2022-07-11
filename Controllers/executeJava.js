const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const deletefiles = require('./deleteFiles');
const deletefolders = require('./deleteFolders');
const deleteDockerFolder = require('./deleteDockerFolder');
const ConId = process.env.CONTAINER_ID;
const fsPromises = fs.promises;

const getClassfilepath = async (codeJobidfolderPath) => {
    try {
        let allfiles = await fsPromises.readdir(codeJobidfolderPath);
        return (allfiles.filter(filename => {
            return path.extname(filename).toLowerCase() == '.class';
        }))
    } catch (err) {
        console.error('Error occured while reading directory!', err);
        throw err
    }
}


const executeJava = async (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const codeJobidfolderPath = path.join(__dirname, "codes", jobId);

    return new Promise((resolve, reject) => {

        exec(`javac ${filepath}`, async (error, stdout, stderr) => {
            if (error) {
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ error, stderr })
            }
            else if (stderr) {
                deletefiles([filepath]);
                deletefolders([codeJobidfolderPath]);
                deleteDockerFolder(jobId);
                reject({ stderr })
            }
            else {

                // execute class file After generate the .class file 
             
                let classFile;
                classFile = await getClassfilepath(codeJobidfolderPath);

                if (classFile.length == 0 || classFile == undefined || classFile=='') {
                    reject("error - class file can't created");
                }


                let classfilePath = path.parse(classFile[0]).name;
                let classfilePath_with_ext = path.join(__dirname, "codes", jobId, classFile[0]);



                exec(`docker cp ${classfilePath_with_ext} ${ConId}:/data/${jobId}/${classFile[0]} && docker exec -i --user normaluser ${ConId} bash -c "cd ${jobId} && java ${classfilePath}"`, (error, stdout, stderr) => {

                // exec(`cd ${codeJobidfolderPath} && java ${classfilePath}`, (error, stdout, stderr) => {
                    if (error) {
                        deletefiles([classfilePath_with_ext, filepath]);
                        deletefolders([codeJobidfolderPath]);
                        deleteDockerFolder(jobId);
                        reject({ error, stderr })
                    }
                    if (stderr) {
                        deletefiles([classfilePath_with_ext, filepath]);
                        deletefolders([codeJobidfolderPath]);
                        deleteDockerFolder(jobId);
                        reject({ stderr })
                    }
                    deletefiles([classfilePath_with_ext, filepath]);
                    deletefolders([codeJobidfolderPath]);
                    deleteDockerFolder(jobId);
                    resolve(stdout);
                })

            }
        })
    })
}




module.exports = {
    executeJava
}



