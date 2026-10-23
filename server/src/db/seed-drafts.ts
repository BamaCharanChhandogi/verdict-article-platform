import { pool } from '../config/db.js';

async function seedDrafts() {
  await pool.query(`
    INSERT INTO verdict_articles (
      id, slug, title, description, content, cover_image, category, author_id, reading_time, status, tags
    ) VALUES (
      'draft-1',
      'draft-architecture-of-intent',
      'The Architecture of Intentional Craft',
      'Exploring the intersection of deep typography, minimal interfaces, and human cognition.',
      '# The Architecture of Intentional Craft\n\nModern digital craftsmanship requires balancing architectural velocity with long-term systemic stability.\n\n> "True craftsmanship is not how much you can add, but the disciplined grace of knowing what to leave untouched."\n\nWhen our systems prioritize depth over velocity, the work we produce leaves an indelible mark.',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      'Design',
      'user-demo-1',
      4,
      'draft',
      ARRAY['Design', 'Typography', 'Architecture']
    ) ON CONFLICT (id) DO UPDATE SET status = 'draft';
  `);
  console.log('Real draft seeded in PostgreSQL');
  process.exit(0);
}

seedDrafts().catch(e => {
  console.error(e);
  process.exit(1);
});
