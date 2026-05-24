const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.static('/home/thoughtful-dev/Downloads'));

let data = {}

app.get('/', (req, res) => {
  res.send(`
    <body style="background: pink; color: blue;">
    <h1>Images</h1>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    <img src="/afrobot.png" style="max-width: 300px; max-height: 300px;" />
    <img src="/instProfile.png" style="max-width: 300px; max-height: 300px;" />
    </div>
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
