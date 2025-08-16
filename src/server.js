require('dotenv').config();
const app = require('./app');
const { PORT } = require('./config');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
});

