import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials as requested
const supabaseUrl = "https://tfaumdiiljwnjmfnonrc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYXVtZGlpbGp3bmptZm5vbnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzcwMzksImV4cCI6MjA3OTU1MzAzOX0.VbxwPIzu8kBb2MzrtT5gm17DdR5V5R_oLBn8wYwevCo";

console.log("[Supabase] Client initialized with provided credentials.");

export const supabase = createClient(supabaseUrl, supabaseKey);