const path = require('path');
const fs = require('fs');


const deletefiles = (files)=>{
    files.forEach((currentfilepath)=>{
        if(fs.existsSync(currentfilepath)){
            try {
                fs.unlinkSync(currentfilepath);
            } catch (error) {
                console.log(error);
            }
        }
    })
}

module.exports = deletefiles;