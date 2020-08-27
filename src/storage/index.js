const { Storage } = require('@google-cloud/storage');
const path = require('path')
const serviceKey = path.join(__dirname, '../../key.json')

const projectId = require('../config/config.json').projectId;


const storage = new Storage({
    keyFilename: serviceKey,
    projectId: projectId
});
 

module.exports = storage