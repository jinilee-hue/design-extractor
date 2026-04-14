const express = require('express');
const cors = require('cors');
const { extractDesignTokens } = require('./extract');
const app = express();
app.use(cors()); app.use(express.json());

app.post('/analyze', async (req, res) => {
    try {
        const data = await extractDesignTokens(req.body.url);
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

app.listen(3000, () => console.log('✅ Analyzer Server: http://localhost:3000'));