const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

let data = {}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', (req, res) => {
  res.send(data)
});

app.post('/users', (req, res) => {
  data = req.body
  res.status(201).send(data)
});

app.put('/users', (req, res) => {
  data = req.body
  res.status(200).send(data);
});

app.delete('/users', (req, res) => {
  res.sendStatus(204);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
