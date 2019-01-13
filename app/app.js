const express = require('express')
const app = express()
const port = 3000

// app.get('/', (req, res) => res.send('Hello World!'))
app.use(express.static('public'));

// app.get('/', function (req, res) {
//     res.render('note.html');
// });
app.listen(port, () => console.log(`Example app listening on http://localhost:3000/note.html`))