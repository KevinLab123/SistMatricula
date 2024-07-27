import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ztzgyyezjyqxhrsztcyw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0emd5eWV6anlxeGhyc3p0Y3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE3MTYyNTMsImV4cCI6MjAzNzI5MjI1M30.aoQ5BpwthgUcCX-H6rN9S_urE-URASXl2k6MpLBCK5Q'
export const supabase = createClient(supabaseUrl, supabaseKey)