const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var fetch = require('node-fetch')
var fs = require('fs')
const app = express()

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 8000
const secretKey = 'Nordic123456'
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    // find database who is this with email & hashed password 
    // Ok use exist --> generate token
    const user = users.find(item => item.email === email && item.password === password);
    if (user) {
        var token = jwt.sign(user, secretKey);
        res.json({
            status: 'SUCCESS',
            message: 'Login success',
            token
        })
    }
    else res.json({
        status: 'FAIL',
        message: "Email or password incorrect"
    })

})

app.get('/profile', (req, res) => {
    // check if token exist
    const token = req.headers['authorization']
    const decoded = jwt.verify(token, secretKey);
    console.log('token', token)
    console.log(decoded)
    res.json(decoded)
})


app.get('/filters', async (req, res) => {
    const result = await fetch('https://mapi.sendo.vn/wap_v2/category/filter?category_id=2897&platform=web&sortType=listing_v2_desc')
    res.json(await result.json())
})

app.get('/categories', async (req, res) => {
    fs.readFile('./data/category-list.json', 'utf8', (err, data) => {
        res.json(err ? [] : JSON.parse(data))
    })
})

app.get('/products', async (req, res) => {
    const {cateId, page} = req.query
    fs.readFile(`./data/categories/${cateId}/${page}.json`, 'utf8', (err, data) => {
        res.json(err ? [] : JSON.parse(data))
    })
})

app.get('/product/:categoryPath', async (req, res) => {
    const {categoryPath} = req.params
    console.log('categoryPath',categoryPath)
    const url = 'https://mapi.sendo.vn/wap_v2/full/san-pham/'+categoryPath.replace('.html','')
    console.log('url',url)
    const result = await fetch(url)
    res.json(await result.json())
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})



var user = {
    id: 1,
    email: "test@gmail.com",
    firstName: "Test",
    lastName: "Nordic",
    password: "cjhskjfakljhakjcqkljhdklajvcslkjfalkjfakl"
}
// Authorization
// token

const users = [
    {
        id: 1,
        email: "dangtuananh1601@gmail.com",
        fistName: "Anh",
        lastName: "Dang",
        password: "123456"
    },
    {
        id: 2,
        email: "duylcong97@gmail.com",
        fistName: "Duy",
        lastName: "Lương Công",
        password: "123456",
        phone: '0901234567',
    }
]