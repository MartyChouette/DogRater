const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let ratings = {};
let topDogs = [];

function updateTopDogs() {
    const dogEntries = Object.entries(ratings).map(([url, ratingsArray]) => {
        const averageRating = ratingsArray.reduce((sum, rate) => sum + rate, 0) / ratingsArray.length;
        return { url, averageRating };
    });

    topDogs = dogEntries.sort((a, b) => b.averageRating - a.averageRating).slice(0, 5);
}

app.post('/rate-dog', (req, res) => {
    const { url, rating } = req.body;
    if (!ratings[url]) {
        ratings[url] = [];
    }
    ratings[url].push(parseInt(rating));

    const averageRating = ratings[url].reduce((sum, rate) => sum + rate, 0) / ratings[url].length;
    updateTopDogs();
    res.json({ averageRating: averageRating.toFixed(2) });
});

app.get('/top-dogs', (req, res) => {
    res.json(topDogs);
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
