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
        return res.status(401).json( { validate: ['The field email cannot be empty', 'The field password cannot be empty']})
    }

    if(email.length === 0){
        return res.status(401).json( { validate: ['The field email cannot be empty', '']})
    }

    else if(password.length === 0){
        return res.status(401).json( { validate: ['', 'The field password cannot be empty']})
    }

    else if (validator.validate(email) !== true){
        return res.status(401).json( { validate: ['The field email is incorrect', ''] })
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
    
                    return res.status(200).json({ message: 'Authentication success', tokens: { accessToken, refreshToken }})
                }
            }

            if(eventType === 'keyup'){
                return res.status(401).json({ validate: ['', ''], message: 'Authentication failed' })
            }
        }

        else {
            return res.status(401).json({ validate: ['', ''], message: 'Authentication failed' })
        }
            
    }
})

module.exports = Router;