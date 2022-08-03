const express = require('express');
const StoreCategory = require('../models/StoreCategory');
const router = express.Router();
require('dotenv').config();


//health chekck
router.get('/', (req, res) => {
    res.send('store category is working!');
})

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
        console.log(result);
        res.json(result);
    } catch(err) {
        res.json({message: err});
    }
});



//post one category
router.post('/postOneCategory', async (req, res) => {
    if(req.body.password === process.env.password) {
        const category = new StoreCategory({
            category: req.body.category,
            overall: req.body.overall
        });
    
        try {
            const savedCategory = await category.save();
            res.json(savedCategory); 
        } catch(err) {
            res.json({message: err});
            //console.log(err);
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }

})

//post multiple categories
router.post('/postManyCategories', async (req, res) => {
    if(req.body.password === process.env.password) {
        const categories = req.body.categories;
        try {
            const insertedCategories = await StoreCategory.insertMany(categories);
            res.send(insertedCategories);
        } catch(err) {
            res.json({message: err});
            console.log(err);
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
})

//get one category by name
router.get('/getOneCategory/:categoryName', async (req, res) => {
    try {
        const foundCategory = await StoreCategory.findOne({category: req.params.categoryName});
        const jsonResult = foundCategory.toJSON();
        //console.log(jsonResult)
        delete jsonResult._id;
        delete jsonResult.__v;
        //console.log(jsonResult)
        res.json(jsonResult);
    } catch(err) {
        res.json({message: err});
    }
})

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
        res.json({message: 'password incorrect'}).status(400);
    }
})

//update one category by name
router.patch('/updateOneCategory', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCategory = await StoreCategory.findOneAndUpdate(
                {category: req.body.category}, 
                { $set: {
                    overall: req.body.overall
                }},
                { upsert: true, new: true }
              );
            res.json(upsertedCategory);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
});

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
        res.json({message: 'password incorrect'}).status(400);
    }
})


module.exports = router;