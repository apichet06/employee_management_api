const express = require('express')
const cors = require('cors')
const path = require("path");
const app = express();

app.use(cors())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const departments = require('./routes/departmentRoutes')
const holidays = require('./routes/holidayRoutes')
const websites = require('./routes/websiteRoutes')
const news = require('./routes/newRoutes')
const employeeRoutes = require('./routes/employeesRoutes')
const positionRoutes = require('./routes/positoinRoutes')
const workplaceRoutes = require('./routes/workplaceRoutes')
const logRoutes = require('./routes/logsRoutres')
const employeesRolesRoutes = require('./routes/employeesrolesRoutes')
const approverPermissionRoutes = require('./routes/approverPermissionRoutes')



app.use("/api/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use('/api/website', websites)
app.use('/api/holiday', holidays)
app.use('/api/department', departments)
app.use('/api/news', news)
app.use("/api/employee", employeeRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/workplace", workplaceRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/employeesroles", employeesRolesRoutes);
app.use("/api/approverpermission", approverPermissionRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});