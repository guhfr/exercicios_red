const {createClient} = require('redis')

const client = createClient()
client.on('error', ()=> undefined)


const connectRedis = async() =>{
    await client.connect()
    await client.ping()
    return client
}

exports.getRedis = async (keyPrimary, key) =>{
    try {
        const client = await connectRedis()
        const result = await client.hGetAll(keyPrimary)
        await client.disconnect()
        if (result && result[key]) return JSON.parse(result[key])
        return null
    } catch (err) {
        return null
    } 
}

exports.setRedis = async (keyPrimary, key, data) =>{
    try {
        const client = await connectRedis()
        await client.hSet(keyPrimary,key,JSON.stringfy(data))
        await client.disconnect()
        return true
    } catch (err) {
        return false
    }
}