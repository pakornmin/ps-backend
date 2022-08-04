const express = require('express');
const router = express.Router();
const BrandIssues = require('../models/BrandIssues');
const Action = require('../models/Action');
const e = require('express');
require('dotenv').config();


/**
 * @swagger
 * components:
 *   schemas:
 *     Action:
 *       type: object
 *       required:
 *         - id
 *         - label
 *         - description
 *         - link
 *         - imageUrl
 *       properties:
 *         id:
 *           type: string
 *           description: id of action
 *         label:
 *           type: string
 *           description: label of action
 *         description:
 *           type: string
 *           description: description of action
 *         link: 
 *           type: string
 *           description: link to action
 *         imageUrl:
 *           type: string
 *           description: image url of action
 *       example:
 *         id: "7"
 *         label: Run for office!
 *         description: You're qualified to run for office – Emerge America is here to help.
 *         link: https://emergeamerica.org/
 *         imageUrl: https://s3.us-east-2.amazonaws.com/extension-images/action-icons/ProgressiveShopper/vote.svg
 */

/**
  * @swagger
  * tags:
  *   name: Actions
  *   description: The API for managing actions
  */


//health check
router.get('/', (req, res)=>{
    res.send('action is working');
})


/**
 * @swagger
 * /action/getAllActions:
 *   get:
 *     summary: Get all actions
 *     tags: [Actions]
 *     responses:
 *       200:
 *         description: all actions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Action'
 *       400:
 *         description: Bad request
 */
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
        res.status(400).json({message: 'Something went wrog. Please try again after a while.'});
    }
});


/**
 * @swagger
 * /action/getOneAction/{id}:
 *   get:
 *     summary: Get the action by id
 *     tags: [Actions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The action id
 *     responses:
 *       200:
 *         description: The action by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       400:
 *         description: The action was not found
 */
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
        res.status(400).json({message: 'id does not exist in the database'});
    }
});


/**
 * @swagger
 * /action/postOneAction:
 *   post:
 *     summary: Create a new action
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                action:
 *                  $ref: '#/components/schemas/Action'
 * 
 *     responses:
 *       200:
 *         description: The actions was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Action'
 *       400:
 *         description: password incorrect/ unable to create an action
 */
//post one action
router.post('/postOneAction', async (req, res) => {
    if(req.body.password === process.env.password){
        try {
            const newAction = new Action({
                id: req.body.action.id,
                label: req.body.action.label,
                description: req.body.action.description,
                link: req.body.action.link,
                imageUrl: req.body.action.imageUrl,
            });
            await newAction.save()
            res.json(newAction);
        } catch(err) {
            res.status(400).json({message: "cannot create an action"});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});


/** 
 * @swagger
 * /action/postManyActions:
 *   post:
 *     summary: Create multiple actions
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                actions:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Action'
 * 
 *     responses:
 *       200:
 *         description: The actions were successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               item: 
 *                 $ref: '#/components/schemas/Action'
 *       400:
 *         description: password incorrect/ unable to create actions
 */
//post many actions
router.post('/postManyActions', async (req, res) => {
    if(req.body.password === process.env.password){
        try {
            const newActions = req.body.actions;
            const savedCompanies = await Action.insertMany(newActions);
            res.json(savedCompanies);
        } catch(err) {
            res.status(400).json({message: "cannot create an action"});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});


module.exports = router;
