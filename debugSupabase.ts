import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tfaumdiiljwnjmfnonrc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYXVtZGlpbGp3bmptZm5vbnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzcwMzksImV4cCI6MjA3OTU1MzAzOX0.VbxwPIzu8kBb2MzrtT5gm17DdR5V5R_oLBn8wYwevCo";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("Testing Supabase Connection...");

    try {
        const { data, error } = await supabase
            .from('movie_posters')
            .select('*')
            .limit(5);

        if (error) {
            console.error("❌ Error fetching from movie_posters:", error.message);
            console.error("Details:", error);
        } else {
            console.log("✅ Successfully fetched data!");
            console.log(`Found ${data.length} records.`);
            if (data.length > 0) {
                console.log("Sample record:", data[0]);
            } else {
                console.log("⚠️ Table exists but is empty.");
            }
        }
    } catch (err) {
        console.error("❌ Unexpected error:", err);
    }
}

testConnection();
