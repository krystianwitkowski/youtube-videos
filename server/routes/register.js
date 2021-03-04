const express = require('express');
const validator = require('email-validator');
const admin = require('firebase-admin');
const Router = express.Router();
const bcrypt = require('bcrypt');

const db = admin.firestore();
let userID = 0;


Router.route('/')
.post(async(req, res) => {
    const { name, email, password, repeatPassword, eventType } = req.body;

    const lenUserName = 4;

    if(name.length === 0 && email.length === 0 && password.length === 0 && repeatPassword.length === 0){
        return res.status(401).json({ validate: ['The field name cannot be empty', 'The field email cannot be empty', 'The field password cannot be empty', 'The field repeat password cannot be empty'] })
    }

    else if(name.length < lenUserName) {
        return res.status(401).json({ validate: ['The field name cannot be less than 4 characters', '', '', ''] })
    }

    else if(validator.validate(email) !== true) {
        return res.status(401).json({ validate: ['', 'The field email is incorrect', '', ''] })
    }

    else if(password.length === 0 && password.length === 0) {
        return res.status(401).json({ validate: ['', '', 'The field password cannot be empty', 'The field repeat password cannot be empty'] })
    }

    else if(password !== repeatPassword) {
        return res.status(401).json({ validate: ['', '', 'The field passwords must be the same', 'The field passwords must be the same'] })
    }
    

    else {
        
        const snapshot = await db.collection('users').get()

        const isUser = snapshot.docs.find((doc) => {
            const user = doc.data();
            return user.name === name || user.email === email;
        })

        if(!isUser){
            if(eventType === 'click'){
                const users = db.collection('users');

                const saltRounds = 10;
                const hashPassword = await bcrypt.hash(password, saltRounds);
                const hashRepeatPassword = await bcrypt.hash(repeatPassword, saltRounds);
        
                const data = {
                    id: userID,
                    name,
                    email,
                    password: hashPassword,
                    repeatPassword: hashRepeatPassword
                }
        
                const newUser = users.add(data)
                
                userID++;

                return res.status(201).json({ message: 'User was created', validate:['','','','Your account has been created'], register: true })
            }

            else if(eventType === 'keydown' || eventType === 'keyup'){
                return res.status(200).json({ validate: true })
            }
        }

        else {
            return res.status(401).json({ validate: ['','','','Such user already exists'] })
        }

    }
})

module.exports = Router;