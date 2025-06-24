const express = require('express');
const cors = require('cors');
const app = express();
const barberosRoutes = require('./routes/barberos');

app.use(cors());
app.use(express.json());
app.use('/api/barberos', barberosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
