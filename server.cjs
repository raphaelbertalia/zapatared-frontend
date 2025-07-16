const express = require('express');
const path = require('path');
const app = express();

// Serve os arquivos da pasta "dist"
app.use(express.static(path.join(__dirname, 'dist')));

// Para qualquer rota, envia o index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor frontend rodando na porta ${PORT}`);
});