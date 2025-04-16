require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//config json response

app.use(express.json())

//models
const User = require('./models/User')
const Temperature = require('./models/Temperature')

//open route - public route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API'})
})

app.post('/auth/register', async(req, res) => {
    if (!req.body) {
        return res.status(400).json({ msg: "Corpo da requisição está vazio!" });
    }
    
    const {name, email, password, confirmpassword} = req.body
    //validations sa
    
    if (!name) {
        return res.status(422).json({msg: "O nome é obrigatório!"})
    }

    if (!email) {
        return res.status(422).json({msg: "O email é obrigatório!"})
    }

    if (!password) {
        return res.status(422).json({msg: "A senha é obrigatório!"})
    }

    if (password !== confirmpassword) {
        return res.status(422).json({msg: "As senhas não conferem!"})
    }

    const userExist = await User.findOne({ email: email})

    if (userExist) {
        return res.status(422).json({msg: "Por favor, utilize outro e-mail"})
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user{
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try {
        await user.save()

        res.status(201).json({msg: "Usuário criado com sucesso"})
    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: "Aconeceu um erro no servidor ao salvar, tente novamente mais tarde",
        })
        
    }
})

app.post("/auth/login", async (req, res) => {
    const {email, password} = req.body
    console.log("chamou")
    //validations
    if (!email) {
        return res.status(422).json({msg: "O email é obrigatório!"})
    }

    if (!password) {
        return res.status(422).json({msg: "A senha é obrigatório!"})
    }


})




app.post('/temperatura/registros', async (req, res) => {
    const { idEmpresa, nomeEmpresa, idFreezer, temperatura, dataHora, anotacao } = req.body;
    console.log("chamou pooha")
    // Validação básica s
    if (!idEmpresa || !nomeEmpresa || temperatura == null) {
      return res.status(422).json({ msg: 'Campos obrigatórios ausentes.' });
    }
  
    const temperaturaRegistro = new Temperature({
      idEmpresa,
      nomeEmpresa,
      idFreezer,
      temperatura,
      dataHora,
      anotacao,
    });
  
    try {
      await temperaturaRegistro.save();
      res.status(201).json({ msg: 'Registro de temperatura criado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao salvar o registro de temperatura' });
    }
  });

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS


mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.bludyj1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
        app.listen(3000, '0.0.0.0', () => {
            console.log('Servidor rodando na porta 3000 acessível na rede');
          });
        console.log('Conectou ao MongoDB')
    })
    .catch((err) => console.log(err))
