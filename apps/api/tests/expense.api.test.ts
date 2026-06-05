import { execSync } from 'node:child_process';

import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { prisma } from '../src/db/prisma.js';
import { createApp } from '../src/app.js';

const app = createApp();

describe('expense API', () => {
  beforeAll(async () => {
    execSync('npx prisma db push --skip-generate', {
      cwd: process.cwd(),
      stdio: 'ignore',
    });
    await prisma.$connect();
  });

  beforeEach(async () => {
    await prisma.expense.deleteMany();
    await prisma.expense.createMany({
      data: [
        { amount: 20, category: 'food', date: new Date('2026-06-01'), note: 'Lunch' },
        { amount: 35, category: 'transport', date: new Date('2026-06-03'), note: 'Taxi' },
        { amount: 10, category: 'food', date: new Date('2026-05-20'), note: 'Snack' },
      ],
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('lists expenses with category filter', async () => {
    const res = await request(app).get('/api/v1/expenses').query({ category: 'food' });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].category).toBe('food');
  });

  it('filters expenses by date range', async () => {
    const res = await request(app).get('/api/v1/expenses').query({
      fromDate: '2026-06-01',
      toDate: '2026-06-30',
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it('creates expense and returns validation error for invalid payload', async () => {
    const createRes = await request(app).post('/api/v1/expenses').send({
      amount: 14.2,
      category: 'health',
      date: '2026-06-08',
      note: 'Pharmacy',
    });

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.category).toBe('health');

    const invalidRes = await request(app).post('/api/v1/expenses').send({
      amount: -10,
      category: 'unknown',
      date: '2026-06-08',
      note: '',
    });

    expect(invalidRes.status).toBe(400);
    expect(invalidRes.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('returns monthly summary with trend', async () => {
    const res = await request(app)
      .get('/api/v1/expenses/summary/monthly')
      .query({ year: 2026, month: 6 });

    expect(res.status).toBe(200);
    expect(res.body.data.totalAmount).toBe(55);
    expect(res.body.data.count).toBe(2);
    expect(res.body.data.trendVsPreviousMonth).toBe(45);
  });

  it('updates and deletes an expense', async () => {
    const existing = await prisma.expense.findFirstOrThrow({
      where: { category: 'food' },
      orderBy: { createdAt: 'asc' },
    });

    const updateRes = await request(app).patch(`/api/v1/expenses/${existing.id}`).send({
      note: 'Updated note',
      amount: 24.5,
      date: '2026-06-10',
    });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.note).toBe('Updated note');
    expect(updateRes.body.data.amount).toBe(24.5);

    const deleteRes = await request(app).delete(`/api/v1/expenses/${existing.id}`);
    expect(deleteRes.status).toBe(204);
  });

  it('returns 404 for non-existent expense update/delete', async () => {
    const missingId = 'b834e85e-59f0-4fa9-bffc-80f59de45a9f';

    const updateRes = await request(app).patch(`/api/v1/expenses/${missingId}`).send({
      note: 'No-op',
    });
    expect(updateRes.status).toBe(404);
    expect(updateRes.body.error.code).toBe('EXPENSE_NOT_FOUND');

    const deleteRes = await request(app).delete(`/api/v1/expenses/${missingId}`);
    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.error.code).toBe('EXPENSE_NOT_FOUND');
  });
});
