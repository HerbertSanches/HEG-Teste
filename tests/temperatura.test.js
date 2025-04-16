const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app'); // importe seu Express app
const Temperatura = require('../models/Temperature');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Temperatura.deleteMany();
});

describe('POST /temperatura/registros', () => {
  it('deve inserir um novo registro de temperatura no banco', async () => {
    const res = await request(app)
      .post('/temperatura/registros')
      .send({
        idEmpresa: '123',
        nomeEmpresa: 'Empresa Teste',
        temperatura: 7.5,
        anotacao: 'Teste de inserção',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('msg');

    const registros = await Temperatura.find();
    expect(registros.length).toBe(1);
    expect(registros[0].nomeEmpresa).toBe('Empresa Teste');
  });
});
