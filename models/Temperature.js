const mongoose = require('mongoose')

const Temperature = mongoose.model('Temperature', {
    idEmpresa: String,
    nomeEmpresa: String,
    idFreezer: String,
    temperatura: String,
    dataHora: String,
    anotacao: String
})

module.exports = Temperature