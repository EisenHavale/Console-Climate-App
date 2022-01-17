const fs = require('fs');
const file = './database/Cities-Information.json' // Setting location and name of the file

const saveData =(data)=>{
    fs.writeFileSync(file, JSON.stringify(data));
}

const readData = ()=>{
    if(fs.existsSync(file)){ //existsSync is a way to verify the existence of the sync file
        const data = fs.readFileSync(file,{encoding: 'utf8'});
        return JSON.parse(data);
    }else{
        console.log('File does not exist');
        return null;
    }
}

module.exports = {
    saveData,
    readData,
}

