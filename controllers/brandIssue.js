const express = require('express');
const BrandIssues = require('../models/BrandIssues');
const router = express.Router();
const Url = require('../models/Url');
require('dotenv').config();


//health chekck
router.get('/', (req, res) => {
    res.send('brand issues is working!');
})

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
        res.json({message: err});
    }
});



//post one company
router.post('/postOneCompany', async (req, res) => {
    if(req.body.password === process.env.password) {
        const company = new BrandIssues({
            name: req.body.name,
            url: req.body.url,
            category: req.body.category,
            fullName: req.body.fullName,
            iconPath: req.body.iconPath,
            issueList: req.body.issueList
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
        const foundCompany = await BrandIssues.findOne({url: req.params.url});
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
            const company = await BrandIssues.deleteOne({url: req.body.url});
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
            const upsertedCompany = await BrandIssues.findOneAndUpdate(
                {url: req.body.url}, 
                { $set: {
                    name: req.body.name,
                    category: req.body.category,
                    fullName: req.body.fullName,
                    iconPath: req.body.iconPath,
                    issueList: req.body.issueList
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
                    //res.json({newUrl: savedUrlAndName, savedCompany: savedCompany})
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
            const deletedCompanies = await BrandIssues.deleteMany({});
            res.json(deletedCompanies);
        } catch(err) {
            res.json({message: err});
        }
    } else {
        res.json({message: 'password incorrect'}).status(400);
    }
})


module.exports = router;