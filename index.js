const express = require('express')
const app = express()
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')
app.use(cors());
app.use(express.json())

require('dotenv').config()
const port = 4000
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do2zp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogCollection = client.db("tech-blog").collection("blogs");
  app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  app.get('/blogs',(req,res)=>{
    blogCollection.find({}).toArray((err,documents)=>{
      res.send(documents)
    })

})
app.get('/singleBlog/:id',(req,res)=>{
  const id = req.params.id;
  blogCollection.find({_id: ObjectID(id)}).toArray((err,documents)=>{
    res.send(documents[0])
  })
})
  app.post('/addBlog', (req, res) => {
    const blogs = req.body;
    blogCollection.insertOne(blogs, (err, result) => {
        res.send({ count: result.insertedCount });
    })
  })
  app.delete('/deleteJob/:id', (req, res) => {
    const id = req.params.id;
    blogCollection.deleteOne({ _id: ObjectID(id) }, (err) => {
        if (!err) {
            res.send({ count: 1 })
        }
    })

})

});



app.listen(process.env.PORT || port)
  