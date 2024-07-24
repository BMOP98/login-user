const express = require('express');
const router = express.Router();
const connection = require('../../modules/dbconect');

router.get('/:mail/:password', async (req, res) => {
    const { mail, password } = req.params;
    const response = await fetch("http://localhost:4003/apiencrypt/" + mail + "/" + password);
    if(response.ok){
        const data = await response.json();
        const email = data.mail;
        const pass = data.password;
        console.log("mail " + email + " pass " + pass);
        connection.query('SELECT * FROM clients WHERE mail = ? AND password = ?', [email, pass], (err, results) => {
            if (err) {
                console.log("ERROR " + err.message);
                return res.status(500).json({ err: err.message });
            }   
            if (results.length > 0) {
                res.status(201).json(results[0]);
            } else {
                res.status(404).json('Incorrect Email or Password');
            }
        });
    }
});

module.exports = router;