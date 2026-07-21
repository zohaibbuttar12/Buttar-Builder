-- BUTTAR BUILDERS - Complete Database Setup
-- Run this in: Supabase Dashboard > SQL Editor > New Query

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_name VARCHAR(255) NOT NULL,
  client_contact VARCHAR(20),
  location VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE,
  budget DECIMAL(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS labours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  address TEXT,
  daily_rate DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS labour_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  labour_id UUID REFERENCES labours(id) ON DELETE SET NULL,
  labour_name VARCHAR(255),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT,
  amount DECIMAL(15,2) NOT NULL,
  payment_date DATE NOT NULL,
  days_worked INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  phone_number VARCHAR(20),
  email VARCHAR(255),
  material_type VARCHAR(100),
  address TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  vendor_name VARCHAR(255),
  material_name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL DEFAULT 'kg',
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  purchase_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  paid_to VARCHAR(255),
  amount DECIMAL(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lp_labour ON labour_payments(labour_id);
CREATE INDEX IF NOT EXISTS idx_lp_project ON labour_payments(project_id);
CREATE INDEX IF NOT EXISTS idx_mp_project ON material_purchases(project_id);
CREATE INDEX IF NOT EXISTS idx_mp_vendor ON material_purchases(vendor_id);
CREATE INDEX IF NOT EXISTS idx_exp_project ON expenses(project_id);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE labours ENABLE ROW LEVEL SECURITY;
ALTER TABLE labour_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies (open access - tighten in production)
DO $$ BEGIN
  -- projects
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='projects' AND policyname='projects_all') THEN
    CREATE POLICY projects_all ON projects FOR ALL USING (true) WITH CHECK (true);
  END IF;
  -- labours
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='labours' AND policyname='labours_all') THEN
    CREATE POLICY labours_all ON labours FOR ALL USING (true) WITH CHECK (true);
  END IF;
  -- labour_payments
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='labour_payments' AND policyname='lp_all') THEN
    CREATE POLICY lp_all ON labour_payments FOR ALL USING (true) WITH CHECK (true);
  END IF;
  -- vendors
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vendors' AND policyname='vendors_all') THEN
    CREATE POLICY vendors_all ON vendors FOR ALL USING (true) WITH CHECK (true);
  END IF;
  -- material_purchases
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='material_purchases' AND policyname='mp_all') THEN
    CREATE POLICY mp_all ON material_purchases FOR ALL USING (true) WITH CHECK (true);
  END IF;
  -- expenses
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='expenses' AND policyname='exp_all') THEN
    CREATE POLICY exp_all ON expenses FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projects_upd ON projects;
CREATE TRIGGER trg_projects_upd BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_labours_upd ON labours;
CREATE TRIGGER trg_labours_upd BEFORE UPDATE ON labours FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_lp_upd ON labour_payments;
CREATE TRIGGER trg_lp_upd BEFORE UPDATE ON labour_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_vendors_upd ON vendors;
CREATE TRIGGER trg_vendors_upd BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_mp_upd ON material_purchases;
CREATE TRIGGER trg_mp_upd BEFORE UPDATE ON material_purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_exp_upd ON expenses;
CREATE TRIGGER trg_exp_upd BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- NEW TABLES: Investment & Property Management
-- Run this block after the original tables
-- ============================================================

CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  cnic VARCHAR(20),
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  partner_name VARCHAR(255),
  share_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  invested_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, partner_id)
);

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plot_number VARCHAR(100) NOT NULL,
  property_type VARCHAR(50) NOT NULL DEFAULT 'plot',
  land_area DECIMAL(10,2) NOT NULL DEFAULT 0,
  land_unit VARCHAR(30) DEFAULT 'marla',
  land_purchase_price DECIMAL(15,2) DEFAULT 0,
  transfer_fees DECIMAL(15,2) DEFAULT 0,
  purchase_date DATE,
  construction_type VARCHAR(50) DEFAULT 'none',
  construction_area DECIMAL(10,2),
  construction_cost_per_sqft DECIMAL(10,2),
  total_construction_cost DECIMAL(15,2),
  construction_stage VARCHAR(50) DEFAULT 'not-started',
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  sale_price DECIMAL(15,2) NOT NULL,
  sale_date DATE NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(20),
  payment_mode VARCHAR(50) DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pp_project ON project_partners(project_id);
CREATE INDEX IF NOT EXISTS idx_pp_partner ON project_partners(partner_id);
CREATE INDEX IF NOT EXISTS idx_prop_project ON properties(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_project ON sales(project_id);
CREATE INDEX IF NOT EXISTS idx_sales_property ON sales(property_id);

-- RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='partners' AND policyname='partners_all') THEN
    CREATE POLICY partners_all ON partners FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='project_partners' AND policyname='pp_all') THEN
    CREATE POLICY pp_all ON project_partners FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='properties' AND policyname='properties_all') THEN
    CREATE POLICY properties_all ON properties FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='sales' AND policyname='sales_all') THEN
    CREATE POLICY sales_all ON sales FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DROP TRIGGER IF EXISTS trg_partners_upd ON partners;
CREATE TRIGGER trg_partners_upd BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_pp_upd ON project_partners;
CREATE TRIGGER trg_pp_upd BEFORE UPDATE ON project_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_properties_upd ON properties;
CREATE TRIGGER trg_properties_upd BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
DROP TRIGGER IF EXISTS trg_sales_upd ON sales;
CREATE TRIGGER trg_sales_upd BEFORE UPDATE ON sales FOR EACH ROW EXECUTE FUNCTION update_updated_at();
