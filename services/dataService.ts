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

export async function getUserCredits(userId: string): Promise<number> {
  if (!supabase) return 0;

  try {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If error is "PGRST116" (no rows), it means user doesn't exist yet, so return 0
      if (error.code === 'PGRST116') return 0;
      console.error("[DataService] Error fetching credits:", error.message);
      return 0;
    }

    return data?.credits || 0;
  } catch (err) {
    console.error("[DataService] Unexpected error fetching credits:", err);
    return 0;
  }
}

export async function updateUserCredits(userId: string, credits: number): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('user_credits')
      .upsert({
        user_id: userId,
        credits: credits,
        last_updated: new Date().toISOString()
      });

    if (error) {
      console.error("[DataService] Error updating credits:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[DataService] Unexpected error updating credits:", err);
    return false;
  }
}

export interface HistoryItem {
  id: string;
  image_url: string;
  poster_id: string;
  created_at: string;
}

export async function fetchUserHistory(userId: string): Promise<HistoryItem[]> {
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('user_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("[DataService] Error fetching history:", error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("[DataService] Unexpected error fetching history:", err);
    return [];
  }
}

export async function saveUserHistory(userId: string, imageUrl: string, posterId: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('user_history')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        poster_id: posterId
      });

    if (error) {
      console.error("[DataService] Error saving history:", error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[DataService] Unexpected error saving history:", err);
    return false;
  }
}