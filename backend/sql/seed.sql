-- ============================================
-- NextRoute Seed Data
-- Run AFTER schema.sql
-- ============================================

USE nextroute_db;

-- ========== REVIEWS (30+ for random selection) ==========
-- Note: user_id 1 = admin (created by app on startup)
-- We insert placeholder users for reviews

INSERT INTO users (name, email, password_hash, role) VALUES
('Ayush Sharma', 'ayush@example.com', '$2a$10$placeholder', 'USER'),
('Riya Patel', 'riya@example.com', '$2a$10$placeholder', 'USER'),
('Kunal Verma', 'kunal@example.com', '$2a$10$placeholder', 'USER'),
('Sneha Patel', 'sneha@example.com', '$2a$10$placeholder', 'USER'),
('Rohit Singh', 'rohit@example.com', '$2a$10$placeholder', 'USER'),
('Priya Nair', 'priya@example.com', '$2a$10$placeholder', 'USER'),
('Arjun Das', 'arjun@example.com', '$2a$10$placeholder', 'USER'),
('Meera Iyer', 'meera@example.com', '$2a$10$placeholder', 'USER'),
('Vikram Reddy', 'vikram@example.com', '$2a$10$placeholder', 'USER'),
('Ananya Gupta', 'ananya@example.com', '$2a$10$placeholder', 'USER');

INSERT INTO reviews (user_id, rating, text) VALUES
(1, 5, 'Booking my flights and hotels became so easy! The app shows the best prices and updates are super fast. Loved the smooth experience.'),
(2, 4, 'The interface is very simple and clean. I planned my entire Goa trip within minutes. Highly recommended for all travelers!'),
(3, 5, 'This app always gives the cheapest deals compared to others. I saved almost ₹2,500 on my last trip to Manali. Worth using!'),
(4, 5, 'I had an issue with my ticket timing but the support team solved it instantly. Very reliable app for family travels.'),
(5, 4, 'The app loads quickly, payments are secure, and tracking bookings is effortless. Perfect for frequent travelers like me!'),
(6, 5, 'Best travel platform I have used. The package options are diverse and prices are transparent. No hidden charges!'),
(7, 4, 'Love the Must Visit section! Found amazing places I never knew about. The image galleries are beautiful.'),
(8, 5, 'Booked a Kerala houseboat trip through this app. Everything was arranged perfectly. Will use again for sure!'),
(9, 4, 'The special offers section saved me ₹15,000 on my Bali trip. Great deals that are actually legit.'),
(10, 5, 'Customer support is top notch. They helped me reschedule my entire trip within hours. Incredibly responsive team.'),
(1, 5, 'Used NextRoute for my honeymoon planning. Found the perfect Maldives package. Wife loved it!'),
(2, 4, 'Great for comparing packages across destinations. The filter options could be better but overall solid app.'),
(3, 5, 'Recommended this to all my college friends. We planned our Goa trip together using the group booking feature.'),
(4, 4, 'The UI is modern and intuitive. Even my parents could use it easily to book their Varanasi trip.'),
(5, 5, 'Transparent pricing with no surprises at checkout. Exactly what the travel industry needed.'),
(6, 5, 'The adventure packages are unreal! Did river rafting in Rishikesh through NextRoute. Life-changing experience.'),
(7, 4, 'Wish there were more international destinations. But for India travel, this is the best platform hands down.'),
(8, 5, 'Booked 3 trips this year through NextRoute. Each one was perfectly organized. My go-to travel app now.'),
(9, 4, 'The review system helps a lot in choosing the right package. Real user feedback makes a big difference.'),
(10, 5, 'Lightning fast booking process. From search to confirmation in under 2 minutes. Impressive!'),
(1, 4, 'The Manali snow trek package was perfectly curated. Guide, camping gear, everything was top quality.'),
(2, 5, 'Love that I can see my booking history and upcoming trips in one place. Very organized app.'),
(3, 5, 'NextRoute made my first solo trip stress-free. The detailed itineraries gave me so much confidence.'),
(4, 4, 'The live chat feature is super helpful when you need quick answers about your booking.'),
(5, 5, 'Best travel deals during the off-season. I got a 5-star hotel in Shimla for the price of a 3-star!'),
(6, 4, 'The mobile experience is great too. Booked my entire trip from my phone during my lunch break.'),
(7, 5, 'NextRoute understands what Indian travelers want. Affordable luxury is their specialty.'),
(8, 4, 'The destination guides are very detailed and practical. Helped me pack perfectly for my Ladakh trip.'),
(9, 5, 'Cancelled a booking due to emergency. Got my full refund within 3 days. No questions asked.'),
(10, 5, 'The team behind NextRoute clearly loves travel. You can see the passion in every feature of the app.');

-- ========== MUST VISIT DESTINATIONS ==========
INSERT INTO destinations (name, location, description, full_details, price, type, image_urls) VALUES
('Goa Beach', 'Goa, India', 'Party capital.', 
 'Experience the vibrant nightlife, serene beaches, and delicious seafood.',
 '₹15,000', 'MUST_VISIT',
 '["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80","https://plus.unsplash.com/premium_photo-1697730390320-8412ee5eae82?w=600&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1587922546307-776227941871?w=600&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1642313281504-77925e214635?w=600&auto=format&fit=crop&q=60"]'),

('Taj Mahal', 'Agra, India', 'Symbol of love.',
 'Witness the breathtaking beauty of the Taj Mahal at sunrise.',
 '₹5,000', 'MUST_VISIT',
 '["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80","https://images.unsplash.com/photo-1519955266818-0231b63402bc?w=600&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1576555697589-9fd80369de7a?q=80&w=880&auto=format&fit=crop","https://images.unsplash.com/photo-1715167886555-01552c3369c7?w=600&auto=format&fit=crop&q=60"]'),

('Manali', 'Himachal', 'Snow mountains.',
 'Paragliding, skiing, and trekking await you in the lap of Himalayas.',
 '₹12,000', 'MUST_VISIT',
 '["https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=600&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1516406742981-2b7d67ec4ae8?w=600&auto=format&fit=crop&q=60","https://images.unsplash.com/photo-1626621331169-5f34be280ed9?q=80&w=735&auto=format&fit=crop","https://images.unsplash.com/photo-1571677465484-2dd540924245?q=80&w=1062&auto=format&fit=crop"]'),

('Kerala', 'South India', 'God''s own country.',
 'Relax in the houseboats of Alleppey and enjoy nature.',
 '₹20,000', 'MUST_VISIT',
 '["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80","https://plus.unsplash.com/premium_photo-1697729442042-c071ef0415b0?q=80&w=1170&auto=format&fit=crop","https://plus.unsplash.com/premium_photo-1691086683613-b5b218113329?q=80&w=1171&auto=format&fit=crop","https://plus.unsplash.com/premium_photo-1661964426242-4e0b87e16bcd?q=80&w=1074&auto=format&fit=crop"]');

-- ========== SPECIAL OFFERS ==========
INSERT INTO destinations (name, location, description, full_details, price, type, image_urls, nights, old_price, new_price, offer_details) VALUES
('Bali, Indonesia', 'Indonesia', 'Tropical paradise', 'Experience the magic of Bali with pristine beaches and ancient temples.',
 '₹39,999', 'SPECIAL_OFFER',
 '["https://images.unsplash.com/photo-1507525428034-b723cf961d3e"]',
 5, 54999, 39999, '5 Nights • Hotel • Breakfast • City Tour'),

('Paris, France', 'France', 'City of love', 'Explore the romantic streets of Paris and iconic landmarks.',
 '₹69,999', 'SPECIAL_OFFER',
 '["https://images.unsplash.com/photo-1502602898657-3e91760cbb34"]',
 4, 89999, 69999, '4 Nights • Eiffel Entry • Cruise Dinner'),

('Singapore', 'Singapore', 'Garden city', 'Discover the perfect blend of nature, culture, and modern architecture.',
 '₹49,999', 'SPECIAL_OFFER',
 '["https://images.unsplash.com/photo-1503899036084-c55cdd92da26"]',
 3, 64999, 49999, '3 Nights • Universal Studios • City Pass');

-- ========== TRAVEL PACKAGES (per destination) ==========

-- Goa packages
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('Goa', 'Beach Bum Budget', 12000, 3, 'blue', FALSE, '["3 Nights Beach Shack Stay","North Goa Sightseeing","Breakfast Included","Airport Pickup"]'),
('Goa', 'Goa Luxury Retreat', 35000, 5, 'gold', TRUE, '["5 Nights 5⭐ Resort","All Meals + Drinks","Private Beach Access","Sunset Cruise","Spa & Wellness"]'),
('Goa', 'Goa Adventure Pack', 20000, 4, 'orange', FALSE, '["4 Nights Stay","Scuba Diving","Jet Skiing & Parasailing","Dudhsagar Falls Trip","Bonfire Night"]');

-- Manali packages
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('Manali', 'Manali Budget Explorer', 10000, 3, 'blue', FALSE, '["3 Nights Hotel Stay","Mall Road Tour","Hadimba Temple Visit","Breakfast Included"]'),
('Manali', 'Manali Premium Escape', 28000, 5, 'gold', TRUE, '["5 Nights Luxury Cottage","Solang Valley Adventure","Rohtang Pass Permit","All Meals","Private Cab"]'),
('Manali', 'Manali Trek & Camp', 18000, 4, 'orange', FALSE, '["4 Nights Camping","Beas Kund Trek","River Crossing","Bonfire & BBQ","Photography Session"]');

-- Kerala packages
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('Kerala', 'Kerala Backwater Budget', 15000, 3, 'blue', FALSE, '["3 Nights Homestay","Alleppey Houseboat (1 Night)","Kathakali Show","Breakfast Included"]'),
('Kerala', 'Kerala Royal Experience', 45000, 6, 'gold', TRUE, '["6 Nights 5⭐ Resort","Private Houseboat","Ayurvedic Spa","Munnar Tea Garden","All Meals","Wildlife Safari"]'),
('Kerala', 'Kerala Nature Explorer', 25000, 4, 'orange', FALSE, '["4 Nights Stay","Periyar Wildlife Sanctuary","Spice Plantation Tour","Bamboo Rafting","Local Cuisine Experience"]');

-- Agra / Taj Mahal packages
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('Taj Mahal', 'Agra Day Trip', 3000, 1, 'blue', FALSE, '["1 Night Hotel","Taj Mahal Sunrise Visit","Agra Fort Tour","Lunch Included"]'),
('Taj Mahal', 'Golden Triangle Luxury', 40000, 5, 'gold', TRUE, '["5 Nights (Delhi+Agra+Jaipur)","All Monument Entries","5⭐ Hotels","Private Guide","All Meals"]'),
('Taj Mahal', 'Heritage Walk Package', 8000, 2, 'orange', FALSE, '["2 Nights Stay","Taj Mahal + Agra Fort","Fatehpur Sikri","Walking Heritage Tour","Street Food Trail"]');

-- Shimla packages
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('Shimla', 'Shimla Budget Stay', 8000, 3, 'blue', FALSE, '["3 Nights Hotel","Mall Road Walk","Jakhoo Temple Visit","Breakfast Included"]'),
('Shimla', 'Shimla Premium Holiday', 22000, 5, 'gold', TRUE, '["5 Nights Boutique Hotel","Kufri Snow Point","Toy Train Ride","All Meals","Chail Palace Visit"]'),
('Shimla', 'Shimla Adventure Trail', 15000, 4, 'orange', FALSE, '["4 Nights Camp+Hotel","Trekking to Hatu Peak","Ice Skating","Nature Walks","Bonfire Nights"]');

-- Rishikesh packages
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('Rishikesh', 'Rishikesh Spiritual Stay', 7000, 2, 'blue', FALSE, '["2 Nights Ashram Stay","Ganga Aarti","Yoga Sessions","Vegetarian Meals"]'),
('Rishikesh', 'Rishikesh Ultimate Adventure', 20000, 4, 'gold', TRUE, '["4 Nights Riverside Camp","White Water Rafting","Bungee Jumping","Cliff Jumping","All Meals","Bonfire"]'),
('Rishikesh', 'Rishikesh Explorer', 12000, 3, 'orange', FALSE, '["3 Nights Stay","Rafting (16 km)","Camping by Ganges","Beatles Ashram Visit","Waterfall Trek"]');

-- Generic fallback packages (for any unmatched destination)
INSERT INTO packages (destination_name, name, price, nights, color, is_popular, features) VALUES
('_default', 'Budget Explorer', 15000, 3, 'blue', FALSE, '["3 Nights Stay","Sightseeing Tour","Breakfast Included","Airport Transfer"]'),
('_default', 'Luxury Escape', 35000, 5, 'gold', TRUE, '["5 Nights in 5⭐ Hotel","All Meals Included","Private Guide","Luxury Cruise Dinner","Spa Session"]'),
('_default', 'Adventure Pack', 25000, 4, 'orange', FALSE, '["4 Nights Camping","Trekking & Hiking","River Rafting","Bonfire Night","GoPro Recording"]');
