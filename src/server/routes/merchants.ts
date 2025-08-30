import { Hono } from 'hono';
import { merchantService } from '../services/merchant.service';
import type { MerchantInput, MerchantUpdate, SearchParams } from '@shared/types';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const params: SearchParams = {
      q: c.req.query('q'),
      category_id: c.req.query('category_id'),
      is_active: c.req.query('is_active') ? c.req.query('is_active') === 'true' : undefined,
      is_featured: c.req.query('is_featured') ? c.req.query('is_featured') === 'true' : undefined,
      page: c.req.query('page') ? parseInt(c.req.query('page')!) : 1,
      limit: c.req.query('limit') ? parseInt(c.req.query('limit')!) : 20,
      sort: c.req.query('sort'),
      order: c.req.query('order') as 'asc' | 'desc' | undefined,
    };

    const result = await merchantService.search(params);
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch merchants' }, 500);
  }
});

app.get('/featured', async (c) => {
  try {
    const merchants = await merchantService.getFeatured();
    return c.json({ data: merchants });
  } catch (error) {
    return c.json({ error: 'Failed to fetch featured merchants' }, 500);
  }
});

app.get('/nearby', async (c) => {
  try {
    const latitude = parseFloat(c.req.query('lat')!);
    const longitude = parseFloat(c.req.query('lng')!);
    const radius = c.req.query('radius') ? parseFloat(c.req.query('radius')!) : undefined;

    if (isNaN(latitude) || isNaN(longitude)) {
      return c.json({ error: 'Invalid coordinates' }, 400);
    }

    const merchants = await merchantService.getNearby({ latitude, longitude, radius });
    return c.json({ data: merchants });
  } catch (error) {
    return c.json({ error: 'Failed to fetch nearby merchants' }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const merchant = await merchantService.getById(id);
    return c.json({ data: merchant });
  } catch (error) {
    return c.json({ error: 'Merchant not found' }, 404);
  }
});

app.post('/', async (c) => {
  try {
    const input = await c.req.json<MerchantInput>();
    const merchant = await merchantService.create(input);
    return c.json({ data: merchant }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create merchant' }, 400);
  }
});

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const update = await c.req.json<MerchantUpdate>();
    const merchant = await merchantService.update(id, update);
    return c.json({ data: merchant });
  } catch (error) {
    return c.json({ error: 'Failed to update merchant' }, 400);
  }
});

app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await merchantService.delete(id);
    return c.json({ message: 'Merchant deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete merchant' }, 400);
  }
});

app.post('/bulk/status', async (c) => {
  try {
    const { ids, is_active } = await c.req.json<{ ids: string[]; is_active: boolean }>();
    await merchantService.bulkUpdateStatus(ids, is_active);
    return c.json({ message: 'Status updated successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to update status' }, 400);
  }
});

app.post('/bulk/featured', async (c) => {
  try {
    const { ids, is_featured } = await c.req.json<{ ids: string[]; is_featured: boolean }>();
    await merchantService.bulkUpdateFeatured(ids, is_featured);
    return c.json({ message: 'Featured status updated successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to update featured status' }, 400);
  }
});

export default app;