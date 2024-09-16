import { findOne, upsert } from '../helpers/db.helpers';
import employeModel from '../models/employe.model';
import { genHash } from './common.util';

export const bootstrapAdmin = async function (start: Function) {
  const userPassword = await genHash("11111111");
  const data = {
    email: 'manager@yopmail.com',
    password: userPassword,
    employeeName:"Manager",
    role: 1,
    userType:"manager",
    employeeId: "1001",
  };
        
  const manager = await findOne(employeModel, {role: 1, userType:"manager"});
  if (!manager) {
    await upsert(employeModel, data)
  }
  start();
};