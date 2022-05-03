const {createAllJS,removeAllJS,getAllJsons, getOneJsons, createJsons, putJsons,removeJsons} = require('./controller.transpose.js');
const {createAllNews, removeAllNews, getAllNews, getOneNews, createNews, putNews, removeNews} = require('./controller.news')

const {validateCreate, validateId, validateGetAllNews, validateGetAllJsons, validateErrorFields,validateFoundIdJsons, validateFoundIdNews}=require('./validatorsDTO.js')



module.exports = (app) =>{
    app.post('/posts/add', createAllJS);
    app.delete('/posts/', removeAllJS);
    app.get('/posts', validateGetAllJsons, getAllJsons);
    app.post('/posts',validateCreate, validateErrorFields, createJsons)
    app.get('/posts/:id', validateId, validateErrorFields, validateFoundIdJsons, getOneJsons)
    app.put('/posts/:id', validateCreate, validateId,validateErrorFields,validateFoundIdJsons, putJsons)
    app.delete('/posts/:id', validateId, validateErrorFields, validateFoundIdJsons, removeJsons)

    app.post('/news/add', createAllNews);
    app.delete('/news/', removeAllNews);
    app.get('/news/', validateGetAllNews, getAllNews);
    app.get('/news/:id',validateId, validateErrorFields, validateFoundIdNews, getOneNews);
    app.post('/news',validateCreate,validateErrorFields, createNews);
    app.put('/news/:id', validateCreate, validateId,validateErrorFields, validateFoundIdNews, putNews);
    app.delete('/news/:id', validateId, validateErrorFields,validateFoundIdNews, removeNews);
};