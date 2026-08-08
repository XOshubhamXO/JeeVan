-- JeeVan Ventures & Partners Seed (idempotent — safe to re-run)
-- Run in Supabase SQL Editor

-- Clear existing to avoid duplicates
DELETE FROM ventures;

-- Ventures
INSERT INTO ventures (slug, venture_name, category, description, contact_details, managed_by) VALUES
('nursery','JeeVan Plant Nursery','nursery','On-demand sapling preparation, indigenous seed conservation, and rare variety supply from our Nalanda farm. We grow moringa, amla, neem, guava, mango, lemon, and seasonal vegetable seedlings using natural farming methods.','{"phone":"","location":"Vill-Mahamadpur, Nalanda, Bihar","hours":"Mon-Sat, 8AM-6PM"}','91532c20-863c-4380-9ddd-6e52816370d1'),
('gardening','Gardening Services','services','Urban rooftop garden installation, living lawn setup, natural composting systems, tool rentals, and garden maintenance. We design edible landscapes that feed your family.','{"phone":"","location":"Patna & Nalanda, Bihar","hours":"By appointment"}','91532c20-863c-4380-9ddd-6e52816370d1'),
('tech','Tech Consulting (B.Tech CSE)','consulting','Custom software development, web & mobile applications, PC build architecture, hardware setup guidance, and startup infrastructure advisory. Led by Shubham Saurabh (B.Tech CSE).','{"phone":"","location":"Remote / Nalanda, Bihar","hours":"Flexible"}','91532c20-863c-4380-9ddd-6e52816370d1'),
('studio','Creative Media Studio','studio','Professional content creation, photography studio rentals, video production, event planning, and digital marketing for farms, food brands, and sustainable businesses.','{"phone":"","location":"Nalanda, Bihar","hours":"By appointment"}','91532c20-863c-4380-9ddd-6e52816370d1');

-- Partners (stored as ventures for display)
INSERT INTO ventures (slug, venture_name, category, description) VALUES
('mfpcl','Madhopur Farmers Producer Company Ltd','partner','FPO network partnering with IFFCO, YARA, and Katyayani for farmer inputs and market linkage.'),
('falcon','Falcon Garden Tools','partner','Quality garden tools and equipment supplier.'),
('ecoviha','Ecoviha Industries','partner','Sustainable products and eco-friendly solutions.'),
('humsafar','Humsafar RO Water','partner','Water purification systems for farms and households.'),
('madras-dosa','Madras Dosa House','partner','Food partner — farm-to-table South Indian cuisine.'),
('sahg','SahG Greens','partner','Organic greens and microgreens producer.'),
('aviraj','Aviraj Aviral Digital Studio','partner','Digital media and design partner.'),
('kumar','Kumar Enterprises','partner','Local enterprise partner for farm supplies.'),
('prakash','Prakash Enterprises','partner','Agricultural equipment and machinery.');

SELECT 'Ventures seeded: ' || count(*) || ' entries' FROM ventures;
