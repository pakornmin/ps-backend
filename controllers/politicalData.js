const express = require('express');
const router = express.Router();
const PoliticalData = require('../models/PoliticalData');
const Url = require('../models/Url');
require('dotenv').config();


//health chekck
router.get('/', (req, res) => {
    res.send('political data is working!');
})

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
        console.log(result);
        res.json(result);
    } catch(err) {
        res.json({message: err});
    }
});



//post one company
router.post('/postOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        const company = new PoliticalData({
            url: req.body.url,
            total: req.body.total,
            totalDemocrat: req.body.totalDemocrat,
            totalPAC: req.body.totalPAC,
            democratPAC: req.body.democratPAC,
            totalEmployee: req.body.totalEmployee,
            democratEmployee: req.body.democratEmployee,
            analysis: req.body.analysis,
            recomendation: req.body.recomendation
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
            res.json({message: err});
            //console.log(err);
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }

})

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
                    //res.json(savedCompany);
                }
            }
            res.json({insertedCompanies: insertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            res.json({message: err});
            console.log(err);
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
})

//get one company by url
router.get('/getOneCompany/:url', async (req, res) => {
    try {
        const foundCompany = await PoliticalData.findOne({url: req.params.url});
        const jsonResult = foundCompany.toJSON();
        //console.log(jsonResult)
        delete jsonResult._id;
        delete jsonResult.__v;
        //console.log(jsonResult)
        res.json(jsonResult);
    } catch(err) {
        res.json({message: err});
    }
})

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
        res.json({message: 'password incorrect'}).status(400);
    }
})

//update one company by url
router.patch('/updateOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCompany = await PoliticalData.findOneAndUpdate(
                {url: req.body.url}, 
                { $set: {
                    total: req.body.total,
                    totalDemocrat: req.body.totalDemocrat,
                    totalPAC: req.body.totalPAC,
                    democratPAC: req.body.democratPAC,
                    totalEmployee: req.body.totalEmployee,
                    democratEmployee: req.body.democratEmployee,
                    analysis: req.body.analysis,
                    recomendation: req.body.recomendation
                }},
                { upsert: true, new: true }
              );
            res.json(upsertedCompany);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
});

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
                    //res.json(savedCompany);
                }
            }
            res.json({upsertedCompanies: upsertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            console.log(err);
            res.json({message: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
});

//delete all companies
router.delete('/deleteAllCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const deletedCompanies = await PoliticalData.deleteMany({});
            res.json(deletedCompanies);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
})


module.exports = router;