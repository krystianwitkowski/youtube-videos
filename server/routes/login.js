const express = require('express');
const validator = require('email-validator');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const Router = express.Router();

const db = admin.firestore();

Router.route('/')
.post(async(req, res) => {
    const { email, password, eventType } = req.body

    if(email.length === 0 && password.length === 0){
        res.status(401).json({ error: {
            status: 401,
            message: 'Thie fields cannot be empty. Please try to complete all fields',
            data: ['The field email cannot be empty', 'The field password cannot be empty']
        }})
    }

    if(email.length === 0){
        res.status(401).json({ error: {
            status: 401,
            message: 'The field email cannot be empty. Please try to complete field',
            data: ['The field email cannot be empty', '']
        }})
    }

    else if(password.length === 0){
        res.status(401).json({ error: {
            status: 401,
            message: 'The field password cannot be empty. Please try to complete field',
            data: ['', 'The field password cannot be empty']
        }})
    }

    else if (validator.validate(email) !== true){
        res.status(401).json({ error: {
            status: 401,
            message: 'The field email is incorrect. Please check characters like @ or .',
            data: ['The field email is incorrect', '']
        }})
    }

    else {

        const users = await db.collection('users').get();

        const isUser = users.docs.find((doc) => {
            const docUser = doc.data();
            return docUser.email === email
        })

        if(isUser){
            const encryptedPassword = await bcrypt.compare(password, isUser.data().password);

            if(eventType === 'click'){
                if(encryptedPassword){
                    const accessToken = jwt.sign({ id: isUser.data().id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
                    const refreshToken = jwt.sign({ id: isUser.data().id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h' })
    
                    return res.status(200).json({ tokens: { accessToken, refreshToken }, auth: true })
                }
            }

            if(eventType === 'keyup'){
                res.status(401).json({ error: {
                    status: 401,
                    message: 'To login user you have to trigger click event',
                    data: ['', '']
                }})
            }
        }

        else {
            res.status(401).json({ error: {
                status: 401,
                message: 'To login user you have to trigger click event',
                data: ['', '']
            }})
        }
            
    }
})

module.exports = Router;