import { pool } from '../config/db.js';

async function addDraftColumns() {
  const client = await pool.connect();
  try {
    console.log('Applying draft columns migration to Neon PostgreSQL...');
    await client.query(`
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS subtitle TEXT;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'published';
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS seo_title TEXT;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS seo_description TEXT;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS canonical_url TEXT;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS og_image TEXT;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS is_unlisted BOOLEAN DEFAULT FALSE;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS series_name TEXT;
      ALTER TABLE verdict_articles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log('Successfully added draft & Hashnode-grade settings columns to verdict_articles.');
  } catch (err: any) {
    console.error('Migration error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addDraftColumns();
