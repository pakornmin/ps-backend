const express = require('express');
const BrandIssues = require('../models/BrandIssues');
const router = express.Router();
const Url = require('../models/Url');
require('dotenv').config();


/**
 * @swagger
 * components:
 *   schemas:
 *     Issue:
 *       type: object
 *       required:
 *         - text
 *         - linkText
 *         - link
 *         - iconPath
 *       properties:
 *         text:
 *           type: string
 *         linkText:
 *           type: string
 *         link:
 *           type: string
 *         iconPath:
 *           type: string
 *         
 *       example:
 *         text: "Tax Dodger"
 *         linkText: "https://itep.org/notadime/"
 *         link: "Institute on Taxation and Economic Policy"
 *         iconPath: "steal.png"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     BrandIssue:
 *       type: object
 *       required:
 *         - name
 *         - url
 *         - category
 *         - fullName
 *         - iconPath
 *         - issueList
 *       properties:
 *         name:
 *           type: string
 *           description: name of a company
 *         url:
 *           type: string
 *           description: company's website domain
 *         category:
 *           type: string
 *           description: a category in which a company is in
 *         fullName: 
 *           type: string
 *           description: full name/alternative names of companies
 *         iconPath:
 *           type: string
 *           description: company's icon url
 *         issueList:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Issue'
 *            description: List of issues about a company
 *       example:
 *         "name": "Example"
 *         "url": "www.example.com"
 *         "category": "General Merchandise"
 *         "fullName": "Example Co."
 *         "iconPath": "example.com.svg"
 *         "issueList": [{"text": "Tax Dodger", "linkText": "Institute on Taxation and Economic Policy", "link": "https://itep.org/notadime/", "iconPath": "steal.png"}]
 */






/**
  * @swagger
  * tags:
  *   name: Brand Issues
  *   description: The API for managing brand issues
  */

//health chekck
router.get('/', (req, res) => {
    res.send('brand issues is working!');
})



/**
 * @swagger
 * /brandIssues/getAllCompanies:
 *   get:
 *     summary: Get all companies' brand issue
 *     tags: [Brand Issues]
 *     responses:
 *       200:
 *         description: all actions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: Bad request
 */
//get all companies
router.get('/getAllCompanies', async (req, res) => {
    try {
        const companies = await BrandIssues.find();
        const result = [];
        const length = companies.length;
        for(let i = 0; i < length; i++) {
            const jsonPlaceholder = companies[i].toJSON();
            delete jsonPlaceholder._id;
            delete jsonPlaceholder.__v;
            result.push(jsonPlaceholder);
        }
        console.log(result);
        res.json(result);
    } catch(err) {
        res.status(400).json({message: "cannot get all companies"});
    }
});


/**
 * @swagger
 * /brandIssues/postOneCompany:
 *   post:
 *     summary: Create a new company
 *     tags: [Brand Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                company:
 *                  $ref: '#/components/schemas/BrandIssue'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: password incorrect/ unable to create a company
 */
//post one company
router.post('/postOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        const company = new BrandIssues({
            name: req.body.company.name,
            url: req.body.company.url,
            category: req.body.company.category,
            fullName: req.body.company.fullName,
            iconPath: req.body.company.iconPath,
            issueList: req.body.company.issueList
        });
    
        try {
            const existedUrl = await Url.findOne({url: req.body.url})
            if(!existedUrl) {
                const url =  new Url({
                    url: req.body.url
                });
                const savedUrl = await url.save();
                const savedCompany = await company.save();
                res.json({newUrl: savedUrl, savedCompany: savedCompany})
            }
            else {
                const savedCompany = await company.save();
                res.json(savedCompany);
            }
        } catch(err) {
            res.status(400).json({message: 'cannot create a company: incorrect input'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }

})



/**
 * @swagger
 * /brandIssues/postManyCompanies:
 *   post:
 *     summary: Create multiple companies
 *     tags: [Brand Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                companies:
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/BrandIssue'
 * 
 *     responses:
 *       200:
 *         description: The companies were successfully created
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items: 
 *                  $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: password incorrect/ unable to create a company
 */
//post multiple companies
router.post('/postManyCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        const companies = req.body.companies;
        const insertedUrls = [];
        const insertedCompanies = [];
        try {
            const length = companies.length;
            for(let i = 0; i < length; i++) {
                const company = new BrandIssues({
                    name: companies[i].name, 
                    url: companies[i].url,
                    category: companies[i].category,
                    fullName: companies[i].fullName,
                    iconPath: companies[i].iconPath,
                    issueList: companies[i].issueList
                });
                const existedUrl = await Url.findOne({url: companies[i].url})
                if(!existedUrl) {
                    const url =  new Url({
                        url: companies[i].url
                    });
                    const savedUrl = await url.save();
                    const savedCompany = await company.save();
                    insertedCompanies.push(savedCompany);
                    insertedUrls.push(savedUrl);
                }
                else {
                    const savedCompany = await company.save();
                    insertedCompanies.push(savedCompany);
                }
            }
            res.json({insertedCompanies: insertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            res.status(400).json({message: 'cannot create a company: incorrect input'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})



/**
 * @swagger
 * /brandIssues/getOneCompany/{url}:
 *   get:
 *     summary: Get one company's brand issue
 *     tags: [Brand Issues]
 *     parameters:
 *       - in: path
 *         name: url
 *         schema:
 *           type: string
 *         required: true
 *         description: The company's domain
 *     responses:
 *       200:
 *         description: the company's info is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: url does not exist in the database
 */
//get one company by url
router.get('/getOneCompany/:url', async (req, res) => {
    try {
        const foundCompany = await BrandIssues.findOne({url: req.params.url});
        const jsonResult = foundCompany.toJSON();
        delete jsonResult._id;
        delete jsonResult.__v;
        res.json(jsonResult);
    } catch(err) {
        res.status(400).json({message: "url does not existed"});
    }
})



/**
 * @swagger
 * /brandIssues/deleteOneCompany:
 *   delete:
 *     summary: delete a new company
 *     tags: [Brand Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                url:
 *                  type: string
 * 
 *     responses:
 *       200:
 *         description: The company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: password incorrect/ unable to delete a company
 */
//delte one company by url
router.delete('/deleteOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const company = await BrandIssues.deleteOne({url: req.body.url});
            res.json(company);
        } catch(err) {
            res.status(400).json({message: 'cannot delete a company: incorrect input'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})



/**
 * @swagger
 * /brandIssues/updateOneCompany:
 *   patch:
 *     summary: upsert a new company
 *     tags: [Brand Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                company:
 *                  $ref: '#/components/schemas/BrandIssue'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: password incorrect/ unable to upsert a company
 */
//update one company
router.patch('/updateOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCompany = await BrandIssues.findOneAndUpdate(
                {url: req.body.company.url}, 
                { $set: {
                    name: req.body.company.name,
                    category: req.body.company.category,
                    fullName: req.body.company.fullName,
                    iconPath: req.body.company.iconPath,
                    issueList: req.body.company.issueList
                }},
                { upsert: true, new: true }
              );
            res.json(upsertedCompany);
        } catch(err) {
            res.status(400).json({message: 'cannot upsert a company'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});




/**
 * @swagger
 * /brandIssues/updateManyCompanies:
 *   patch:
 *     summary: upsert multiple companies
 *     tags: [Brand Issues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                password:
 *                  type: string
 *                companies:
 *                  type: array
 *                  items: 
 *                      $ref: '#/components/schemas/BrandIssue'
 * 
 *     responses:
 *       200:
 *         description: The companies were successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/BrandIssue'
 *       400:
 *         description: password incorrect/ unable to upsert a company
 */
//update many companies
router.patch('/updateManyCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const companies = req.body.companies;
            const length = companies.length;
            const insertedUrls = [];
            const upsertedCompanies = [];
            for(let i = 0; i < length; i++) {
                const existedUrl = await Url.findOne({url: companies[i].url})
                if(!existedUrl) {
                    const url =  new Url({
                        url: companies[i].url
                    });
                    const savedUrl = await url.save();
                    const upsertedCompany = await BrandIssues.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            name: companies[i].name, 
                            category: companies[i].category,
                            fullName: companies[i].fullName,
                            iconPath: companies[i].iconPath,
                            issueList: companies[i].issueList
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                    insertedUrls.push(savedUrl);
                }
                else {
                    const upsertedCompany = await BrandIssues.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            name: companies[i].name, 
                            category: companies[i].category,
                            fullName: companies[i].fullName,
                            iconPath: companies[i].iconPath,
                            issueList: companies[i].issueList
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                }
            }
            res.json({upsertedCompanies: upsertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            res.status(400).json({message: 'cannot upsert a company'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});



/**
 * @swagger
 * /brandIssues/deleteAllCompanies:
 *   delete:
 *     summary: delete all company
 *     tags: [Brand Issues]
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
 *         description: All company were successfully deleted
 *
 *       400:
 *         description: password incorrect
 */
//delete all companies
router.delete('/deleteAllCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const deletedCompanies = await BrandIssues.deleteMany({});
            res.json(deletedCompanies);
        } catch(err) {
            res.status(400).json({message: 'cannot upsert a company: incorrect input'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})


module.exports = router;