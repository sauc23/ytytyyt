const express = require('express');
const axios = require('axios');
const { PassThrough } = require('stream');

const app = express();
const PORT = 5000;

// Proxy endpoint
app.get('/vid/:id.mp4', async (req, res) => {
    const videoId = req.params.id;
    const url = `https://inv.nadeko.net/latest_version?id=${videoId}`;

    try {
        // Make a request to the original URL to get the redirect
        const response = await axios.get(url, { maxRedirects: 0 });
        const redirectUrl = response.headers.location;

        // Now make a request to the redirect URL to get the video content
        const videoResponse = await axios.get(redirectUrl, {
            responseType: 'stream'
        });

        // Set the appropriate headers for video streaming
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', 'inline');

        // Pipe the video stream to the response
        videoResponse.data.pipe(res);
    } catch (error) {
        if (error.response && error.response.status === 302) {
            // Handle the redirect manually
            const redirectUrl = error.response.headers.location;

            // Make a request to the redirect URL to get the video content
            const videoResponse = await axios.get(redirectUrl, {
                responseType: 'stream'
            });

            // Set the appropriate headers for video streaming
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'inline');

            // Pipe the video stream to the response
            videoResponse.data.pipe(res);
        } else {
            // Handle other errors
            res.status(500).send('Error fetching video link');
        }
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
