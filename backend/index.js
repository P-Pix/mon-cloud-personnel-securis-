const app = require('./app');
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

process.on('uncaughtException', err => {
  console.error('Exception non capturée :', err);
});

process.on('unhandledRejection', err => {
  console.error('Rejet de promesse non géré :', err);
});
