const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//adding express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//test to see if connection is working
app.get('/', (req,res) => {
    res.json({
        message: 'Hello World'
    });
});

//route to handle user requests that aren't supported by the app
app.use((req,res) => {
    res.status(404).end();
});

//adds server to PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});