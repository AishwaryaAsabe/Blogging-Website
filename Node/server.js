const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT_NUMBER = 2004;

mongoose.connect('mongodb://127.0.0.1:27017/itemdb', { useNewUrlParser: true, useUnifiedTopology: true });
const itemSchema = new mongoose.Schema({ 
    Fname: String,
    Lname: String,
    email: String,
    mno: Number,
    password: String,
    interest: String,
});

// Use 'stds' as the collection name in the 'itemdb' database
const Item = mongoose.model('stds', itemSchema); 



app.post('/stds/register', async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.post('/stds/register', async (req, res) => {
//     try {
//       // Extract data from the request body
//       const { Fname, Lname, email, mno, password, interest } = req.body;
  
//       // Check if an item with the same email already exists
//       const existingItem = await Item.findOne({ email });
  
//       if (existingItem) {
//         // Respond with a message indicating that the email is already registered
//         return res.status(400).json({ error: 'Email already registered' });
//       }
  
//       // Create a new instance of your Mongoose model
//       const newItem = new Item({
//         Fname,
//         Lname,
//         email,
//         mno,
//         password,
//         interest,
//       });
  
//       // Save the new item to the MongoDB database
//       await newItem.save();
  
//       // Respond with the saved item
//       res.status(201).json(newItem);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  

// Login endpoint
app.post('/stds/login', async (req, res) => {
    const { Fname, Lname, password } = req.body;
    console.log('Login Request at server:', { Fname, Lname, password }); // Debugging statement to check the received data
    try {
        const user = await Item.findOne({ Fname: Fname, Lname: Lname, password: password});
        // const user = await Item.findOne({ Fname, Lname, password });
        console.log(user);
        if (user) {
            console.log('Login Successful');
            res.json({ success: true,user:user });
        } else {
            console.log('Login Failed');
            res.json({ success: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/stds/register', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

// Existing code...


app.put('/stds/:id', async (req, res) => {
    try {
        const updateItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateItem);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/stds/:id', async (req, res) => {
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
