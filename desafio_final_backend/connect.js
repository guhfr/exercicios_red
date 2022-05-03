const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

var connection=null

const retry = 5

const sleep = (timing) => new Promise((resolve) =>
    setTimeout(()=>{resolve()}, timing)
)

const retryConnect = async (database,collection, tryN = 1) =>{
    try {
        if (connection===null){
            await client.connect();
            await client.db("admin").command({ping:1})
            connection = client.db(database)
        } 
        if (connection != null){
            await connection.command({ping: 1})
        }
        return{
            collection: connection.collection(collection),
        }
    } catch (error) {
        connection=null
        if (tryN > retry) throw new Error(error.message)
        await sleep(1000)
        return retryConnect(database,collection, tryN +1 )
    }
}

exports.connectMongo = async (database,collection) =>{
    return retryConnect(database,collection) 
}
