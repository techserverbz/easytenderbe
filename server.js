const express = require('express')
const app = express();
const cors = require('cors');
require("dotenv").config();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./models/config/config');

// Ensure DB is connected before handling any request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB connection failed:', err);
        res.status(503).json({ message: 'Database connection failed' });
    }
});

app.get('/', (req, res) => {
    return res.status(200).json({
        message: `server responding.${process.env.test} `
    })
})

app.use('/api', require('./routes/userRoutes'))
app.use('/api', require('./routes/tenderRoutes'))
app.use('/api', require('./controllers/usertenderController'))
app.use('/api', require('./routes/documentRoutes'))
app.use('/api', require('./controllers/GraphController'))
app.use('/api', require('./controllers/bankContrroller'))

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`)
    })
}

module.exports = app;
