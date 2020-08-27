

const gc = require('./storage/index.js')
const bucket = gc.bucket('album-image')


const getImage = async() => new Promise((resolve, reject) => { 
    resolve(bucket.getFiles());
})

module.exports = getImage;
