const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4:uuidv4} = require('uuid');
let db = require('./db/db.json')

const PORT = process.env.PORT || 3001;

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

app.get('/api/notes', (req, res) => {
  try {
    res.json(db)
    console.log('Notes have been returned to user.')
  } catch {
    throw err
  }
});

app.post('/api/notes', (req, res) => {
  req.body.id = uuidv4();
  db.push(req.body)
  fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
    if (err) {
      throw err
    }
    console.log('The note has been saved.')
    res.json(db)
  })
})

app.delete('/api/notes/:id', (req, res) =>{
  const { id } = req.params;
  const deletedNote = db.find(note => note.id === id) 
  db = db.filter(note => note.id != id)
  fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
    if (err) {
      throw err
    }
    console.log('The note has been deleted.')
    res.json(db)
  })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);