import express from 'express';
import path from 'path';

let app = express();
let port = 3000;

app.use(express.static('.'));

app.get('/map', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../demo_test.html`));
});

app.listen(port, () => {
    console.log(`Website listening on port ${port}`);
});
