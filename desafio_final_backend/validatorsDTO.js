const {body, param, validationResult} = require('express-validator')
const {GetEmail, GetOne, GetAll} = require('./models.js')
const {ObjectId} = require('mongodb')

exports.validateCreate = [
    body('title').trim().notEmpty().isString(),
    body('body').trim().notEmpty().isString()
]

exports.validateId=[
    param('id').notEmpty().custom((id)=> ObjectId.isValid(id))
]

exports.validateErrorFields = (req, res, next)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        return next()
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado!"})
    }
}

exports.validateGetAllJsons = async (req, res, next)=>{
    try {
        const {data} = await GetAll(page=0, limit=10, collectionName='jsons')
        if (data.data.length==0){
            return res.status(404).json({MessageError:"Banco de dados vazio"})
        }
    return next()
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado!"})
    }
}

exports.validateGetAllNews = async (req, res, next)=>{
    try {
        const {data} = await GetAll(page=0, limit=10, collectionName='news')
        if (data.data.length==0){
            return res.status(404).json({MessageError:"Banco de dados vazio"})
        }
    return next()
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado!"})
    }
}

exports.validateFoundIdJsons = async (req, res, next)=>{
    try {
        const {id} = req.params
        const {data} = await GetOne(id,'jsons')
        if (!data){
            return res.status(404).json({MessageError: "Usuário não encontrado"})
        }
        return next()
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado!"})
    }
}

exports.validateFoundIdNews = async (req, res, next)=>{
    try {
        const {id} = req.params
        const {data} = await GetOne(id,'news')
        if (!data){
            return res.status(404).json({MessageError: "Usuário não encontrado"})
        }
        return next()
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado!"})
    }
}