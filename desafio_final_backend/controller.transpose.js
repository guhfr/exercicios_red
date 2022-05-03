const {GetAllJSONs, GetAll, CreateMany, DeleteAll, GetOne, CreateOne, PutOne, DeleteOne } = require('./models.js')

exports.createAllJS = async(req,res) => {
    try {
        const DataJSONs = await GetAllJSONs()
        const {status} = await CreateMany(DataJSONs.data, 'jsons')
        res.status(status).json({Message:"Dados armazenados!"})
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(1)!"})
    }
}

exports.removeAllJS = async (req,res) =>{
    try {
        const {status} = await DeleteAll('jsons')
        res.status(status).json({Message:"Banco zerado!"})
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(2)!"})
    }
}

exports.getAllJsons = async (req, res) =>{
    try {
        let {limit=10, page=0}=req.query
        const {data:retorno, status} = await GetAll(Number(page),Number(limit),'jsons')
        return res.status(status).json( retorno )
    } catch (error) {
        console.log('error',error)
        return res.status(500).json({MessageError:"Erro não esperado(3)!"})
    }
}

exports.getOneJsons = async (req, res) =>{
    const {data, status} = await GetOne(req.params.id,'jsons')
    res.status(status).json(data)
}

exports.createJsons = async (req, res) => {
    try {
        const {data:retorno, status} = await CreateOne(req.body,'jsons')
        res.status(status).json(retorno)
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(4)!"})
    }
    
}

exports.putJsons = async(req, res) => {
    try {
        const  {data:retorno, status} = await PutOne(req.params.id,req.body,'jsons')
        res.status(status).json(req.body)
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(5)!"})
    }
    
}

exports.removeJsons = async(req, res) => {
    try {
        const  {data:retorno, status} = await DeleteOne(req.params.id, 'jsons')
        res.status(status).json(retorno)
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(6)!"})
    }
    
}