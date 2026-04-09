-- Afterseven MVP Schema
-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  spots_remaining INTEGER NOT NULL CHECK (spots_remaining >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0),
  reservation_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_events_active ON events(is_active) WHERE is_active = true;
CREATE INDEX idx_reservations_event_id ON reservations(event_id);

-- Atomic reservation function — concurrency-safe spot decrement
CREATE OR REPLACE FUNCTION reserve_spots(
  p_event_id UUID,
  p_full_name TEXT,
  p_email TEXT,
  p_party_size INTEGER,
  p_reservation_code TEXT
) RETURNS UUID AS $$
DECLARE
  v_reservation_id UUID;
  v_updated INTEGER;
BEGIN
  -- Atomically decrement spots — fails if not enough remain
  UPDATE events
  SET spots_remaining = spots_remaining - p_party_size
  WHERE id = p_event_id
    AND is_active = true
    AND spots_remaining >= p_party_size;

  GET DIAGNOSTICS v_updated = ROW_COUNT;

  IF v_updated = 0 THEN
    RAISE EXCEPTION 'Not enough spots remaining';
  END IF;

  -- Insert reservation
  INSERT INTO reservations (event_id, full_name, email, party_size, reservation_code)
  VALUES (p_event_id, p_full_name, p_email, p_party_size, p_reservation_code)
  RETURNING id INTO v_reservation_id;

  RETURN v_reservation_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public can read active events only
CREATE POLICY "Anyone can read active events" ON events
  FOR SELECT USING (is_active = true);

-- No public write access — all writes go through Edge Functions with service_role
