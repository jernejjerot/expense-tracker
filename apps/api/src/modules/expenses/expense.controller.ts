import { Request, Response, NextFunction } from 'express';

import { ExpenseService } from './expense.service.js';
import {
  createExpenseRequestSchema,
  deleteExpenseRequestSchema,
  listExpenseRequestSchema,
  summaryRequestSchema,
  updateExpenseRequestSchema,
} from './expense.validation.js';

export class ExpenseController {
  constructor(private readonly service: ExpenseService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createExpenseRequestSchema.parse({ body: req.body });
      const expense = await this.service.create(parsed.body);
      res.status(201).json({ data: expense });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = listExpenseRequestSchema.parse({ query: req.query });
      const expenses = await this.service.list(parsed.query);
      res.status(200).json({ data: expenses });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = updateExpenseRequestSchema.parse({ params: req.params, body: req.body });
      const updated = await this.service.update(parsed.params.id, parsed.body);
      res.status(200).json({ data: updated });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = deleteExpenseRequestSchema.parse({ params: req.params });
      await this.service.remove(parsed.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  summary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = summaryRequestSchema.parse({ query: req.query });
      const summary = await this.service.monthlySummary(parsed.query.year, parsed.query.month);
      res.status(200).json({ data: summary });
    } catch (error) {
      next(error);
    }
  };
}
