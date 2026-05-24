const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.static('/Home/Downloads'));

let data = {}

app.get('/', (req, res) => {
  res.send(`
    <body style="background: pink; color: blue;">
    <h1>Images</h1>
    <img src="/image.png" alt="Image" />
    <img src="/image.jpg" alt="Image" />
    <img src="/image.jpeg" alt="Image" />
    <img src="/image.gif" alt="Image" />
    <img src="/image.webp" alt="Image" />
    </body>
  `)
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
