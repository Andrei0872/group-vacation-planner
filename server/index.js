import express from 'express'
import { pool } from './db/index.js'

const PORT = 8080;

const app = express();

app.get('/test', (req, res) => {
  res.json({ msg: 'hello!' });
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));

console.log('pool');