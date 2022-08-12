const express = require('express');
const router = express.Router();
const PoliticalData = require('../models/PoliticalData');
const Url = require('../models/Url');
require('dotenv').config();


/**
 * @swagger
 * components:
 *   schemas:
 *     PoliticalData:
 *       type: object
 *       required:
 *         - url
 *         - total
 *         - totalDemocrat
 *         - totalPAC
 *         - democratPAC
 *         - totalEmployee
 *         - democratEmployee
 *         - analysis
 *         - recomendation
 *       properties:
 *         url:
 *           type: string
 *           description: company's website domain
 *         total:
 *           type: number
 *           description: total doantion the company has made to all parties
 *         totalDemocrat: 
 *           type: number
 *           description: total doantion the company has made to Democrat
 *         totalPAC:
 *           type: number
 *           description: total doantion the company's PAC has made to all parties
 *         democratPAC:
 *           type: number
 *           description: total doantion the company's PAC has made to Democrat
 *         totalEmployee:
 *           type: number
 *           description: total doantion the company's employees have made to all parties
 *         democratEmployee:
 *           type: number
 *           description: total doantion the company's employees have made to Democrat
 *         analysis: 
 *           type: number
 *           description: analysis on the company
 *         recomendation:
 *           type: number
 *           description: recomendation about the company
 *       example:
 *         "url": "www.exampleUrl.com"
 *         "total": 3876
 *         "totalDemocrat": 3876
 *         "totalPAC": 0
 *         "democratPAC": 0
 *         "totalEmployee": 3876
 *         "democratEmployee": 3876
 *         "analysis": "Example analysis."
 *         "recomendation": "Highly Recommended"
 *    
 */

/**
  * @swagger
  * tags:
  *   name: Political Data
  *   description: The API for managing political data 
  */

//health chekck
router.get('/', (req, res) => {
    res.send('political data is working!');
})


/**
 * @swagger
 * /politicalData/getAllCompanies:
 *   get:
 *     summary: Get all companies' political data
 *     tags: [Political Data]
 *     responses:
 *       200:
 *         description: all political data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/PoliticalData'
 *       400:
 *         description: Bad request
 */
//get all companies
router.get('/getAllCompanies', async (req, res) => {
    try {
        const companies = await PoliticalData.find();
        const result = [];
        const length = companies.length;
        for(let i = 0; i < length; i++) {
            const jsonPlaceholder = companies[i].toJSON();
            delete jsonPlaceholder._id;
            delete jsonPlaceholder.__v;
            result.push(jsonPlaceholder);
        }
        res.json(result);
    } catch(err) {
        res.status(400).json({message: "cannot get all companies"});
    }
});




/**
 * @swagger
 * /politicalData/postOneCompany:
 *   post:
 *     summary: Create a new company
 *     tags: [Political Data]
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
 *                  $ref: '#/components/schemas/PoliticalData'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PoliticalData'
 *       400:
 *         description: password incorrect/ unable to create a company
 */
//post one company
router.post('/postOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        const company = new PoliticalData({
            url: req.body.company.url,
            total: req.body.company.total,
            totalDemocrat: req.body.company.totalDemocrat,
            totalPAC: req.body.company.totalPAC,
            democratPAC: req.body.company.democratPAC,
            totalEmployee: req.body.company.totalEmployee,
            democratEmployee: req.body.company.democratEmployee,
            analysis: req.body.company.analysis,
            recomendation: req.body.company.recomendation
        });
    
        try {
            const existedUrl = await Url.findOne({url: req.body.company.url})
            if(!existedUrl) {
                const url =  new Url({
                    url: req.body.company.url
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
 * /politicalData/postManyCompanies:
 *   post:
 *     summary: Create multiple companies
 *     tags: [Political Data]
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
 *                      $ref: '#/components/schemas/PoliticalData'
 * 
 *     responses:
 *       200:
 *         description: The companies were successfully created
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items: 
 *                  $ref: '#/components/schemas/PoliticalData'
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
                const company = new PoliticalData({
                    url: companies[i].url,
                    total: companies[i].total,
                    totalDemocrat: companies[i].totalDemocrat,
                    totalPAC: companies[i].totalPAC,
                    democratPAC: companies[i].democratPAC,
                    totalEmployee: companies[i].totalEmployee,
                    democratEmployee: companies[i].democratEmployee,
                    analysis: companies[i].analysis,
                    recomendation: companies[i].recomendation
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
 * /politicalData/getOneCompany/{url}:
 *   get:
 *     summary: Get one company's political data
 *     tags: [Political Data]
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
 *               $ref: '#/components/schemas/PoliticalData'
 *       400:
 *         description: url does not exist in the database
 */
//get one company by url
router.get('/getOneCompany/:url', async (req, res) => {
    try {
        const foundCompany = await PoliticalData.findOne({url: req.params.url});
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
 * /politicalData/deleteOneCompany:
 *   delete:
 *     summary: delete a new company
 *     tags: [Political Data]
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
 *               $ref: '#/components/schemas/politicalData'
 *       400:
 *         description: password incorrect/ unable to delete a company
 */
//delte one company by url
router.delete('/deleteOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const company = await PoliticalData.deleteOne({url: req.body.url});
            res.json(company);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})




/**
 * @swagger
 * /politicalData/updateOneCompany:
 *   patch:
 *     summary: upsert a new company
 *     tags: [Political Data]
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
 *                  $ref: '#/components/schemas/PoliticalData'
 * 
 *     responses:
 *       200:
 *         description: The company was successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PoliticalData'
 *       400:
 *         description: password incorrect/ unable to upsert a company
 */
//update one company
router.patch('/updateOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCompany = await PoliticalData.findOneAndUpdate(
                {url: req.body.company.url}, 
                { $set: {
                    total: req.body.company.total,
                    totalDemocrat: req.body.company.totalDemocrat,
                    totalPAC: req.body.company.totalPAC,
                    democratPAC: req.body.company.democratPAC,
                    totalEmployee: req.body.company.totalEmployee,
                    democratEmployee: req.body.company.democratEmployee,
                    analysis: req.body.company.analysis,
                    recomendation: req.body.company.recomendation
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
 * /politicalData/updateManyCompanies:
 *   patch:
 *     summary: upsert multiple companies
 *     tags: [Political Data]
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
 *                      $ref: '#/components/schemas/PoliticalData'
 * 
 *     responses:
 *       200:
 *         description: The companies were successfully upserted
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: 
 *                 $ref: '#/components/schemas/PoliticalData'
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
                    const upsertedCompany = await PoliticalData.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            total: companies[i].total,
                            totalDemocrat: companies[i].totalDemocrat,
                            totalPAC: companies[i].totalPAC,
                            democratPAC: companies[i].democratPAC,
                            totalEmployee: companies[i].totalEmployee,
                            democratEmployee: companies[i].democratEmployee,
                            analysis: companies[i].analysis,
                            recomendation: companies[i].recomendation
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                    insertedUrls.push(savedUrl);
                }
                else {
                    const upsertedCompany = await PoliticalData.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            total: companies[i].total,
                            totalDemocrat: companies[i].totalDemocrat,
                            totalPAC: companies[i].totalPAC,
                            democratPAC: companies[i].democratPAC,
                            totalEmployee: companies[i].totalEmployee,
                            democratEmployee: companies[i].democratEmployee,
                            analysis: companies[i].analysis,
                            recomendation: companies[i].recomendation
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
 * /politicalData/deleteAllCompanies:
 *   delete:
 *     summary: delete all company
 *     tags: [Political Data]
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
 *       400:
 *         description: password incorrect
 */
//delete all companies
router.delete('/deleteAllCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const deletedCompanies = await PoliticalData.deleteMany({});
            res.json(deletedCompanies);
        } catch(err) {
            res.status(400).json({message: 'cannot delete companies'});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})


module.exports = router;