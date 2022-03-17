import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter as Router } from 'react-router-dom';
import Helmet from 'react-helmet';


import App from '../src/App';

const PORT = process.env.PORT || 3006;
const app = express();

app.get('/', (req, res) => {
  const app = ReactDOMServer.renderToString(
    <Router location={req.url} context={context}>
      <App />
    </Router>,
  );
  const helmet = Helmet.renderStatic();

  const indexFile = path.resolve('./build/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }
    data.replace('<div id="root"></div>', `<div id="root">${app}</div>`);
    data = data.replace('<meta name="helmet"/>',
      `${helmet.title.toString()}${helmet.meta.toString()}`);

    return res.send(data);
  });
});

app.use(express.static('./build'));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});