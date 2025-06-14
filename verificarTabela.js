const db = require('./conexao');

async function verificar() {
  const existe = await db.schema.hasTable('usuarios');
  console.log('Tabela existe?', existe);
  process.exit();
}

verificar();
