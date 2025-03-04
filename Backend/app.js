const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

// app.listen(3000, (req,res)=> {
//     res.send("server listening 3000");
// });


module.exports = app;