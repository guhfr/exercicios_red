const {connectMongo} = require('./connect.js')
const {connectRedis, getRedis, setRedis} = require('./redis.js')
const {Methods, CheerioMethods} = require('./services.js')
const { ObjectId } = require('mongodb')


exports.GetAllJSONs = () =>{
    return Methods('GET')
}

exports.GetAllNEWS = (qty) =>{
    return CheerioMethods(qty)
    
}

exports.CreateMany = async (data,collectionName)=>{
    const {collection} = await connectMongo('banco_de_dados', collectionName)
    const result = await Promise.all(data.map(post=>{
        return collection.insertOne({title: post.title, body:post.body})
    }))
    return {status: 201}
}

exports.DeleteAll = async(collectionName) =>{
    const {collection} = await connectMongo('banco_de_dados', collectionName)
    const deleting = await collection.deleteMany()
    return {status: 200}
}

exports.GetAll = async (page=0, limit=10, collectionName) =>{
    const key = `users - page:${page} - limit:${limit}`
    const result = await getRedis(collectionName,key)
    if (result){
        return {data:result, status:200}
    }

    const {collection} = await connectMongo('banco_de_dados', collectionName)
    const skip = page>0? page*limit:0

    const [data] = await collection.aggregate(
        [
            {
                $facet:{
                    metaData: [{$count: 'total'},{$addFields:{page}}],
                    data: [{$skip:skip},{$limit:10}]
                }
            }
        ]
    ).toArray()

    await setRedis(collectionName,key, data)
    return {data, status: 200}
}

exports.GetOne = async(id, collectionName)=>{
    const key = `users - id:${id}`
    const result = await getRedis(collectionName, key)

    if (result){
        return {data:result, status:200}
    }

    const {collection} = await connectMongo('banco_de_dados', collectionName)
    const data = await collection.findOne({_id:ObjectId(id)})

    await setRedis(collectionName,key, data)
    return {data, status: 200}
}

exports.CreateOne = async({title,body},collectionName)=>{
    const {collection} = await connectMongo('banco_de_dados', collectionName)
    const {insertedId} = await collection.insertOne({title,body})
    return {data: {_id:insertedId, title,body}, status: 201}
}

exports.PutOne = async (id,{title,body},collectionName) =>{
    const {collection} = await connectMongo('banco_de_dados', collectionName)
     await collection.updateOne({_id:ObjectId(id)},{$set: {title,body}})
    return {data: {_id:id,title,body}, status: 200}
}

exports.DeleteOne = async (id,collectionName) =>{
    const {collection} = await connectMongo('banco_de_dados', collectionName)
    const dataResponse = await collection.findOne({_id:ObjectId(id)})
    const deleting = await collection.deleteOne({_id:ObjectId(id)})
    return {data:dataResponse, status: 200}
}