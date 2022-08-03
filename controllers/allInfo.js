const express = require('express');
const router = express.Router();
const PoliticalData = require('../models/PoliticalData');
const PopularInformation = require('../models/PopularInformation');
const Url = require('../models/Url');
const StoreCategory = require('../models/StoreCategory');
const BrandIssues = require('../models/BrandIssues');
require('dotenv').config();

//health check
router.get('/', (req, res)=>{
    res.send('all info is working');
})

//get all information about one company
router.get('/getAllInfoOneCompany/:url', async (req, res) => {
    try {
        const politicalData = await PoliticalData.findOne({url: req.params.url});
        const popularInformation = await PopularInformation.findOne({url: req.params.url});
        const brandIssues = await BrandIssues.findOne({url: req.params.url});
        let jsonBrandIssues = null;
        let jsonPoliticalData = null;
        let jsonPopularInfo = null;
        let name = '';
        let url = '';
        if(brandIssues) {
            jsonBrandIssues = brandIssues.toJSON();
            name = jsonBrandIssues.name;
            url = jsonBrandIssues.url;
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
        //console.log(jsonResult)

        const result = { 
                            name: name, 
                            url: url, 
                            category: jsonBrandIssues.category,
                            politicalData: jsonPoliticalData, 
                            popularInformation: jsonPopularInfo, 
                            issueList: jsonBrandIssues.issueList
                        }
        res.json(result);
    } catch(err) {
        //console.log(err)
        res.sendStatus(400)
    }
});

//get all information about every company
router.get('/getAllInfoEveryCompany', async (req, res) => {
    try {
        const allCompanies = await BrandIssues.find();
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
        res.json(response);
    } catch(err) {
        //console.log(err)
        res.send({err: err});
    }
});


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
        //console.log(err)
        res.send({err: err});
    }
});
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
        res.json(response);
    } catch(err) {
        //console.log(err)
        res.send({err: err});
    }
});



module.exports = router;
