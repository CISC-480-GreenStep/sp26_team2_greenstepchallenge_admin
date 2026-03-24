import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kyburiaubfmbnxbryeqq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5YnVyaWF1YmZtYm54YnJ5ZXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTA3NDksImV4cCI6MjA4ODcyNjc0OX0.um0jAXms2FyGvkYwon20ujPT5YCRMGhdsHIUA83SWsk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
