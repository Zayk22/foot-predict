import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cgdzkevnfolzpklurkyq.supabase.co';
const supabaseAnonKey = 'sb_publishable_urIfzQYRdlgbm2Be43kDAw_KXaKunOX';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);