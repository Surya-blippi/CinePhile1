import { supabase } from './supabaseClient';
import { MoviePoster } from '../types';

export async function fetchPosters(category?: string): Promise<MoviePoster[] | null> {
  if (!supabase) {
    console.log("[DataService] No Supabase client. Skipping fetch.");
    return null;
  }

  try {
    let query = supabase
      .from('movie_posters')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .order('title');

    // Filter by category if provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[DataService] Error fetching posters:", error.message);
      return null;
    }

    const safeData = data || [];
    console.log(`[DataService] Fetched ${safeData.length} posters from Supabase.`);

    return safeData.map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      imageUrl: p.image_url,
      thumbnailUrl: p.thumbnail_url,
      prompts: p.prompts || 'Keeping facial similar, replace the face structure in the poster properly',
      description: p.description,
      isActive: p.is_active,
      sortOrder: p.sort_order,
      createdAt: p.created_at
    }));
  } catch (err) {
    console.error("[DataService] Unexpected error fetching posters:", err);
    return null;
  }
}

// Get unique categories for tabs
export async function fetchCategories(): Promise<string[] | null> {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('movie_posters')
      .select('category')
      .eq('is_active', true);

    if (error) {
      console.error("[DataService] Error fetching categories:", error.message);
      return null;
    }

    // Get unique categories
    const categories = [...new Set(data.map((p: any) => p.category))];
    console.log(`[DataService] Found ${categories.length} categories.`);

    return categories.sort();
  } catch (err) {
    console.error("[DataService] Unexpected error fetching categories:", err);
    return null;
  }
}