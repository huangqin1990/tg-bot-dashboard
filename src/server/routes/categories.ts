import { Hono } from 'hono';
import { categoryService } from '../services/category.service';
import type { CategoryInput, CategoryUpdate } from '@shared/types';

const app = new Hono();

app.get('/', async (c) => {
  try {
    const isActive = c.req.query('is_active');
    const categories = await categoryService.getAll(
      isActive !== undefined ? isActive === 'true' : undefined
    );
    return c.json({ data: categories });
  } catch (error) {
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const category = await categoryService.getById(id);
    return c.json({ data: category });
  } catch (error) {
    return c.json({ error: 'Category not found' }, 404);
  }
});

app.post('/', async (c) => {
  try {
    const input = await c.req.json<CategoryInput>();
    const category = await categoryService.create(input);
    return c.json({ data: category }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create category' }, 400);
  }
});

app.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const update = await c.req.json<CategoryUpdate>();
    const category = await categoryService.update(id, update);
    return c.json({ data: category });
  } catch (error) {
    return c.json({ error: 'Failed to update category' }, 400);
  }
});

app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await categoryService.delete(id);
    return c.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete category' }, 400);
  }
});

app.post('/reorder', async (c) => {
  try {
    const { categories } = await c.req.json<{ 
      categories: Array<{ id: string; display_order: number }> 
    }>();
    await categoryService.updateOrder(categories);
    return c.json({ message: 'Category order updated successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to update category order' }, 400);
  }
});

export default app;