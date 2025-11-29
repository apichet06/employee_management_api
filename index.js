const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const departments = require('./routes/departmentRoutes')
app.use('/api/departmentAll', departments)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});