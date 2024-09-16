import express from 'express';
const Route = express.Router();
const employee =  require('./employee');


for (const property in employee) {
  Route.use('/employee', employee[property]);
}


export default Route;