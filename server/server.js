const express = require('express');
const { json, urlencoded } = require('express');
const { config } = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/hello', (req, res) => {
    res.send('Hello World!')
});

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((connection_error) => console.error('Error connecting to MongoDB:', connection_error));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});