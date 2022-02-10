const db = require('./db/connection');
const express = require('express');
const inputCheck = require('./utils/inputCheck');

const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

//adding express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use apiRoutes
app.use('/api', apiRoutes);

//route to handle user requests that aren't supported by the app - should be last GET route
app.use((req,res) => {
    res.status(404).end();
});

//adds server to PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});