const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());

// GET random quote
app.get('/api/quotes/random', (req, res) => {
  const randomQuote = getRandomElement(quotes);
  if (randomQuote) {
    res.send({ quote: randomQuote });
  } else {
    res.status(500).send('No quotes available');
  }
});

// GET all quotes or by person
app.get('/api/quotes', (req, res) => {
  const person = req.query.person;
  const filteredQuotes = person ? quotes.filter(quote => quote.person === person) : quotes;
  res.send({ quotes: filteredQuotes });
});

// POST new quote
app.post('/api/quotes', (req, res) => {
  const { quote, person, year } = req.body; // Include year in the request body
  if (quote && person && year) {
    const newQuote = { id: quotes.length + 1, quote, person, year };
    quotes.push(newQuote);
    res.status(201).send({ quote: newQuote });
  } else {
    res.status(400).send('Quote, person, and year are required.');
  }
});

// PUT update quote by ID
app.put('/api/quotes/:id', (req, res) => {
  const { id } = req.params; // Get the ID from the URL
  const { quote, person, year } = req.body; // Include year in the request body

  // Find the index of the quote with the given ID
  const quoteIndex = quotes.findIndex(q => q.id === parseInt(id));

  if (quoteIndex !== -1 && quote && person && year) {
    // Update the quote if found and data is valid
    quotes[quoteIndex] = { id: parseInt(id), quote, person, year };
    res.send({ quote: quotes[quoteIndex] });
  } else {
    res.status(400).send('Invalid request');
  }
});


// DELETE quote by ID
app.delete('/api/quotes/:id', (req, res) => {
    const { id } = req.params; // Get the ID from the URL
  
    // Find the index of the quote with the given ID
    const quoteIndex = quotes.findIndex(q => q.id === parseInt(id));
  
    if (quoteIndex !== -1) {
      // Remove the quote if found
      const deletedQuote = quotes.splice(quoteIndex, 1);
      res.send({ quote: deletedQuote[0] });
    } else {
      res.status(404).send('Quote not found');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
