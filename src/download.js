

const gc = require('./storage/index.js')
const bucket = gc.bucket('album-image')

const downloadImage = () => new Promise((resolve, reject) => { 
        const options = {
          destination: '1598527538323Overall.PNG',
        };

        // Downloads the file
        resolve(bucket.file('1598527538323Overall.PNG').download(options));
})

module.exports = downloadImage;
