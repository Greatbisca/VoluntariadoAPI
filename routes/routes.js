const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const {MONGO_URI} = require('../mongodb');
const Voluntario = require('../models/Voluntario');
const Instituicao = require('../models/Instituicao');
const client = new MongoClient(MONGO_URI);


//Schema voluntario
/**
 * @swagger
 * definitions:
 *   Voluntario:
 *     type: object
 *     properties:
 *       nome:
 *         type: string
 *       idade:
 *         type: number
 *       telefone: 
 *         type: number
 *       genero:
 *         type: string
 *     xml:
 *       name: Voluntario
 */

//Schema Instituicao
/**
 * @swagger
 * definitions:
 *   Instituicao:
 *     type: object
 *     properties:
 *       nome:
 *         type: string
 *       telefone:
 *         type: number
 *       morada:
 *         type: string
 *       tarefas:
 *         type: string
 *     xml:
 *       name: Instituicao
 */

//Adicionar um novo voluntario
/**
 * @swagger
 * paths:
 *   /addVoluntario:
 *     post:
 *       tags:
 *       - Voluntarios
 *       summary: Adicionar novo voluntario
 *       operationId: postVoluntario
 *       consumes:
 *       - application/json
 *       - application/xml
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: body
 *         name: body
 *         description: Adicionar um novo voluntario
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Voluntario'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.post('/addVoluntario', async (req, res) => {
    const newVoluntario = new Voluntario(req.body);
    try {
        const collection = await newVoluntario.save();
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Atualizar os dados de um voluntario
/**
 * @swagger
 * paths:
 *   /updateVoluntario:
 *     put:
 *       tags:
 *       - Voluntarios
 *       summary: Atualizar um voluntario
 *       operationId: updateVoluntario
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: query
 *         name: Nome
 *         description: "Nome do voluntario que pretende atualizar"
 *         required: true
 *         type: "string"
 *       - in: body
 *         name: body
 *         description: Atualizar um voluntario
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Voluntario'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.put('/updateVoluntario', async (req, res) => {
    const query = req.query;
    const updtbody = req.body;
    try {
        const collection = await Voluntario.findOneAndUpdate(updtbody);
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});
//Apagar um voluntario
/**
 * @swagger
 * paths:
 *   /deleteVoluntario:
 *     delete:
 *       tags:
 *       - Voluntarios
 *       summary: Apagar um voluntario
 *       operationId: deleteVoluntario
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - name: nome
 *         in: "path"
 *         description: "Nome do voluntario que pretende apagar"
 *         required: true
 *         type: "string"
 *         schema:
 *           $ref: '#/definitions/Voluntario'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.delete('/deleteVoluntario', async (req, res) => {
    const nome = req.nome;
    try {
        const collection = await Voluntario.findOneAndDelete(nome);
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar voluntarios
/**
 * @swagger
 * paths:
 *   /searchVoluntarios:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Pesquisar voluntarios
 *       description: Lista de voluntarios
 *       operationId: getVoluntarios
 *       produces:
 *       - application/json
 *       - application/xml
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Lista vazia
 */
router.get('/searchVoluntarios', async (req, res) => {
    try {
        const collection = await Voluntario.find();
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar voluntario pelo nome
/**
 * @swagger
 * paths:
 *   /SearchVoluntarioByName:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Pesquisar voluntario pelo nome
 *       description: Pesquisa de um voluntario pelo nome
 *       operationId: getVoluntarioPorNome
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: query
 *         name: Nome
 *         description: Nome do voluntario
 *         type: string
 *         required: true
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Nome nao encontrado
 */
router.get('/SearchVoluntarioByName', async (req, res) => {
    const query = req.query;
    try {
        const collection = await Voluntario.find(query);
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Contagem do numero de voluntarios
/**
 * @swagger
 * paths:
 *   /countVoluntarios:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Numero de voluntarios 
 *       description: Numero de voluntarios registados na base de dados
 *       operationId: getCountVoluntarios
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Nao existem voluntarios
 */
router.get('/countVoluntarios', async (req, res) => {  
    try{
        await client.connect();
        const database = client.db("Voluntariado");
        const nvoluntarios = database.collection("voluntarios");
        const estimate = await nvoluntarios.estimatedDocumentCount();
        res.status(200).json(estimate);
    }finally {
        await client.close();
      }
});

//Pesquisar voluntarios por genero
/**
 * @swagger
 * paths:
 *   /voluntariosByGenero:
 *     get:
 *       tags:
 *       - Voluntarios
 *       summary: Pesquisar voluntarios por genero
 *       description: Pesquisar voluntarios por genero
 *       operationId: getVoluntariosByGender
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: query
 *         name: genero
 *         description: Masculino/Feminino
 *         type: string
 *         required: true
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Voluntario'
 *         '500':
 *           description: Nao existem voluntarios
 */
router.get('/voluntariosByGenero', async (req, res) => {
    const query = req.query;
    try {
        const collection = await Voluntario.find(query);
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Adicionar nova instituicao
/**
 * @swagger
 * paths:
 *   /addInstituicao:
 *     post:
 *       tags:
 *       - Instituicao
 *       summary: Adicionar nova instituicao
 *       operationId: postInstituicao
 *       consumes:
 *       - application/json
 *       - application/xml
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: body
 *         name: body
 *         description: Introduzir os dados da instituicao 
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
router.post('/addInstituicao', async (req, res) => {
    const newInstituicao = new Instituicao(req.body);
    try {
        const collection = await newInstituicao.save();
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Atualizar os dados de uma instituicao
/**
 * @swagger
 * paths:
 *   /updateInstituicao:
 *     put:
 *       tags:
 *       - Instituicao
 *       summary: Atualizar uma instituicao
 *       operationId: updateInstituicao
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: query
 *         name: Nome
 *         description: "Nome da instituicao que pretende atualizar"
 *         required: true
 *         type: "string"
 *       - in: body
 *         name: body
 *         description: Atualizar uma instituicao
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.put('/updateInstituicao', async (req, res) => {
    const query = req.query;
    const updtbody = req.body;
    try {
        const collection = await Instituicao.findOneAndUpdate(updtbody);
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Apagar uma instituicao
/**
 * @swagger
 * paths:
 *   /deleteInstituicao:
 *     delete:
 *       tags:
 *       - Instituicao
 *       summary: Apagar uma instituicao
 *       operationId: deleteInstituicao
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - name: nome
 *         in: "path"
 *         description: "Nome da instituicao que pretende apagar"
 *         required: true
 *         type: "string"
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.delete('/deleteInstituicao', async (req, res) => {
    const nome = req.nome;
    try {
        const collection = await Instituicao.findOneAndDelete(nome);
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Adicionar uma tarefa para uma instituicao
/**
 * @swagger
 * paths:
 *   /addTarefa:
 *     put:
 *       tags:
 *       - Instituicao
 *       summary: Adicionar uma tarefa para uma instituicao
 *       operationId: addTarefa
 *       consumes:
 *       - application/json
 *       - application/xml
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: query
 *         name: Nome
 *         description: "Instituicao onde pretende adicionar a tarefa"
 *         required: true
 *         type: "string"
 *       - in: tarefas
 *         name: Tarefa
 *         description: Adicionar tarefa
 *         required: true
 *         type: "string"
 *         schema:
 *           $ref: '#/definitions/Instituicao'
 *       responses:
 *         405:
 *           description: Invalid input
 */
 router.put('/addTarefa', async (req, res) => {
    const query = req.query;
    const newtarefa = req.tarefa;
    try {
        const collection = await Instituicao.updateOne(newtarefa);
        if(!collection) throw Error('Something went wrong while saving the post');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar Instituicoes
/**
 * @swagger
 * paths:
 *   /searchInstituicao:
 *     get:
 *       tags:
 *       - Instituicao
 *       summary: Pesquisar instituicoes
 *       description: Lista de todos as instituicoes 
 *       operationId: getLocalVoluntariado
 *       produces:
 *       - application/json
 *       - application/xml
 *       responses:
 *         '200':
 *           description: sucess
 *           schema:
 *             $ref: '#/definitions/Instituicao'
 *         '500':
 *           description: error
 */
router.get('/searchInstituicao', async (req, res) => {
    try {
        const collection = await Instituicao.find();
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Pesquisar instituicao por nome
/**
 * @swagger
 * paths:
 *   /getInstituicaoByName:
 *     get:
 *       tags:
 *       - Instituicao
 *       summary: Pesquisar instituicao por nome
 *       description: Pesquisar instituicao por nome
 *       operationId: getInstituicaoByNome
 *       produces:
 *       - application/json
 *       - application/xml
 *       parameters:
 *       - in: query
 *         name: nome
 *         type: string
 *         required: true
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Instituicao'
 *         '500':
 *           description: Nao existe nenhum instituicao com esse nome
 */
router.get('/getInstituicaoByName', async (req, res) => {
    const query = req.query;
    try {
        const collection = await Instituicao.find(query);
        if(!collection) throw Error('No Items');
        res.status(200).json(collection);
    } catch (err){
        res.status(400).json({msg: err});   
    }
});

//Numero de instituicoes
/**
 * @swagger
 * paths:
 *   /countInstituicoes:
 *     get:
 *       tags:
 *       - Instituicao
 *       summary: Numero de instituicoes
 *       description: Numero de instituicoes 
 *       operationId: getCountInstituicoes
 *       responses:
 *         '200':
 *           description: success
 *           schema:
 *             $ref: '#/definitions/Instituicao'
 *         '500':
 *           description: Nao existem instituicoes
 */
router.get('/countInstituicoes', async (req, res) => { 
    try{
        await client.connect();
        const database = client.db("Voluntariado");
        const ninstituicaos = database.collection("instituicaos");
        const estimate = await ninstituicaos.estimatedDocumentCount();
        res.status(200).json(estimate);
    }finally {
        await client.close();
      }
});



module.exports = router;
