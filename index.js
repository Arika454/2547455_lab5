const express = require('express');

const app = express ();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", port);
  });

const { BookModel} = require('./models');

const books = [];
let nextId = 1;
let nextDetailId=1;

app.get('/whoami', (request, response) => {
    response.json({studentNumber: '2547455'});
});

app.get('/books', (request, response) => {
    response.json(books);
});

app.get('books/:id', (request, response) => {
    const book = books.find(Book => Book.id === parseInt(request.params.id));
    if(!book) {return response.status(404).send('Book not found');}
    response.json(book);
});

app.post('/books', (req, res) => {
    const { title, details } = req.body;
    if (!title || !Array.isArray(details) || details.length === 0) {
      return res.status(400).send('Title and at least one detail are required');
    }
  

    details.forEach(detail => {
      if (!detail.id) {
        detail.id = nextDetailId++;
      }
    });
  
    const newBook = {
      id: nextBookId++,
      title,
      details,
    };
    books.push(newBook);
    res.status(201).json(newBook);
  });

  app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found');
  
    const { title, details } = req.body;
    book.title = title || book.title;
  
    // Update the details if provided
    if (Array.isArray(details) && details.length > 0) {
      details.forEach(detail => {
        // If a detail does not have an id, assign a new one
        if (!detail.id) {
          detail.id = nextDetailId++;
        }
      });
      book.details = details;
    }
  
    res.json(book);
  });

  app.delete('/books/:id', (request, response) => {
    const index = books.findIndex(Book => Book.id === parseInt(request.params.id));
    if (index === -1) return response.status(404).send('Book not found');
  
    books.splice(index, 1);
    response.status(204).send();
  });

  app.post('/books/:id/details', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found');
  
    const { author, genre, publicationYear } = req.body;
    if (!author || !genre || !publicationYear) {
      return res.status(400).send('Bad Request: Author, genre, and publication year are required');
    }
  
    const newDetail = {
      id: nextDetailId++,  // Automatically generate a new detail id
      author,
      genre,
      publicationYear
    };
  
    book.details.push(newDetail);
    res.json(book);
  });
  
  app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).send('Book not found');
  
    const detailIndex = book.details.findIndex(d => d.id === parseInt(req.params.detailId));
    if (detailIndex === -1) return res.status(404).send('Detail not found');
  
    book.details.splice(detailIndex, 1);
    res.json(book);
  });
  