const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors =  require('cors');
require('dotenv').config();


//Middlewares
app.use(bodyParser.json({ limit: '3000mb' }));
app.use(cors());


//Import Routes
const politicalDataRoute = require('./controllers/politicalData');
app.use('/politicalData', politicalDataRoute);
const popularInformationRoute = require('./controllers/popularInformation');
app.use('/popularInformation', popularInformationRoute);
const allInfoRoute = require('./controllers/allInfo');
app.use('/allInfo', allInfoRoute);
const brandIssuesRoute = require('./controllers/brandIssue');
app.use('/brandIssues', brandIssuesRoute);
const storeCategoryRoute = require('./controllers/storeCategory');
app.use('/storeCategory', storeCategoryRoute);
const actionRoute = require('./controllers/action');
app.use('/action', actionRoute);



//ROUTE
app.get('/', (req, res) => {
    res.send('The api is working!');
});

//4eb614Q9oWLjlMm0
//Connect to DB
mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true}, 
    () => {
    console.log('connected to mongodb');
})


//listen
app.listen(process.env.PORT);