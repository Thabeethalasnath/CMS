-- Update check constraint on proposals to allow 'Draft' status
ALTER TABLE public.proposals DROP CONSTRAINT IF EXISTS proposals_status_check;
ALTER TABLE public.proposals ADD CONSTRAINT proposals_status_check 
    CHECK (status IN ('Draft', 'Sent', 'Pending', 'Approved', 'In Review', 'Rejected'));

