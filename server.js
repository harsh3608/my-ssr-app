require('@babel/register')({
  presets: ['@babel/preset-react', '@babel/preset-env'],
});
const express = require('express');
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('./src/App'); // Your React app component
const { StaticRouter } = require('react-router-dom');
const { Helmet } = require('react-helmet');

const app = express();

app.use(express.static('build'));

app.get('*', (req, res) => {
  const context = {};

  const appHTML = renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  const helmet = Helmet.renderStatic();

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
      </head>
      <body>
        <div id="root">${appHTML}</div>
        <script src="/static/js/bundle.js"></script> <!-- Your React app bundle -->
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});