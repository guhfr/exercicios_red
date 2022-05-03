const {GetAllNEWS, CreateMany, DeleteAll, GetAll, GetOne, CreateOne, PutOne, DeleteOne} =require('./models.js')


exports.createAllNews = async(req,res) => {
    try {
        const DataNEWS = await GetAllNEWS(req.query.qty)
        const {status} = await CreateMany(DataNEWS, 'news')
        console.log('2')
        res.status(status).json({Message:"Dados armazenados!"})
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(1)!"})
    }
}

exports.removeAllNews = async (req,res) =>{
    try {
        const {status} = await DeleteAll('news')
        res.status(status).json({Message:"Banco zerado!"})
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(2)!"})
    }
}

exports.getAllNews = async (req, res) =>{
    try {
        let {limit=20, page=0}=req.query
        const {data:retorno, status} = await GetAll(Number(page),Number(limit),'news')
        return res.status(status).json( retorno )
    } catch (error) {
        console.log('error',error)
        return res.status(500).json({MessageError:"Erro não esperado(3)!"})
    }
}

exports.getOneNews = async (req, res) =>{
    const {data, status} = await GetOne(req.params.id,'news')
    res.status(status).json(data)
}

exports.createNews = async (req, res) => {
    try {
        const {data:retorno, status} = await CreateOne(req.body,'news')
        res.status(status).json(retorno)
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(4)!"})
    }
    
}

exports.putNews = async(req, res) => {
    try {
        const  {data:retorno, status} = await PutOne(req.params.id,req.body,'news')
        res.status(status).json(req.body)
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(5)!"})
    }
    
}

exports.removeNews = async(req, res) => {
    try {
        const  {data:retorno, status} = await DeleteOne(req.params.id, 'news')
        res.status(status).json(retorno)
    } catch (error) {
        return res.status(500).json({MessageError:"Erro não esperado(6)!"})
    }
    
}