import express from 'express';
import path from 'path';

let app = express();

// Serve the current directory as static files
app.use(express.static('.'));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(`${__dirname}/../demo.html`));
// });

app.listen(3000, () => {
    console.log('Webserver listening on port 3000!');
});
