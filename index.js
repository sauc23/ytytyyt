const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', async (req, res) => {
    try {
        // Construct the URL for the request
        const targetUrl = `https://invidious.jing.rocks${req.originalUrl}`;
        
        // Fetch the original response from invidious
        const response = await axios.get(targetUrl);
        
        // Load the HTML into cheerio
        const $ = cheerio.load(response.data);
        
        // Modify the href attributes
        $('a[href^="/watch?v="]').each((i, element) => {
            const id = $(element).attr('href').split('=')[1];
            $(element).attr('href', `https://edit.jdx3.org/yt.php?id=${id}`);
        });
        
        // Send the modified HTML back to the client
        res.send($.html());
    } catch (error) {
        console.error('Error fetching the page:', error);
        res.status(500).send('An error occurred while fetching the page.');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
