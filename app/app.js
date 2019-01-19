const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'));

app.get('/home', function (req, res) {
    res.render('public/note.html');
});
app.listen(port, () => console.log(`Example app listening on http://localhost:3000/note.html`))