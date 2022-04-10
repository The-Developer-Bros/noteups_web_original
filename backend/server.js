const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

// const multer = require('multer');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cors = require('cors');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(cors());

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

// Function to add poster url to each subdomain from cloudinary
const addSubdomainPosterUrl = (domain, subdomains) => {

  // Create a clone of subdomains
  const subdomainsClone = JSON.parse(JSON.stringify(subdomains));

  // Correct way to add JSON fields to an object 
  subdomainsClone.folders.map((subdomain) => {
    subdomain.poster = cloudinary.url(`noteups/${domain}/${subdomain.name}/poster.jpg`,
      // {
      //   width: 250,
      //   height: 350,
      //   crop: 'fill',
      // }
    );
  }); 

  return subdomainsClone;
};

const addSubjectPosterUrl = (domain, subdomain, subjects) => {

  // Create a clone of subjects
  const subjectsClone = JSON.parse(JSON.stringify(subjects));

  // Correct way to add JSON fields to an object
  subjectsClone.folders.map((subject) => {
    subject.poster = cloudinary.url(`noteups/${domain}/${subdomain}/${subject.name}/poster.jpg`,
      // {
      //   width: 250,
      //   height: 350,
      //   crop: 'fill',
      // }
    );
  });

  return subjectsClone;
};


// Function to get all domain folders from cloudinary
app.get("/api/domains", async (req, res) => {
  try {
    const result = await cloudinary.api.sub_folders("noteups");
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// Function to get all subdomain within a domain folder from cloudinary
app.get("/api/:domain/subdomains", async (req, res) => {
  try {
    const subdomains = await cloudinary.api.sub_folders(`noteups/${req.params.domain}`);
    // console.log(subdomains);
    // res.send(subdomains);    

    const subdomainsWithPosters = addSubdomainPosterUrl(req.params.domain, subdomains);
    console.log(subdomainsWithPosters);
    res.send(subdomainsWithPosters);

  } catch (error) {
    next(error);
  }
});

// Function to get all subjects within a subdomain folder from cloudinary
app.get("/api/:domain/:subdomain/subjects", async (req, res) => {
  try {
    const subjects = await cloudinary.api.sub_folders(`noteups/${req.params.domain}/${req.params.subdomain}`);
    // res.send(subjects);

    const subjectsWithPosters = addSubjectPosterUrl(req.params.domain, req.params.subdomain, subjects);
    res.send(subjectsWithPosters);

  } catch (error) {
    next(error);
  }
});


// Function to get all pdfs within a subject within a domain folder from cloudinary
app.get("/api/:domain/:subdomain/:subject", async (req, res) => {
  try {
    const result = await cloudinary.api.resources(`noteups/${req.params.domain}/${req.params.subdomain}/${req.params.subject}`);
    res.send(result);
  } catch (error) {
    next(error);
  }
});


app.get('/api/download/:domain/:subdomain/:subject', async (req, res, next) => {
  const { resources } = await cloudinary.search
    .expression(`folder:noteups/${req.params.domain}/${req.params.subdomain}/${req.params.subject}`)
    .sort_by('created_at', 'desc')
    .max_results(10)
    .execute();

  console.log(req.params.domain, req.params.subject);
  const publicIds = resources.map(file => file.public_id);
  console.log(publicIds);
  res.send(publicIds);
});

app.post('/api/upload/:domain/:subdomain/:subject', async (req, res, next) => {
  try {
    const fileStr = req.body.PDFs;
    console.log(`fileStr ${fileStr}`);

    let promises = [];

    fileStr.forEach(file => {
      promises.push(cloudinary.uploader.upload(file, {
        folder: `noteups/${req.params.domain}/${req.params.subdomain}/${req.params.subject}`,
        use_filename: true,
        unique_filename: false,
        // transformation: [
        //   { width: 500, height: 500, crop: 'limit' },
        //   { quality: 'auto' }
        // ]
      }
      ));
    });

    Promise.all(promises).then(results => {
      res.send(results);
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'error', data: error });
  }
});


app.use('/api', require('./routes/api.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));