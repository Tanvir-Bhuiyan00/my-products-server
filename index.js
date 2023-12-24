const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://<username>:<password>@cluster0.hinjtmc.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Set up Express server routes

    // User Registration
    app.post('/register', async (req, res) => {
      const { firstName, lastName, email, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const usersCollection = client.db('your_database').collection('users');

      try {
        const result = await usersCollection.insertOne({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Other routes and functionalities can be added here...

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } finally {
    // Ensure that the client will close when you finish/error
    // Comment the following line if you want the server to stay connected to MongoDB
    await client.close();
  }
}

run().catch(console.dir);
