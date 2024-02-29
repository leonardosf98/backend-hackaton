const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes/index');

app.use(bodyParser.json());
app.use(cors());

app.use(routes);

app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
