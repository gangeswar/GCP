

const gc = require('./storage/index.js')
const bucket = gc.bucket('album-image')

const uploadImage = (myFile) => new Promise((resolve, reject) => { 

const { originalname, buffer } = myFile

const file = bucket.file(originalname);

const stream = file.createWriteStream({
    metadata: {
    contentType: myFile.mimetype,
    },
    resumable: false,
});

stream.on('error', err => {
    reject(err)
});

stream.on('finish', async () => {
    myFile.cloudStorageObject = originalname;
    await file.makePublic();
    resolve(`https://storage.googleapis.com/${bucket.name}/${originalname}`);
}).on('error',() => {
    reject(`Unable to upload image.`)
}).end(buffer);

})

module.exports = uploadImage;
