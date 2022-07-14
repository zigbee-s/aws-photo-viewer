var express = require('express');
var app = express();

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

// Set EJS as templating engine
app.set('view engine', 'ejs');

const PORT = 3000;

/*
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
*/


const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const keys = [];

app.get('/', (req, res) => {
 
    res.render('home');
     
});

app.get('/organizations', (req,res) => {
    
    res.render('organizations', {keys});
})

app.get('/image/:key', (req, res) => {
    console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)
  
    readStream.pipe(res)
  })
  
  app.post('/image', upload.single('image'), async (req, res) => {
    const file = req.file
    console.log(file)
    
    // apply filter
    // resize 
  
    const result = await uploadFile(file)
    keys.push(file.filename)
    await unlinkFile(file.path)
    console.log(result)
    const description = req.body.description
    res.send({imagePath: `/images/${result.Key}`})
  })

app.listen(PORT, ()=> {console.log(`Server running on Port: ${PORT}`)})