const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstituicaoSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    telefone: {
        type: Number,
        required: true,
    },
    morada: {
        type: String,
        required: true,
    },
    tarefas: {
        type: String,
        required: true,
    },
    
});

module.exports = mongoose.model('Instituicao', InstituicaoSchema);