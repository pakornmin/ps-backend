const express = require('express');
const router = express.Router();
const BrandIssues = require('../models/BrandIssues');
const Action = require('../models/Action');
require('dotenv').config();

//health check
router.get('/', (req, res)=>{
    res.send('action is working');
})

//get all actions
router.get('/getAllActions', async (req, res) => {
    try {
        const allActions = await Action.find();
        const length = allActions.length;
        const jsonAllActions = [];
        for(let i = 0; i < length; i++) {
            const jsonPlaceHolder = allActions[i].toJSON();
            delete jsonPlaceHolder._id;
            delete jsonPlaceHolder.__v;
            jsonAllActions.push(jsonPlaceHolder);
        }
        res.json(jsonAllActions);
    } catch(err) {
        //console.log(err)
        res.sendStatus(400)
    }
});

//get one action by id
router.get('/getOneAction/:id', async (req, res) => {
    try {
        const action = await Action.findOne({id: req.params.id});
        const jsonAction = action.toJSON();
        delete jsonAction._id;
        delete jsonAction.__v;
        res.json(jsonAction);
    } catch(err) {
        //console.log(err)
        res.send({err: err});
    }
});


//post one action
router.post('/postOneAction', async (req, res) => {
    if(req.body.password === process.env.password){
        try {
            const newAction = new Action({
                id: req.body.id,
                label: req.body.label,
                description: req.body.description,
                link: req.body.link,
                imageUrl: req.body.imageUrl,
            });
            await newAction.save()
            res.json(newAction);
        } catch(err) {
            //console.log(err)
            res.send({err: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
});

//post many actions
router.post('/postManyActions', async (req, res) => {
    if(req.body.password === process.env.password){
        try {
            const newActions = req.body.actions;
            const savedCompanies = await Action.insertMany(newActions);
            res.json(savedCompanies);
        } catch(err) {
            //console.log(err)
            res.send({err: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
});


module.exports = router;
