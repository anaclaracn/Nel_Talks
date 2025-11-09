require('dotenv').config();
const express = require('express');
const cors = require('cors');
const forumRoutes = require('./routes/forumRoutes');
require('./config/db'); 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/forum', forumRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
