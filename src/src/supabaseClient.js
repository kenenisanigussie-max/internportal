import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pnplkisjcwzcktulhmuo.supabase.co'
const supabaseAnonKey = 'sb_publishable_WfsZ3ZB-Q-e6PeLEGwcXmw_W9lUqQqp'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)