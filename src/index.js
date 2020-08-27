const http = require('http');
const express = require('express');
const morgan = require("morgan");
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');


const config = require('./config/config.json').Config;
const getImage = require('./get-image');
const uploadImage = require('./image');
const downloadImage = require('./download');



const app = express();

app.use(morgan("dev"));
app.use(cors());
 
const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
})

app.disable('x-powered-by')
app.use(multerMid.single('file'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', async (req, res, next) => {
  let fileList = [];
  try {
    const [imageList] = await getImage()
    imageList.forEach(file => {
      console.log()
      fileList.push(file.name);
    });
    res
      .status(200)
      .json({
        message: "Get all file",
        data: fileList
      })
  } catch (error) {
    next(error)
  }
});


app.post('/image', async (req, res, next) => {
  try {
    const myFile = req.file
    const imageUrl = await uploadImage(myFile)
    res
      .status(200)
      .json({
        message: "Upload was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
});

app.get('/download', async (req, res, next) => {
  try {
    const imageUrl = await downloadImage()
    res
      .status(200)
      .json({
        message: "Download was successful",
        data: imageUrl
      })
  } catch (error) {
    next(error)
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err,
    message: 'Internal server error!',
  })
  next()
})


let server = http.createServer(app);

server.listen(config.Port); 

console.log(`Server Started and listening on ${config.Port}`);
