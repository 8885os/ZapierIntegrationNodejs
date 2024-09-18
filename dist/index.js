import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
const app = express();
app.use(cors({
    credentials: true,
}));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
const server = http.createServer(app);
server.listen(8080, () => {
    console.log('Server started on port 8080');
});
// POST /user
app.post('/user', (req, res) => {
    const { name, email, id } = req.body;
    // Store the user data in a database or a temporary storage
    const userData = { name, email, id };
    // For demonstration purposes, we'll store it in a simple object
    const users = {};
    users[id] = userData;
    res.json({ message: 'User created successfully' });
});
// POST /user/:id/data
app.post('/user/:id/data', (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // Store the data associated with the user
    const users = {};
    if (!users[id]) {
        users[id] = {};
    }
    users[id].data = data;
    // Trigger a webhook to Zapier
    const zapierWebhookUrl = 'YOUR_ZAPIER_WEBHOOK_URL';
    const zapierData = { id, data };
    // Use a library like axios to send a POST request to the Zapier webhook
    const axios = require('axios');
    axios
        .post(zapierWebhookUrl, zapierData)
        .then(() => {
        res.json({ message: 'Data posted successfully' });
    })
        .catch((error) => {
        console.error(error);
        res.status(500).json({ message: 'Error posting data' });
    });
});
// GET /user/:id/data
app.get('/user/:id/data', (req, res) => {
    const { id } = req.params;
    // Retrieve the data associated with the user
    const users = {};
    if (!users[id]) {
        res.status(404).json({ message: 'User not found' });
    }
    else {
        const data = users[id].data;
        res.json(data);
    }
});
//# sourceMappingURL=index.js.map