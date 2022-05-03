const axios = require('axios');
const cheerio = require('cheerio')


const url = 'https://jsonplaceholder.typicode.com/posts'
const ifpe = 'https://www.ifpe.edu.br'

exports.Methods = async (method, body = null) => {
    try {
        const { data, status } = await axios({ url, method, data: body })
        return { data }
    } catch (error) {
        const { data, status } = error.response
        return { data, status }
    }
}

exports.CheerioMethods = async (init) => {
    try {
        const { data } = await axios.get(`${ifpe}/noticias?b_start:int=${(init || 0)*20}`)
        const $ = cheerio.load(data, null, false);

        let list = $('.summary.url,.description').toArray().map((value, index, Array) => {
            if (index % 2 == 0) {
                return { title: $(value).text(), body: $(Array[index + 1]).text() }
            }
        });

        const news = list.filter(value => {
            return value != undefined
        })

        return news

    } catch (error) {
        console.log('error', error)
    }
}
