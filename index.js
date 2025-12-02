const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const departments = require('./routes/departmentRoutes')
const holidays = require('./routes/holidayRoutes')

app.use('/api/holidayall', holidays)
app.use('/api/departmentall', departments)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});