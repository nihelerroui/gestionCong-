const fs = require("fs");
const debug = require("debug")("app:routes");

const moveFile = (from, to) =>{
    fs.rename(from, to, (err)=>{
        if(err) debug('image was not moved to its directory');
    });
};

const deleteFile = (filePath) =>{
    fs.unlink(filePath, function (error){
        debug(error);
    });
};

const fileType = (file) =>{
    if(file.mimetype.startsWith("image")) return 'image';
}

module.exports = {moveFile, deleteFile, fileType}