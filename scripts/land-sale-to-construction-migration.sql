-- ============================================================
-- BUTTAR BUILDERS — Land Sale → Construction Project Workflow
-- Run this in: Supabase Dashboard > SQL Editor > New Query
--
-- Safe to run even if some of these tables already exist —
-- everything below uses IF NOT EXISTS / OR REPLACE guards.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Prerequisite tables (in case they aren't already present)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS purchased_lands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_name VARCHAR(255) NOT NULL,
  plot_number VARCHAR(100),
  location VARCHAR(255),
  owner VARCHAR(255),
  total_area DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit VARCHAR(20) NOT NULL DEFAULT 'marla',
  purchase_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  transfer_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  cost_per_unit DECIMAL(15,2) NOT NULL DEFAULT 0,
  used_area DECIMAL(10,2) NOT NULL DEFAULT 0,
  available_area DECIMAL(10,2) NOT NULL DEFAULT 0,
  purchase_date DATE,
  status VARCHAR(30) NOT NULL DEFAULT 'available',
  notes TEXT,
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_land_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  purchased_land_id UUID NOT NULL REFERENCES purchased_lands(id) ON DELETE RESTRICT,
  area_used DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_per_unit_snapshot DECIMAL(15,2) NOT NULL DEFAULT 0,
  land_cost DECIMAL(15,2) GENERATED ALWAYS AS (area_used * cost_per_unit_snapshot) STORED,
  assigned_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pla_project ON project_land_assignments(project_id);
CREATE INDEX IF NOT EXISTS idx_pla_land ON project_land_assignments(purchased_land_id);

-- ------------------------------------------------------------
-- 1. Land Sales table — selling a portion of a purchased plot
--    directly to a customer (independent of construction).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS land_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchased_land_id UUID NOT NULL REFERENCES purchased_lands(id) ON DELETE RESTRICT,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  area_sold DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL DEFAULT 'marla',
  sale_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  cost_per_unit_snapshot DECIMAL(15,2) NOT NULL DEFAULT 0,
  land_purchase_cost DECIMAL(15,2) GENERATED ALWAYS AS (area_sold * cost_per_unit_snapshot) STORED,
  land_profit DECIMAL(15,2) GENERATED ALWAYS AS (sale_price - (area_sold * cost_per_unit_snapshot)) STORED,
  purchase_date_snapshot DATE,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_mode VARCHAR(30) DEFAULT 'cash',
  notes TEXT,
  construction_status VARCHAR(30) NOT NULL DEFAULT 'no_construction',
  -- 'no_construction' | 'construction_started' | 'in_progress' | 'completed'
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ls_land ON land_sales(purchased_land_id);
CREATE INDEX IF NOT EXISTS idx_ls_project ON land_sales(project_id);

-- ------------------------------------------------------------
-- 2. Link Construction Projects back to the originating Land Sale
-- ------------------------------------------------------------
ALTER TABLE projects ADD COLUMN IF NOT EXISTS land_sale_id UUID REFERENCES land_sales(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS purchased_land_id UUID REFERENCES purchased_lands(id) ON DELETE SET NULL;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_amount DECIMAL(15,2) DEFAULT 0; -- Construction Revenue / Contract value

CREATE INDEX IF NOT EXISTS idx_projects_land_sale ON projects(land_sale_id);

-- ------------------------------------------------------------
-- 3. Keep purchased_lands.total_cost / cost_per_unit in sync
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION recompute_purchased_land_cost()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_cost := COALESCE(NEW.purchase_price,0) + COALESCE(NEW.transfer_fee,0);
  NEW.cost_per_unit := CASE WHEN COALESCE(NEW.total_area,0) > 0 THEN NEW.total_cost / NEW.total_area ELSE 0 END;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_purchased_lands_cost ON purchased_lands;
CREATE TRIGGER trg_purchased_lands_cost
  BEFORE INSERT OR UPDATE OF purchase_price, transfer_fee, total_area ON purchased_lands
  FOR EACH ROW EXECUTE FUNCTION recompute_purchased_land_cost();

-- ------------------------------------------------------------
-- 4. Keep purchased_lands.used_area / available_area / status in
--    sync with BOTH project_land_assignments AND land_sales, so
--    selling land to a customer reduces availability just like
--    assigning it to a project does.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION recompute_purchased_land_usage(p_land_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total DECIMAL(10,2);
  v_used DECIMAL(10,2);
BEGIN
  SELECT total_area INTO v_total FROM purchased_lands WHERE id = p_land_id;
  IF v_total IS NULL THEN RETURN; END IF;

  SELECT COALESCE(SUM(area_used),0) INTO v_used FROM project_land_assignments WHERE purchased_land_id = p_land_id;
  v_used := v_used + COALESCE((SELECT SUM(area_sold) FROM land_sales WHERE purchased_land_id = p_land_id),0);

  UPDATE purchased_lands
  SET used_area = v_used,
      available_area = GREATEST(v_total - v_used, 0),
      status = CASE
        WHEN v_total - v_used <= 0 THEN 'fully_used'
        WHEN v_used > 0 THEN 'partially_used'
        ELSE 'available'
      END,
      updated_at = NOW()
  WHERE id = p_land_id;
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_fn_land_sales_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM recompute_purchased_land_usage(OLD.purchased_land_id);
    RETURN OLD;
  ELSE
    PERFORM recompute_purchased_land_usage(NEW.purchased_land_id);
    IF TG_OP = 'UPDATE' AND OLD.purchased_land_id IS DISTINCT FROM NEW.purchased_land_id THEN
      PERFORM recompute_purchased_land_usage(OLD.purchased_land_id);
    END IF;
    RETURN NEW;
  END IF;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_land_sales_usage ON land_sales;
CREATE TRIGGER trg_land_sales_usage
  AFTER INSERT OR UPDATE OR DELETE ON land_sales
  FOR EACH ROW EXECUTE FUNCTION trg_fn_land_sales_usage();

CREATE OR REPLACE FUNCTION trg_fn_pla_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM recompute_purchased_land_usage(OLD.purchased_land_id);
    RETURN OLD;
  ELSE
    PERFORM recompute_purchased_land_usage(NEW.purchased_land_id);
    IF TG_OP = 'UPDATE' AND OLD.purchased_land_id IS DISTINCT FROM NEW.purchased_land_id THEN
      PERFORM recompute_purchased_land_usage(OLD.purchased_land_id);
    END IF;
    RETURN NEW;
  END IF;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_pla_usage ON project_land_assignments;
CREATE TRIGGER trg_pla_usage
  AFTER INSERT OR UPDATE OR DELETE ON project_land_assignments
  FOR EACH ROW EXECUTE FUNCTION trg_fn_pla_usage();

-- Keep land_sales.updated_at fresh
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_land_sales_upd ON land_sales;
CREATE TRIGGER trg_land_sales_upd BEFORE UPDATE ON land_sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_purchased_lands_upd ON purchased_lands;
CREATE TRIGGER trg_purchased_lands_upd BEFORE UPDATE ON purchased_lands FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_pla_upd ON project_land_assignments;
CREATE TRIGGER trg_pla_upd BEFORE UPDATE ON project_land_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ------------------------------------------------------------
-- 5. Cost summary view used by the Construction Project page
--    (Land Cost here reflects land ASSIGNED to a project via
--    project_land_assignments — the internal land-use workflow.
--    Land SOLD to a customer and converted into a project is
--    tracked separately through land_sales / land_profit so the
--    two flows never double count.)
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW project_cost_summary AS
SELECT
  p.id AS project_id,
  p.name AS project_name,
  COALESCE(la.land_cost, 0) AS land_cost,
  COALESCE(mp.material_cost, 0) AS material_cost,
  COALESCE(lp.labour_cost, 0) AS labour_cost,
  COALESCE(ex.other_expenses, 0) AS other_expenses,
  COALESCE(la.land_cost, 0) + COALESCE(mp.material_cost, 0) + COALESCE(lp.labour_cost, 0) + COALESCE(ex.other_expenses, 0) AS final_project_cost
FROM projects p
LEFT JOIN (SELECT project_id, SUM(land_cost) AS land_cost FROM project_land_assignments GROUP BY project_id) la ON la.project_id = p.id
LEFT JOIN (SELECT project_id, SUM(total_price) AS material_cost FROM material_purchases GROUP BY project_id) mp ON mp.project_id = p.id
LEFT JOIN (SELECT project_id, SUM(amount) AS labour_cost FROM labour_payments GROUP BY project_id) lp ON lp.project_id = p.id
LEFT JOIN (SELECT project_id, SUM(amount) AS other_expenses FROM expenses GROUP BY project_id) ex ON ex.project_id = p.id;

-- ------------------------------------------------------------
-- 6. Row Level Security
-- ------------------------------------------------------------
ALTER TABLE purchased_lands ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_land_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_sales ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='purchased_lands' AND policyname='purchased_lands_all') THEN
    CREATE POLICY purchased_lands_all ON purchased_lands FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_land_assignments' AND policyname='pla_all') THEN
    CREATE POLICY pla_all ON project_land_assignments FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='land_sales' AND policyname='land_sales_all') THEN
    CREATE POLICY land_sales_all ON land_sales FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ------------------------------------------------------------
-- 7. Backfill: make sure existing purchased_lands rows have
--    correct cost/usage figures under the new logic.
-- ------------------------------------------------------------
UPDATE purchased_lands SET
  total_cost = COALESCE(purchase_price,0) + COALESCE(transfer_fee,0),
  cost_per_unit = CASE WHEN COALESCE(total_area,0) > 0 THEN (COALESCE(purchase_price,0)+COALESCE(transfer_fee,0)) / total_area ELSE 0 END;

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT id FROM purchased_lands LOOP
    PERFORM recompute_purchased_land_usage(r.id);
  END LOOP;
END $$;
