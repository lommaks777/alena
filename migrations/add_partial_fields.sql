-- Add fields for partial quiz submissions
ALTER TABLE quiz_responses
ADD COLUMN IF NOT EXISTS is_partial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS current_question INTEGER,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster queries on partial submissions
CREATE INDEX IF NOT EXISTS idx_quiz_responses_is_partial ON quiz_responses(is_partial);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_updated_at ON quiz_responses(updated_at);

-- Add comment explaining the new fields
COMMENT ON COLUMN quiz_responses.is_partial IS 'Indicates if this is a partial (incomplete) quiz submission';
COMMENT ON COLUMN quiz_responses.current_question IS 'The question number where user stopped (for partial submissions)';
COMMENT ON COLUMN quiz_responses.updated_at IS 'Timestamp of last update (for tracking partial submission updates)';
