

const gc = require('./storage/index.js')
const bucket = gc.bucket('album-image')

const db = require('./firestorage.js')

// upload image on bucket
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
    let img = await file.makePublic();
    let create = await db.create(img);
    resolve(`https://storage.googleapis.com/${bucket.name}/${originalname}`);
}).on('error',() => {
    reject(`Unable to upload image.`)
}).end(buffer);

})

// Get All image
const getImage = async () => new Promise((resolve, reject) => { 
    resolve(db.list());
})


// download image on local
const downloadImage = () => new Promise((resolve, reject) => { 
    const options = {
      destination: 'Overall.PNG',
    };

    // Downloads the file
    resolve(bucket.file('Overall.PNG').download(options));
})

// delete image
const deleteImage = (id) => new Promise((resolve, reject) => { 
    resolve(db.delete(id));
})

module.exports = {uploadImage, getImage, downloadImage, deleteImage};
