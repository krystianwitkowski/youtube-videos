const express = require('express');
const Router = express.Router();

Router.route('/')
.post((req, res) => {
    const setCookie = res.cookie('credentials', req.body);

    if(req.body.credentials){
        res.status(201).json({ data: { setCookie: true } })
    }

    else {
        res.clearCookie('credentials');
        res.status(201).json({ data: { setCookie: false } })
    }
})

module.exports = Router;