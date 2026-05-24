const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use(express.static('/home/thoughtful-dev/Downloads'));

let data = {}


// Get method route
app.get('/', (req, res) => {
  res.send(`
    <body style="background: pink; color: blue;">
    <h1>Images</h1>
    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    <img src="/afrobot.png" style="max-width: 300px; max-height: 300px;" />
    <img src="/instProfile.png" style="max-width: 300px; max-height: 300px;" />
    <a href="/users">go to users page</a>
    </div>
    </body>
  `)
});

app.get('/users', (req, res) => {
  res.send(`
    <body style="background: pink; color: blue;">
    <h1>Users List Page</h1>
    <p>${JSON.stringify(data)}</p>
    <a href="/">back to home</a>
    </body>
    `)
});

// Post method route
app.post('/users', (req, res) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).send({ error: 'Expected a JSON object' })
  }
  for (const [key, value] of Object.entries(req.body)) {
    if (!data[key]) data[key] = []
    data[key].push(value)
  }
  res.status(201).send(data)
});

app.put('/users', (req, res) => {
  data = req.body
  res.status(200).send(data);
});

app.delete('/users', (req, res) => {
  data = {};
  res.sendStatus(204);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
