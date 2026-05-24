const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

let data = {
  "name": "Kyle"
};

app.get('/', (req, res) => {
  res.send(`
  <body style="background: pink; color: blue;">
  <h1>Data</h1>
      <p>${JSON.stringify(data)}</p>
  </body>
  `)
})

app.get('/api/data', (req, res) => {
  res.send(data)
})

app.post('/api/data', (req, res) => {
  data = req.body
  res.status(201).send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
