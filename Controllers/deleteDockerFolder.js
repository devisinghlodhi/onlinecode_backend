const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const ConId = process.env.CONTAINER_ID;

const deleteDockerFolder = (foldername)=>{
    // exec(`docker exec -i ${ConId} rm -r ${foldername}`, (error, stdout, stderr)=>{
    //     if(error){
    //         console.log(error)
    //     }
    //     if(stderr){
    //         console.log(stderr)            
    //     }
    //     if(stdout){
    //         console.log(stdout);
    //     }
    // })
}
  
module.exports = deleteDockerFolder;