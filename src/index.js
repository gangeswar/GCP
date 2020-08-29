
const http = require('http');
const express = require('express');
const morgan = require("morgan");
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');


const config = require('./config/config.json').Config;

const image = require('./image');


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
  try {
    const imageList = await image.getImage()
    res
      .status(200)
      .json({
        message: "Get all file",
        data: imageList
      })
  } catch (error) {
    next(error)
  }
});


app.post('/image', async (req, res, next) => {
  try {
    const myFile = req.file
    const imageUrl = await image.uploadImage(myFile)
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
    const imageUrl = await image.downloadImage()
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

app.delete('/image/:id', async (req, res, next) => {
  console.log()
  try {
    const imageUrl = await image.deleteImage(req.params.id)
    res
      .status(200)
      .json({
        message: "Deleted successful"
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

let port = process.env.PORT || config.Port;
server.listen(port); 

console.log(`Server Started and listening on ${port}`);
