const app = require('./index.js')
const request = require ('supertest')
const agent = request.agent(app)
const {ObjectId} = require('mongodb')
const { faker } = require('@faker-js/faker');
const {connectMongo} = require('./connect.js')

const RandomTitle = faker.lorem.paragraph(nb_sentences=1)
const RandomBody = faker.lorem.paragraph(nb_sentences=1)

const RandomTitleC = faker.lorem.paragraph(nb_sentences=1)
const RandomBodyC = faker.lorem.paragraph(nb_sentences=1)

const id = new ObjectId()

const _id = String(id)

let newId = null

beforeEach(async () =>{
    const {collection} = await connectMongo('banco_de_dados','jsons');
    const {insertedId} = await collection.insertOne({title: RandomTitle, body: RandomBody});
    newId = insertedId
});

afterEach(async ()=>{
    const {collection} = await connectMongo('banco_de_dados','jsons');
    await collection.deleteMany({})
})

test('IMPORT ALL - expect status 201', async()=>{
    const result = await agent.post('/posts/all')
    expect(result.statusCode).toBe(201)
    expect(result.body.Message).toEqual("Dados armazenados!")
})

test('GET ALL - expect status 200', async()=>{
    const result = await agent.get('/posts')
    expect(result.statusCode).toBe(200)
    expect('object').toBe(typeof result.body)
    expect([result.body].length).toBe(1)
})


test('GET ONE - Correto - expect status 200', async()=>{
    const result = await agent.get(`/posts/${newId}`)
    expect(result.statusCode).toBe(200)
    expect('object').toBe(typeof result.body)
    expect([result.body].length).toBe(1)
    expect(result.body).toEqual({_id: String(newId), title: RandomTitle, body: RandomBody})
})

test('GET ONE - ID inválido - expect status 400', async()=>{
    const result = await agent.get('/posts/a')
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: 'a',
            msg: 'Invalid value',
            param: 'id',
            location: 'params'
        }
    ])
})

test('GET ONE - Usuário não cadastrado- expect status 404', async()=>{
    const result = await agent.get('/posts/62606f034cb53af8dcdace96')
    expect(result.statusCode).toBe(404)
    expect('object').toBe(typeof(result.body))
    expect([result.body.MessageError].length).toBe(1)
    expect(result.body.MessageError).toEqual("Usuário não encontrado")
})




test('CREATE - Correto - expect status 201', async()=>{
    const result = await agent.post('/posts').send({title:RandomTitleC, body:RandomBodyC})
    expect(result.statusCode).toBe(201)
    expect('object').toBe(typeof result.body)
    expect([result.body].length).toBe(1)
    expect(result.body).toEqual({
        _id: result.body._id,
        title:RandomTitleC, 
        body:RandomBodyC
    })
})

test('CREATE - Title vazio - expect status 400', async()=>{
    const result = await agent.post('/posts').send({title:" ",body:RandomBodyC})
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: '',
            msg: 'Invalid value',
            param: 'title',
            location: 'body'
        }
    ])
})

test('CREATE - Body vazio - expect status 400', async()=>{
    const result = await agent.post('/posts').send({title:RandomTitleC,body:""})
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: '',
            msg: 'Invalid value',
            param: 'body',
            location: 'body'
        }
    ])
})




test('UPDATE - Correto - expect status 200', async()=>{
    const result = await agent.put(`/posts/${newId}`).send({title:RandomTitleC, body:RandomBodyC})
    expect(result.statusCode).toBe(200)
    expect('object').toBe(typeof result.body)
    expect([result.body].length).toBe(1)
    expect(result.body).toEqual({
        _id: result.body._id,
        title:RandomTitleC,
        body:RandomBodyC
    })
})

test('UPDATE - Nome vazio - expect status 400', async()=>{
    const result = await agent.put(`/posts/${newId}`).send({title:"", body:RandomBodyC})
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: '',
            msg: 'Invalid value',
            param: 'title',
            location: 'body'
        }
    ])
})

test('UPDATE - Body vazio - expect status 400', async()=>{
    const result = await agent.put(`/posts/${newId}`).send({title:RandomTitleC, body:" "})
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: '',
            msg: 'Invalid value',
            param: 'body',
            location: 'body'
        },
    ])
})

test('UPDATE - ID inválido - expect status 400', async()=>{
    const result = await agent.put('/posts/a').send({title:RandomTitleC, body:RandomBodyC})
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: 'a',
            msg: 'Invalid value',
            param: 'id',
            location: 'params'
        }
    ])
})

test('UPDATE - Usuário não cadastrado - expect status 404', async()=>{
    const result = await agent.put('/posts/62606f034cb53af8dcdace96').send({title:RandomTitleC, body:RandomBodyC})
    expect(result.statusCode).toBe(404)
    expect('object').toBe(typeof(result.body))
    expect([result.body.MessageError].length).toBe(1)
    expect(result.body.MessageError).toEqual("Usuário não encontrado")
})




test('DELETE - CORRETO - expect status 200', async()=>{
    const result = await agent.delete(`/posts/${newId}`)
    expect(result.statusCode).toBe(200)
    expect('object').toBe(typeof result.body)
    expect([result.body].length).toBe(1)
    expect(result.body).toEqual({
        _id: result.body._id,
        title:RandomTitle,
        body:RandomBody
    })
})

test('DELETE - ID inválido - expect status 400', async()=>{
    const result = await agent.delete('/posts/a')
    expect(result.statusCode).toBe(400)
    expect(true).toBe(Array.isArray(result.body.errors))
    expect(result.body.errors.length).toBe(1)
    expect(result.body.errors).toEqual([
        {
            value: 'a',
            msg: 'Invalid value',
            param: 'id',
            location: 'params'
        }
    ])
})

test('DELETE - Usuário não cadastrado - expect status 404', async()=>{
    const result = await agent.delete('/posts/62606f034cb53af8dcdace96')
    expect(result.statusCode).toBe(404)
    expect('object').toBe(typeof(result.body))
    expect([result.body.MessageError].length).toBe(1)
    expect(result.body.MessageError).toEqual("Usuário não encontrado")
})
