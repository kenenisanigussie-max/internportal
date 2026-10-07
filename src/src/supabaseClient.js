import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase URL and Anon Key from your Supabase dashboard
const supabaseUrl = 'https://pnplkisjcwzcktulhmuo.supabase.co'
const supabaseAnonKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucGxraXNqY3d6Y2t0dWxobXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODA2OTQsImV4cCI6MjEwNjk1NjY5NH0.4COszvsAOX0S-qisz3lT-gmSAFvGvtzhnE_LTc8EPZI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)