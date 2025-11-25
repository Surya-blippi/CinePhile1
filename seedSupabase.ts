import { createClient } from '@supabase/supabase-js';
import { STATIC_POSTERS } from './constants';

const supabaseUrl = "https://tfaumdiiljwnjmfnonrc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmYXVtZGlpbGp3bmptZm5vbnJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzcwMzksImV4cCI6MjA3OTU1MzAzOX0.VbxwPIzu8kBb2MzrtT5gm17DdR5V5R_oLBn8wYwevCo";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
    console.log("🌱 Seeding database...");

    // 1. Clear existing data (optional, but good for idempotency)
    const { error: deleteError } = await supabase
        .from('movie_posters')
        .delete()
        .neq('id', 'placeholder'); // Delete all

    if (deleteError) {
        console.error("❌ Error clearing table:", deleteError.message);
    } else {
        console.log("🧹 Cleared existing data.");
    }

    // 2. Transform STATIC_POSTERS to match DB schema (snake_case)
    const dbRows = STATIC_POSTERS.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        image_url: p.imageUrl,
        thumbnail_url: p.imageUrl, // Use same image for thumb for now
        prompts: p.prompts,
        description: p.description,
        is_active: p.isActive,
        sort_order: p.sortOrder
    }));

    // 3. Insert new data
    const { data, error } = await supabase
        .from('movie_posters')
        .insert(dbRows)
        .select();

    if (error) {
        console.error("❌ Error inserting data:", error.message);
        console.error("Details:", error);
    } else {
        console.log(`✅ Successfully inserted ${data.length} posters!`);
    }
}

seedDatabase();
