const express = require('express'),
    router = express.Router();
// 
router.get('/register', (req, res) => {
    res.render('users/register')
})
router.post('/register', (req, res) => {
    res.send('register post route works')
})
//
router.get('/login', (req, res) => {
    res.send('login form goes here')
})
router.post('/login', (req, res) => {
    res.send('login logic goes here')
})
// 
router.get('/logout', (req, res) => {
    res.send('logout logic goes here')
})
// export router
module.exports = router;