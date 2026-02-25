// @ts-nocheck
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(500)
    .json({ message: 'Unexpected server error. Please try again later.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});