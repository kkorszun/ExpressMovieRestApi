const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/movies', (req, res) => res.send('All movies are here'))
app.get('/comments/:id(\\d+)', (req, res) => res.send(`All comments for ${req.params.id} movie are here`))
app.get('/comments', (req, res) => res.send('All comments are here'))

app.post('/movies', (req, res) => {
    if(req.body.title) {
        res.send(JSON.stringify(req.body))
    } else{
        res.sendStatus(400)
    }    
})

app.post('/comments', (req, res) => {
    if(req.body.id && req.body.comment) {
        res.send(JSON.stringify(req.body))
    } else{
        res.sendStatus(400)
    }    
})


app.listen(port, () => console.log(`App listening on port ${port}!`))