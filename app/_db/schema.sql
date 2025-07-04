CREATE TYPE enum_status AS ENUM ('draft', 'approved', 'sent');

CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  linkedin_url TEXT,
  message TEXT NOT NULL,
  status enum_status,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create an index on status for faster filtering
-- CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Create an index on created_at for sorting
-- CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
