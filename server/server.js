"use strict";
const dotenv = require('dotenv');

// Configure Environment variables FIRST (before importing app)
dotenv.config({ path: `${__dirname}/config.env`, debug: true, quiet: false });

const mongoose = require('mongoose');
const app = require(`${__dirname}/app`);

// Configure DB
const ConnectDB = (url) => {
    try {
        mongoose.connect(url)
            .then(con => console.log("Database connecton established..."))
            .catch(err => console.log(err));
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

ConnectDB(process.env.LOCAL_DB_URL);

const port = process.env.PORT || 8080;

app.listen(port, '127.0.0.1', () => {
    console.log(`Server is running on port ${port}...`);
});