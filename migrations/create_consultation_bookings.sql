-- Create consultation_bookings table for landing page consultation requests
-- This table stores booking requests from the landing page

CREATE TABLE IF NOT EXISTS consultation_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    source TEXT DEFAULT 'landing-page',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'scheduled', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_created_at ON consultation_bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_status ON consultation_bookings(status);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_source ON consultation_bookings(source);

-- Add RLS (Row Level Security) policies
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON consultation_bookings
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Allow authenticated users to read all bookings
CREATE POLICY "Allow authenticated reads" ON consultation_bookings
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to update bookings
CREATE POLICY "Allow authenticated updates" ON consultation_bookings
    FOR UPDATE
    TO authenticated
    USING (true);

-- Add comment
COMMENT ON TABLE consultation_bookings IS 'Stores consultation booking requests from the landing page';
