const express = require('express');
const router = express.Router();
const PopularInformation = require('../models/PopularInformation');
const Url = require('../models/Url');
require('dotenv').config();


//health chekck
router.get('/', (req, res) => {
    res.send('popular info is working!');
})

//get all companies
router.get('/getAllCompanies', async (req, res) => {
    try {
        const companies = await PopularInformation.find();
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
        const company = new PopularInformation({
            name: req.body.name, 
            url: req.body.url,
            score: req.body.score,
            antiAbortionDonation: req.body.antiAbortionDonation
        });
    
        try {
            const existedUrl = await Url.findOne({url: req.body.url})
            if(!existedUrl) {
                const url =  new Url({
                    url: req.body.url
                });
                const savedUrl = await url.save();
                const savedCompany = await company.save();
                res.json({newUrl: savedUrl.toJSON(), savedCompany: savedCompany.toJSON()})
            }
            else {
                const savedCompany = await company.save();
                res.json(savedCompany.toJSON());
            }
        } catch(err) {
            res.json({message: err});
            //console.log(err);
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
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
                const company = new PopularInformation({
                    name: companies[i].name, 
                    url: companies[i].url,
                    score: companies[i].score,
                    antiAbortionDonation: companies[i].antiAbortionDonation
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
            res.json({message: err});
            console.log(err);
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})

//get one company by url
router.get('/getOneCompany/:url', async (req, res) => {
    try {
        const foundCompany = await PopularInformation.findOne({url: req.params.url});
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
            const company = await PopularInformation.deleteOne({url: req.body.url});
            res.json(company);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})

//update one company by url
router.patch('/updateOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const upsertedCompany = await PopularInformation.findOneAndUpdate(
                {url: req.body.url}, 
                { $set: {
                    name: req.body.name, 
                    score: req.body.score,
                    antiAbortionDonation: req.body.antiAbortionDonation
                }},
                { upsert: true, new: true }
              );
            res.json(upsertedCompany);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
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
                    const upsertedCompany = await PopularInformation.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            name: companies[i].name, 
                            score: companies[i].score,
                            antiAbortionDonation: companies[i].antiAbortionDonation
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                    insertedUrls.push(savedUrl);
                }
                else {
                    const upsertedCompany = await PopularInformation.findOneAndUpdate(
                        {url: companies[i].url}, 
                        { $set: {
                            name: companies[i].name, 
                            score: companies[i].score,
                            antiAbortionDonation: companies[i].antiAbortionDonation
                        }},
                        { upsert: true, new: true }
                    );
                    upsertedCompanies.push(upsertedCompany);
                }
            }
            res.json({upsertedCompanies: upsertedCompanies, insertedUrls: insertedUrls});
        } catch(err) {
            console.log(err);
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
});

//delete all companies
router.delete('/deleteAllCompanies', async (req, res) => {
    if(req.body.password === process.env.password) {
        try {
            const deletedCompanies = await PopularInformation.deleteMany({});
            res.json(deletedCompanies);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.status(400).json({message: 'password incorrect'});
    }
})


module.exports = router;