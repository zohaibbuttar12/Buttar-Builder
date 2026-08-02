CREATE TABLE IF NOT EXISTS worker_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE labours
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES worker_categories(id) ON DELETE SET NULL;

-- Backfill category_id from the legacy category string for existing records.
UPDATE labours l
SET category_id = wc.id
FROM worker_categories wc
WHERE l.category_id IS NULL
  AND wc.name = l.category;

-- Keep existing category text for compatibility.
-- This can be removed later once the app is fully migrated.
ALTER TABLE labours
  ADD COLUMN IF NOT EXISTS category_name VARCHAR(255);

UPDATE labours
SET category_name = category
WHERE category_name IS NULL;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_worker_categories_upd ON worker_categories;
CREATE TRIGGER trg_worker_categories_upd
BEFORE UPDATE ON worker_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE worker_categories ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'worker_categories' AND policyname = 'worker_categories_all') THEN
    CREATE POLICY worker_categories_all ON worker_categories FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
