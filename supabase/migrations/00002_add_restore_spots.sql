-- Atomic spot restoration for cancelled reservations
CREATE OR REPLACE FUNCTION restore_spots(
  p_event_id UUID,
  p_party_size INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET spots_remaining = LEAST(capacity, spots_remaining + p_party_size)
  WHERE id = p_event_id;
END;
$$ LANGUAGE plpgsql;
