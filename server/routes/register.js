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
        res.status(400).json({ error: {
            status: 400,
            message: 'The fields cannot be empty. Please try to complete all fields',
            data: ['The field name cannot be empty', 'The field email cannot be empty', 'The field password cannot be empty', 'The field repeat password cannot be empty']
        }})
    }

    else if(name.length < lenUserName) {
        res.status(400).json({ error: {
            status: 400,
            message: 'The field name cannot be less than 4 characters. Please try to complete more than 4 signs',
            data: ['The field name cannot be less than 4 characters', '', '', '']
        }})
    }

    else if(validator.validate(email) !== true) {
        res.status(400).json({ error: {
            status: 400,
            message: 'The field email is incorrect. Please check this field to see if it has signs like @ or .',
            data: ['', 'The field email is incorrect', '', '']
        }})
    }

    else if(password.length === 0 && password.length === 0) {
        res.status(400).json({ error: {
            status: 400,
            message: 'The fields password are not the same. Please check this fields to see if it have the same characters.',
            data: ['', '', 'The field password cannot be empty', 'The field repeat password cannot be empty']
        }})
    }

    else if(password !== repeatPassword) {
        res.status(400).json({ error: {
            status: 400,
            message: 'The fields password are not the same. Please check this fields to see if it have the same characters.',
            data: ['', '', 'The field passwords must be the same', 'The field passwords must be the same']
        }})
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

                res.status(201).json({ data: { ...data }});
            }

            else if(eventType === 'keydown' || eventType === 'keyup'){
                res.status(400).json({ error: {
                    status: 400,
                    message: 'To register user you have to trigger click event',
                    data: ['', '', '', '']
                }})
            }
        }

        else {
            res.status(400).json({ error: {
                status: 400,
                message: 'Such user already exists. You have to change fields.',
                data: ['','','','Such user already exists']
            }})
        }

    }
})

module.exports = Router;