const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


const departments = require('./routes/departmentRoutes')
const holidays = require('./routes/holidayRoutes')
const websites = require('./routes/webseiteRoutes')
const news = require('./routes/newRoutes')


app.use('/api/website', websites)
app.use('/api/holiday', holidays)
app.use('/api/department', departments)
app.use('/api/news', news)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});