import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://rzxrrdbhvrcpykotfwxs.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eHJyZGJodnJjcHlrb3Rmd3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM0MDkyODEsImV4cCI6MjA5ODk4NTI4MX0.rMrMBCoZmCe-ItF-niS4fqXltuRDP3cMDtWXgNCWrpQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
