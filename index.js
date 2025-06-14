const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const db = require('./conexao');
const jwt = require('jsonwebtoken');
const SECRET = 'segredo_super_seguro'; // Em produção, use variável de ambiente!

app.use(express.json());

app.get('/usuarios', async (req, res) => {
  const usuarios = await db('usuarios').select('*');
  res.json(usuarios);
});

app.get('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await db('usuarios').where({ id }).first();
  if (!usuario) return res.status(404).send('Usuário não encontrado');
  res.json(usuario);
});

app.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verifica se o e-mail já está cadastrado
    const existente = await db('usuarios').where({ email }).first();
    if (existente) {
      return res.status(400).send('E-mail já cadastrado');
    }

    // Criptografa a senha antes de salvar
    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const [id] = await db('usuarios').insert({
      nome,
      email,
      senha: senhaCriptografada
    });

    const novoUsuario = await db('usuarios').where({ id }).first();

    // Remove a senha do retorno
    delete novoUsuario.senha;

    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).send('Erro ao cadastrar usuário');
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    console.log('Tentando login com:', email);
    const usuario = await db('usuarios').where({ email }).first();
    if (!usuario) {
      return res.status(401).send('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).send('Senha inválida');
    }

    // Gera token
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).send('Erro ao fazer login');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email } = req.body;
  const atualizado = await db('usuarios').where({ id }).update({ nome, email });
  if (!atualizado) return res.status(404).send('Usuário não encontrado');
  const usuarioAtualizado = await db('usuarios').where({ id }).first();
  res.json(usuarioAtualizado);
});

app.put('/usuarios/:id/senha', async (req, res) => {
  const id = parseInt(req.params.id);
  const { senhaNova } = req.body;

  try {
    const usuario = await db('usuarios').where({ id }).first();
    if (!usuario) return res.status(404).send('Usuário não encontrado');

    const senhaCriptografada = await bcrypt.hash(senhaNova, 10);

    const atualizados = await db('usuarios')
      .where({ id })
      .update({ senha: senhaCriptografada });

    if (atualizados === 0) {
      return res.status(500).send('Erro ao atualizar senha');
    }

    res.send('Senha atualizada com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).send('Erro ao atualizar senha');
  }
});


app.delete('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const deletado = await db('usuarios').where({ id }).del();
  if (!deletado) return res.status(404).send('Usuário não encontrado');
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
