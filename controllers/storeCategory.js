const express = require('express');
const StoreCategory = require('../models/StoreCategory');
const router = express.Router();
require('dotenv').config();




/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - category
 *         - overall
 *       properties:
 *         category:
 *           type: string
 *           description: category of business
 *         overall:
 *           type: string
 *           description: overall analysis of the category as a whole
 *         
 *       example:
 *         category: "Rental Cars"
 *         overall: "The rental car industry is very conservative.  We recommend using Uber or Lyft if you can."
 */

/**
  * @swagger
  * tags:
  *   name: Category
  *   description: The API for managing category
  */

//health chekck
router.get('/', (req, res) => {
    res.send('store category is working!');
})



/**
 * @swagger
 * /storeCategory/getAllCategories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Category'
 *       400:
 *         description: Bad request
 */
//get all categories
router.get('/getAllCategories', async (req, res) => {
    try {
        const categories = await StoreCategory.find();
        const result = [];
        const length = categories.length;
        for(let i = 0; i < length; i++) {
            const jsonPlaceholder = categories[i].toJSON();
            delete jsonPlaceholder._id;
            delete jsonPlaceholder.__v;
            result.push(jsonPlaceholder);
        }
        res.json(result);
    } catch(err) {
        res.json({message: err});
    }
});




/**
 * @swagger
 * /storeCategory/postOneCategory:
 *   post:
 *     summary: Create a new action
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                category:
 *                  $ref: '#/components/schemas/Category'
 * 
 *     responses:
 *       200:
 *         description: The categories were successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: password incorrect/ unable to create a category
 */
//post one category
router.post('/postOneCategory', async (req, res) => {
    if(req.body.password === process.env.password) {
        const category = new StoreCategory({
            category: req.body.category.category,
            overall: req.body.category.overall
        });
    
        try {
            const savedCategory = await category.save();
            res.json(savedCategory); 
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }

});



/** 
 * @swagger
 * /storeCategory/postManyCategories:
 *   post:
 *     summary: Create multiple categories
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                categories:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/Category'
 * 
 *     responses:
 *       200:
 *         description: The actions were successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       400:
 *         description: password incorrect/ unable to create actions
 */
//post multiple categories
router.post('/postManyCategories', async (req, res) => {
    if(req.body.password === process.env.password) {
        const categories = req.body.categories;
        try {
            const insertedCategories = await StoreCategory.insertMany(categories);
            res.send(insertedCategories);
        } catch(err) {
            res.status(400).json({message: "cannot create an action"});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})


/**
 * @swagger
 * /storeCategory/getOneCategory/{categoryName}:
 *   get:
 *     summary: Get the category by name
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         schema:
 *           type: string
 *         required: true
 *         description: exact name of the category
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: The action was not found
 */
//get one category by name
router.get('/getOneCategory/:categoryName', async (req, res) => {
    try {
        const foundCategory = await StoreCategory.findOne({category: req.params.categoryName});
        const jsonResult = foundCategory.toJSON();
        delete jsonResult._id;
        delete jsonResult.__v;
        res.json(jsonResult);
    } catch(err) {
        res.status(400).json("category does not exist")
    }
})



/**
 * @swagger
 * /storeCategory/deleteOneCategory:
 *   delete:
 *     summary: delete the category by name
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                category:
 *                  type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: The action was not found
 */
//delte one category by name
router.delete('/deleteOneCategory', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const category = await StoreCategory.deleteOne({category: req.body.category});
            res.json(category);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})


/**
 * @swagger
 * /storeCategory/updateOneCategory:
 *   patch:
 *     summary: upsert a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                category:
 *                  $ref: '#/components/schemas/Category'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: password incorrect/ unable to upsert a company
 */
//update one category by name
router.patch('/updateOneCategory', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCategory = await StoreCategory.findOneAndUpdate(
                {category: req.body.category.category}, 
                { $set: {
                    overall: req.body.category.overall
                }},
                { upsert: true, new: true }
              );
            res.json(upsertedCategory);
        } catch(err) {
            res.status(400).json({message: "cannot upsert a category"});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});


/**
 * @swagger
 * /storeCategory/deleteAllCategories:
 *   delete:
 *     summary: delete all categories
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *               
 * 
 *     responses:
 *       200:
 *         description: All categories were successfully deleted
 *
 *       400:
 *         description: password incorrect
 */
//delete all categories
router.delete('/deleteAllCategories', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const deletedCategories = await StoreCategory.deleteMany({});
            res.json(deletedCategories);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})


module.exports = router;