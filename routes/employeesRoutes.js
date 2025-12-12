const express = require('express');
const EmployeeController = require('../controllers/employeesController');

const router = express.Router()

router.post("/login", EmployeeController.login);

module.exports = router

