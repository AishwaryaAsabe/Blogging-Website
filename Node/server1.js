const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT_NUMBER = 2006;

mongoose.connect('mongodb://127.0.0.1:27017/itemdb', { useNewUrlParser: true, useUnifiedTopology: true });
const itemSchema = new mongoose.Schema({ 
    title: String,
    date: String,
    author: String,
    type:String,
    content: String,
});

// Use 'stds' as the collection name in the 'itemdb' database
const Item = mongoose.model('blog', itemSchema); 

app.post('/blog', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/blog', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

app.put('/blog/:id', async (req, res) => {
    try {
        const updateItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/blog/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully!!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT_NUMBER, () => {
    console.log(`Server started listening on port number ${PORT_NUMBER}`);
});
