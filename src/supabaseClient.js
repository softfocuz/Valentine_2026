import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon/public key
const SUPABASE_URL = 'https://mtiivesvjtyudzraumim.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wBo0NCE4EN9V3_bpcmml3w__Ybyjd4d';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
