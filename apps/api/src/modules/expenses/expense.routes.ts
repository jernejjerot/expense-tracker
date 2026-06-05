import { Router } from 'express';

import { prisma } from '../../db/prisma.js';
import { ExpenseController } from './expense.controller.js';
import { ExpenseService } from './expense.service.js';

const service = new ExpenseService(prisma);
const controller = new ExpenseController(service);

export const expenseRouter = Router();

expenseRouter.get('/expenses', controller.list);
expenseRouter.post('/expenses', controller.create);
expenseRouter.patch('/expenses/:id', controller.update);
expenseRouter.delete('/expenses/:id', controller.remove);
expenseRouter.get('/expenses/summary/monthly', controller.summary);
