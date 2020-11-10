const express = require('express'),
app = express(),
path = require('path');
// express configs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
// routes
app.get('/', (req, res) => {
    res.render('home')
})
// create listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));