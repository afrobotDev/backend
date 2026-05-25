import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

console.log("Hello Mom");

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
