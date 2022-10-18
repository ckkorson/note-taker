const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4:uuidv4} = require('uuid');
let db = require('./db/db.json')

// console.log(uuidv4())
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

app.get('/api/notes', (req, res) => {
  try {
    res.json(db)
    console.log('Notes have been returned to user.')
  } catch {
    throw err
  }
});

app.post('/api/notes', (req, res) => {
  // console.log(req.body)
  req.body.id = uuidv4();
  // console.log(req.body)
  db.push(req.body)
  console.log(db)
  fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
    if (err) {
      throw err
    }
    console.log('The file has been saved.')
  })
})