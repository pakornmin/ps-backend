const express = require('express');
const router = express.Router();
const PoliticalData = require('../models/PoliticalData');
const PopularInformation = require('../models/PopularInformation');
const Url = require('../models/Url');
const StoreCategory = require('../models/StoreCategory');
const BrandIssues = require('../models/BrandIssues');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();




/**
  * @swagger
  * tags:
  *   name: All info
  *   description: The API for managing all info about companies 
  */



//health check
router.get('/', (req, res)=>{
    res.send('all info is working');
})



/**
 * @swagger
 * /allInfo/getOneCompany/{url}:
 *   get:
 *     summary: Get one company's all info
 *     tags: [All info]
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
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 url:
 *                   type: string
 *                 category:
 *                   type: string
 *                 politicalData:
 *                   type: object
 *                   properties: 
 *                     total:
 *                       type: number
 *                     totalDemocrat: 
 *                       type: number
 *                     totalPAC:
 *                       type: number
 *                     democratPAC:
 *                       type: number
 *                     totalEmployee:
 *                       type: number
 *                     democratEmployee:
 *                       type: number
 *                     analysis: 
 *                       type: number
 *                     recomendation:
 *                       type: number
 *                 popularInformation: 
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: string
 *                     antiAbortionDonation:
 *                       type: boolean
 *                 issueList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Issue'
 * 
 *       400:
 *         description: url does not exist in the database
 */
//get all information about one company
router.get('/getOneCompany/:url', async (req, res) => {
    try {
        const politicalData = await PoliticalData.findOne({url: req.params.url});
        const popularInformation = await PopularInformation.findOne({url: req.params.url});
        const brandIssues = await BrandIssues.findOne({url: req.params.url});
        let jsonBrandIssues = null;
        let jsonPoliticalData = null;
        let jsonPopularInfo = null;
        let iconPath = '';
        let name = '';
        let url = '';
        if(brandIssues) {
            jsonBrandIssues = brandIssues.toJSON();
            name = jsonBrandIssues.name;
            url = jsonBrandIssues.url;
            iconPath = jsonBrandIssues.iconPath;
            delete jsonBrandIssues._id;
            delete jsonBrandIssues.__v;
            delete jsonBrandIssues.name;
            delete jsonBrandIssues.url;
        }
        if(politicalData) {
            jsonPoliticalData = politicalData.toJSON();
            url = jsonPoliticalData.url;
            delete jsonPoliticalData._id;
            delete jsonPoliticalData.__v;
            delete jsonPoliticalData.name;
            delete jsonPoliticalData.url;
            }
        if(popularInformation) {
            jsonPopularInfo = popularInformation.toJSON();
            name = jsonPopularInfo.name;
            url = jsonPopularInfo.url;
            delete jsonPopularInfo._id;
            delete jsonPopularInfo.__v;
            delete jsonPopularInfo.name;
            delete jsonPopularInfo.url;
        }

        const result = { 
                            name: name, 
                            url: url, 
                            iconPath: iconPath,
                            category: jsonBrandIssues.category,
                            politicalData: jsonPoliticalData, 
                            popularInformation: jsonPopularInfo, 
                            issueList: jsonBrandIssues.issueList
                        }
        res.json(result);
    } catch(err) {
        res.status(400).json({message: 'url does not exist in the database'});
    }
});





/**
 * @swagger
 * /allInfo/getAllCompanies/:
 *   get:
 *     summary: Get every company's all info
 *     tags: [All info]
 *     responses:
 *       200:
 *         description: companies' info is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *                   category:
 *                     type: string
 *                   politicalData:
 *                     type: object
 *                     properties: 
 *                       total:
 *                         type: number
 *                       totalDemocrat: 
 *                         type: number
 *                       totalPAC:
 *                         type: number
 *                       democratPAC:
 *                         type: number
 *                       totalEmployee:
 *                         type: number
 *                       democratEmployee:
 *                         type: number
 *                       analysis: 
 *                         type: number
 *                       recomendation:
 *                         type: number
 *                   popularInformation: 
 *                     type: object
 *                     properties:
 *                       score:
 *                         type: string
 *                       antiAbortionDonation:
 *                         type: boolean
 *                   issueList:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Issue'
 * 
 *       400:
 *         description: url does not exist in the database
 */
//get all information about every company
router.get('/getAllCompanies', async (req, res) => {
    try {
        const allUrl = await Url.find();
        let response = [];
        const length = allUrl.length;
        console.log(length)
        for(let i = 0; i < length; i++) {
            const url = allUrl[i].url;
            const brandIssues = await BrandIssues.findOne({url: url});
            const politicalData = await PoliticalData.findOne({url: url});
            const popularInformation = await PopularInformation.findOne({url: url});
            let jsonBrandIssues = null;
            let jsonPoliticalData = null;
            let jsonPopularInfo = null;
            let name = null;
            let category = null;
            let iconPath = null;
            let issueList = [];
            if(brandIssues) {
                jsonBrandIssues = brandIssues.toJSON();
                name =  jsonBrandIssues.name;
                category = jsonBrandIssues.category;
                iconPath = jsonBrandIssues.iconPath;
                issueList = jsonBrandIssues.issueList;
                delete jsonBrandIssues._id;
                delete jsonBrandIssues.__v;
                delete jsonBrandIssues.name;
                delete jsonBrandIssues.url;
            }
            if(politicalData) {
                jsonPoliticalData = politicalData.toJSON();
                delete jsonPoliticalData._id;
                delete jsonPoliticalData.__v;
                delete jsonPoliticalData.name;
                delete jsonPoliticalData.url;
                }
            if(popularInformation) {
                jsonPopularInfo = popularInformation.toJSON();
                delete jsonPopularInfo._id;
                delete jsonPopularInfo.__v;
                delete jsonPopularInfo.name;
                delete jsonPopularInfo.url;
            }
            response.push({
                            name: name, 
                            url: url, 
                            category: category,
                            iconPath: iconPath,
                            politicalData: jsonPoliticalData, 
                            popularInformation: jsonPopularInfo, 
                            issueList: issueList
            });
        }
        res.json(response);
    } catch(err) {
        res.status(400).json({message: "cannot get all companies' information"});
    }
});



/**
 * @swagger
 * /allInfo/searchByName/{name}:
 *   get:
 *     summary: Get companies with the searched 'name' in their name
 *     tags: [All info]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: companies' info is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *                   category:
 *                     type: string
 *                   politicalData:
 *                     type: object
 *                     properties: 
 *                       total:
 *                         type: number
 *                       totalDemocrat: 
 *                         type: number
 *                       totalPAC:
 *                         type: number
 *                       democratPAC:
 *                         type: number
 *                       totalEmployee:
 *                         type: number
 *                       democratEmployee:
 *                         type: number
 *                       analysis: 
 *                         type: number
 *                       recomendation:
 *                         type: number
 *                   popularInformation: 
 *                     type: object
 *                     properties:
 *                       score:
 *                         type: string
 *                       antiAbortionDonation:
 *                         type: boolean
 *                   issueList:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Issue'
 * 
 *       400:
 *         description: url does not exist in the database
 */
//search companies information by names
router.get('/searchByName/:name', async (req, res) => {
    try {
        const allCompanies= await BrandIssues.find();
        let response = [];
        const length = allCompanies.length;
        for(let i = 0; i < length; i++) {
            if(allCompanies[i].name.toLowerCase().indexOf(req.params.name.toLowerCase()) !== -1) {
                const url = allCompanies[i].url;
                const politicalData = await PoliticalData.findOne({url: url});
                const popularInformation = await PopularInformation.findOne({url: url});
                const brandIssues = allCompanies[i];
                let jsonBrandIssues = null;
                let jsonPoliticalData = null;
                let jsonPopularInfo = null;
                const name = allCompanies[i].name;
                if(brandIssues) {
                    jsonBrandIssues = brandIssues.toJSON();
                    delete jsonBrandIssues._id;
                    delete jsonBrandIssues.__v;
                    delete jsonBrandIssues.name;
                    delete jsonBrandIssues.url;
                }
                if(politicalData) {
                    jsonPoliticalData = politicalData.toJSON();
                    delete jsonPoliticalData._id;
                    delete jsonPoliticalData.__v;
                    delete jsonPoliticalData.name;
                    delete jsonPoliticalData.url;
                    }
                if(popularInformation) {
                    jsonPopularInfo = popularInformation.toJSON();
                    delete jsonPopularInfo._id;
                    delete jsonPopularInfo.__v;
                    delete jsonPopularInfo.name;
                    delete jsonPopularInfo.url;
                }
                response.push({
                                name: name, 
                                url: url, 
                                category: jsonBrandIssues.category,
                                iconPath: jsonBrandIssues.iconPath,
                                politicalData: jsonPoliticalData, 
                                popularInformation: jsonPopularInfo, 
                                issueList: jsonBrandIssues.issueList
                });
            }
        }
        res.json(response);
    } catch(err) {
        res.status(400).json({message: "cannot get companies' information"});
    }
});




/**
 * @swagger
 * /allInfo/getCompaniesByCategory/{category}:
 *   get:
 *     summary: Get companies within the category 
 *     tags: [All info]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: companies' info is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   url:
 *                     type: string
 *                   category:
 *                     type: string
 *                   shopStatus: 
 *                     type: string
 *                   politicalData:
 *                     type: object
 *                     properties: 
 *                       total:
 *                         type: number
 *                       totalDemocrat: 
 *                         type: number
 *                       totalPAC:
 *                         type: number
 *                       democratPAC:
 *                         type: number
 *                       totalEmployee:
 *                         type: number
 *                       democratEmployee:
 *                         type: number
 *                       analysis: 
 *                         type: string
 *                       recomendation:
 *                         type: string
 *                   popularInformation: 
 *                     type: object
 *                     properties:
 *                       score:
 *                         type: string
 *                       antiAbortionDonation:
 *                         type: boolean
 *                   issueList:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Issue'
 * 
 *       400:
 *         description: url does not exist in the database
 */
//get companies by category 
router.get('/getCompaniesByCategory/:category', async (req, res) => {
    try {
        const allCompanies = await BrandIssues.find({category: req.params.category});
        let response = [];
        const length = allCompanies.length;
        for(let i = 0; i < length; i++) {
            const url = allCompanies[i].url;
            const politicalData = await PoliticalData.findOne({url: url});
            const popularInformation = await PopularInformation.findOne({url: url});
            const brandIssues = allCompanies[i];
            let jsonBrandIssues = null;
            let jsonPoliticalData = null;
            let jsonPopularInfo = null;
            const name = allCompanies[i].name;
            let shopStatus = '';
            if(brandIssues) {
                jsonBrandIssues = brandIssues.toJSON();
                delete jsonBrandIssues._id;
                delete jsonBrandIssues.__v;
                delete jsonBrandIssues.name;
                delete jsonBrandIssues.url;
            }
            if(politicalData) {
                jsonPoliticalData = politicalData.toJSON();
                delete jsonPoliticalData._id;
                delete jsonPoliticalData.__v;
                delete jsonPoliticalData.name;
                delete jsonPoliticalData.url;
                const percentDemocrat = jsonPoliticalData.totalDemocrat / jsonPoliticalData.total;
                const numIssue = jsonBrandIssues.length;
                
                if(percentDemocrat >= 0.6) {
                    shopStatus = 'NO';
                } else if(percentDemocrat >= 0.4 || numIssue>0) {
                    shopStatus = 'OK';
                } else {
                    shopStatus = 'YES';
                }
            }
            if(popularInformation) {
                jsonPopularInfo = popularInformation.toJSON();
                delete jsonPopularInfo._id;
                delete jsonPopularInfo.__v;
                delete jsonPopularInfo.name;
                delete jsonPopularInfo.url;
            }
            response.push({
                            name: name, 
                            url: url, 
                            shopStatus: shopStatus,
                            category: jsonBrandIssues.category,
                            iconPath: jsonBrandIssues.iconPath,
                            politicalData: jsonPoliticalData, 
                            popularInformation: jsonPopularInfo, 
                            issueList: jsonBrandIssues.issueList
            });
        }
        res.json(response);
    } catch(err) {
        console.log(err)
        res.status(400).json({message: "cannot get companies in the category"});
    }
});



module.exports = router;
