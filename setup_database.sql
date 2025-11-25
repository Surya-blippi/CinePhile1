-- 1. Enable RLS (if not already)
ALTER TABLE movie_posters ENABLE ROW LEVEL SECURITY;

-- 2. Create Policies to allow access
-- Allow public read access (Required for the app to fetch posters)
CREATE POLICY "Allow public read access" ON movie_posters 
  FOR SELECT USING (true);

-- Allow public insert access (Required for seeding data via script, or you can run the inserts below)
CREATE POLICY "Allow public insert access" ON movie_posters 
  FOR INSERT WITH CHECK (true);

-- 3. Seed Data (Run this to populate the table)
INSERT INTO movie_posters (id, title, category, image_url, thumbnail_url, prompts, description, is_active, sort_order) VALUES
('cyberpunk', 'Neon Runner', 'Hollywood', 'https://picsum.photos/id/1025/400/600', 'https://picsum.photos/id/1025/400/600', 'Cyberpunk style, neon lights, rainy futuristic city, intense action hero look.', 'Cyberpunk style, neon lights, rainy futuristic city, intense action hero look.', true, 1),
('space_odyssey', 'Star Void', 'Hollywood', 'https://picsum.photos/id/1033/400/600', 'https://picsum.photos/id/1033/400/600', 'Space opera, astronaut suit (helmet off), cosmic background, epic scale.', 'Space opera, astronaut suit (helmet off), cosmic background, epic scale.', true, 2),
('western', 'Dusty Trails', 'Hollywood', 'https://picsum.photos/id/1003/400/600', 'https://picsum.photos/id/1003/400/600', 'Classic western, cowboy hat, sunset desert, rugged texture.', 'Classic western, cowboy hat, sunset desert, rugged texture.', true, 3),
('romance_rain', 'Monsoon Love', 'Bollywood', 'https://picsum.photos/id/1011/400/600', 'https://picsum.photos/id/1011/400/600', 'Romantic bollywood movie poster, rain background, emotional expression, vibrant sari or suit colors.', 'Romantic bollywood movie poster, rain background, emotional expression, vibrant sari or suit colors.', true, 4),
('action_cop', 'Mumbai Cop', 'Bollywood', 'https://picsum.photos/id/1070/400/600', 'https://picsum.photos/id/1070/400/600', 'High energy bollywood action, sunglasses, explosion in background, flying cars.', 'High energy bollywood action, sunglasses, explosion in background, flying cars.', true, 5),
('royal_wedding', 'Royal Wedding', 'Bollywood', 'https://picsum.photos/id/1059/400/600', 'https://picsum.photos/id/1059/400/600', 'Grand indian wedding setting, sherwani or lehenga, festive lighting, flower garlands.', 'Grand indian wedding setting, sherwani or lehenga, festive lighting, flower garlands.', true, 6),
('paris_tower', 'Parisian Dream', 'World Travel', 'https://picsum.photos/id/1018/400/600', 'https://picsum.photos/id/1018/400/600', 'Standing in front of the Eiffel Tower, golden hour, stylish tourist outfit.', 'Standing in front of the Eiffel Tower, golden hour, stylish tourist outfit.', true, 7),
('mountain_peak', 'Summit', 'World Travel', 'https://picsum.photos/id/1036/400/600', 'https://picsum.photos/id/1036/400/600', 'Snowy mountain peak background, winter gear, adventurous pose.', 'Snowy mountain peak background, winter gear, adventurous pose.', true, 8),
('tropical_beach', 'Island Escape', 'World Travel', 'https://picsum.photos/id/1048/400/600', 'https://picsum.photos/id/1048/400/600', 'Tropical beach, palm trees, turquoise water, relaxing summer vibes.', 'Tropical beach, palm trees, turquoise water, relaxing summer vibes.', true, 9),
('shiva_meditate', 'Cosmic Meditation', 'Mythology & Gods', 'https://picsum.photos/id/1043/400/600', 'https://picsum.photos/id/1043/400/600', 'Himalayan background, spiritual aura, third eye symbolism, peaceful meditation pose.', 'Himalayan background, spiritual aura, third eye symbolism, peaceful meditation pose.', true, 10),
('krishna_flute', 'Divine Melody', 'Mythology & Gods', 'https://picsum.photos/id/1006/400/600', 'https://picsum.photos/id/1006/400/600', 'Forest setting, peacock feather motifs, playing a flute, soft divine glow.', 'Forest setting, peacock feather motifs, playing a flute, soft divine glow.', true, 11),
('linkedin_pro', 'Executive', 'Social & Professional', 'https://picsum.photos/id/1005/400/600', 'https://picsum.photos/id/1005/400/600', 'Professional studio headshot, blurred office background, suit and tie, confident smile.', 'Professional studio headshot, blurred office background, suit and tie, confident smile.', true, 12),
('artistic_sketch', 'Pencil Sketch', 'Social & Professional', 'https://picsum.photos/id/1023/400/600', 'https://picsum.photos/id/1023/400/600', 'Charcoal pencil sketch style, artistic, textured paper background.', 'Charcoal pencil sketch style, artistic, textured paper background.', true, 13);
