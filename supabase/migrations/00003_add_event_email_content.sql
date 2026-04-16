-- Add per-event custom email content for reservation confirmations
ALTER TABLE events
ADD COLUMN IF NOT EXISTS email_content TEXT;
