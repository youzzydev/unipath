-- Seed Script: Top 50 UK Universities with Coordinates
-- Run this in Supabase SQL Editor after running the table setup SQL
-- Note: Run the table setup SQL first to create the universities table with lat/lng columns

-- Add latitude and longitude columns if they don't exist
ALTER TABLE universities ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 7);
ALTER TABLE universities ADD COLUMN IF NOT EXISTS longitude DECIMAL(10, 7);

-- Insert Universities with coordinates
INSERT INTO universities (id, name, slug, ranking_uk, ranking_global, location, city, description, website, is_russell_group, latitude, longitude) VALUES
-- Russell Group (24 universities)
('a1b2c3d4-0001-0001-0001-000000000001', 'University of Oxford', 'university-of-oxford', 1, 4, 'England', 'Oxford', 'Oldest English-speaking university, world-renowned for excellence in humanities and sciences.', 'https://www.ox.ac.uk', true, 51.7548, -1.2544),
('a1b2c3d4-0002-0001-0001-000000000002', 'University of Cambridge', 'university-of-cambridge', 2, 6, 'England', 'Cambridge', 'World-leading university with exceptional research and teaching across sciences and humanities.', 'https://www.cam.ac.uk', true, 52.2053, 0.1218),
('a1b2c3d4-0003-0001-0001-000000000003', 'Imperial College London', 'imperial-college-london', 3, 8, 'England', 'London', 'Specialist in science, technology, medicine and business, located in South Kensington.', 'https://www.imperial.ac.uk', true, 51.4988, -0.1749),
('a1b2c3d4-0004-0001-0001-000000000004', 'University College London', 'university-college-london', 4, 9, 'England', 'London', 'Diverse Russell Group university with exceptional academic reputation across all disciplines.', 'https://www.ucl.ac.uk', true, 51.5226, -0.1349),
('a1b2c3d4-0005-0001-0001-000000000005', 'University of Edinburgh', 'university-of-edinburgh', 5, 15, 'Scotland', 'Edinburgh', 'Historic Scottish university known for research excellence and vibrant city life.', 'https://www.ed.ac.uk', true, 55.9420, -3.1894),
('a1b2c3d4-0006-0001-0001-000000000006', 'University of Manchester', 'university-of-manchester', 6, 27, 'England', 'Manchester', 'Large research-intensive university with strong science and engineering programs.', 'https://www.manchester.ac.uk', true, 53.4668, -2.2341),
('a1b2c3d4-0007-0001-0001-000000000007', 'King''s College London', 'kings-college-london', 7, 33, 'England', 'London', 'Prestigious university with excellent medicine, law and humanities programs.', 'https://www.kcl.ac.uk', true, 51.5116, -0.1161),
('a1b2c3d4-0008-0001-0001-000000000008', 'University of Bristol', 'university-of-bristol', 8, 49, 'England', 'Bristol', 'Research-intensive university with strong undergraduate and postgraduate programs.', 'https://www.bristol.ac.uk', true, 51.4592, -2.6266),
('a1b2c3d4-0009-0001-0001-000000000009', 'University of Warwick', 'university-of-warwick', 9, 67, 'England', 'Coventry', 'Young, dynamic university known for research excellence and industry links.', 'https://warwick.ac.uk', true, 52.3792, -1.5620),
('a1b2c3d4-0010-0001-0001-000000000010', 'University of Glasgow', 'university-of-glasgow', 10, 78, 'Scotland', 'Glasgow', 'Historic Scottish university with strong research across all disciplines.', 'https://www.gla.ac.uk', true, 55.8721, -4.2882),
('a1b2c3d4-0011-0001-0001-000000000011', 'University of Birmingham', 'university-of-birmingham', 11, 84, 'England', 'Birmingham', 'Research-led university with global reputation for excellence.', 'https://www.birmingham.ac.uk', true, 52.4523, -1.9303),
('a1b2c3d4-0012-0001-0001-000000000012', 'University of Sheffield', 'university-of-sheffield', 12, 96, 'England', 'Sheffield', 'Russell Group university with strong engineering and science programs.', 'https://www.sheffield.ac.uk', true, 53.3811, -1.4874),
('a1b2c3d4-0013-0001-0001-000000000013', 'University of Liverpool', 'university-of-liverpool', 13, 107, 'England', 'Liverpool', 'Research-intensive university with excellent medical and engineering schools.', 'https://www.liverpool.ac.uk', true, 53.4068, -2.9666),
('a1b2c3d4-0014-0001-0001-000000000014', 'University of Leeds', 'university-of-leeds', 14, 112, 'England', 'Leeds', 'Large research university known for business, engineering and arts.', 'https://www.leeds.ac.uk', true, 53.8067, -1.5245),
('a1b2c3d4-0015-0001-0001-000000000015', 'University of Nottingham', 'university-of-nottingham', 15, 118, 'England', 'Nottingham', 'Global university with research excellence and beautiful campuses.', 'https://www.nottingham.ac.uk', true, 52.9386, -1.1976),
('a1b2c3d4-0016-0001-0001-000000000016', 'University of Southampton', 'university-of-southampton', 16, 124, 'England', 'Southampton', 'Research-intensive with strong engineering and maritime programs.', 'https://www.southampton.ac.uk', true, 50.9345, -1.3961),
('a1b2c3d4-0017-0001-0001-000000000017', 'University of Exeter', 'university-of-exeter', 17, 137, 'England', 'Exeter', 'Research-led university with excellent student experience.', 'https://www.exeter.ac.uk', true, 50.7365, -3.5341),
('a1b2c3d4-0018-0001-0001-000000000018', 'Queen Mary University of London', 'queen-mary-university-of-london', 18, 145, 'England', 'London', 'Research-intensive with strong medicine and engineering programs.', 'https://www.qmul.ac.uk', true, 51.5205, -0.0403),
('a1b2c3d4-0019-0001-0001-000000000019', 'University of Durham', 'university-of-durham', 19, 149, 'England', 'Durham', 'Historic collegiate university with exceptional academic reputation.', 'https://www.durham.ac.uk', true, 54.7756, -1.5356),
('a1b2c3d4-0020-0001-0001-000000000020', 'University of York', 'university-of-york', 20, 154, 'England', 'York', 'Research-intensive with excellent humanities and sciences.', 'https://www.york.ac.uk', true, 53.9466, -1.0522),
('a1b2c3d4-0021-0001-0001-000000000021', 'University of Aberdeen', 'university-of-aberdeen', 21, 176, 'Scotland', 'Aberdeen', 'Historic university with strong oil, energy and medical research.', 'https://www.abdn.ac.uk', true, 57.1654, -2.1020),
('a1b2c3d4-0022-0001-0001-000000000022', 'University of St Andrews', 'university-of-st-andrews', 22, 185, 'Scotland', 'St Andrews', 'Scotland''s oldest university, known for exceptional academics.', 'https://www.st-andrews.ac.uk', true, 56.3418, -2.7969),
('a1b2c3d4-0023-0001-0001-000000000023', 'Cardiff University', 'cardiff-university', 23, 191, 'Wales', 'Cardiff', 'Leading Welsh university with strong research and medical school.', 'https://www.cardiff.ac.uk', true, 51.4876, -3.1793),
('a1b2c3d4-0024-0001-0001-000000000024', 'University of Belfast (Queen''s)', 'queens-university-belfast', 24, 198, 'Northern Ireland', 'Belfast', 'Historic Irish university with global research reputation.', 'https://www.qub.ac.uk', true, 54.5846, -5.9360),

-- Other Popular Universities (26)
('a1b2c3d4-0025-0001-0001-000000000025', 'University of Bath', 'university-of-bath', 25, 206, 'England', 'Bath', 'Excellent student experience with strong business and engineering programs.', 'https://www.bath.ac.uk', false, 51.3783, -2.3567),
('a1b2c3d4-0026-0001-0001-000000000026', 'University of Lancaster', 'university-of-lancaster', 26, 212, 'England', 'Lancaster', 'Research-led with collegiate system and strong management programs.', 'https://www.lancaster.ac.uk', false, 54.0492, -2.7807),
('a1b2c3d4-0027-0001-0001-000000000027', 'University of East Anglia', 'university-of-east-anglia', 27, 222, 'England', 'Norwich', 'Research-intensive with excellent creative writing and climate research.', 'https://www.uea.ac.uk', false, 52.6244, 1.2996),
('a1b2c3d4-0028-0001-0001-000000000028', 'University of Leicester', 'university-of-leicester', 28, 239, 'England', 'Leicester', 'Research-led with strong physics, astronomy and archaeology.', 'https://le.ac.uk', false, 52.6199, -1.1428),
('a1b2c3d4-0029-0001-0001-000000000029', 'University of Sheffield (Hallam)', 'sheffield-hallam-university', 29, 252, 'England', 'Sheffield', 'Modern university with strong industry links and employability.', 'https://www.shu.ac.uk', false, 53.3790, -1.4653),
('a1b2c3d4-0030-0001-0001-000000000030', 'University of Brighton', 'university-of-brighton', 30, 271, 'England', 'Brighton', 'Vibrant seaside university with diverse programs.', 'https://www.brighton.ac.uk', false, 50.8411, -0.1337),
('a1b2c3d4-0031-0001-0001-000000000031', 'University of Sussex', 'university-of-sussex', 31, 280, 'England', 'Brighton', 'Research-intensive with strong social sciences and humanities.', 'https://www.sussex.ac.uk', false, 50.8667, -0.0833),
('a1b2c3d4-0032-0001-0001-000000000032', 'University of Strathclyde', 'university-of-strathclyde', 32, 291, 'Scotland', 'Glasgow', 'Technical university with strong engineering and business programs.', 'https://www.strath.ac.uk', false, 55.8623, -4.2505),
('a1b2c3d4-0033-0001-0001-000000000033', 'University of Surrey', 'university-of-surrey', 33, 305, 'England', 'Guildford', 'Research-led with excellent student satisfaction and employability.', 'https://www.surrey.ac.uk', false, 51.2428, -0.5876),
('a1b2c3d4-0034-0001-0001-0001-000000000034', 'University of Portsmouth', 'university-of-portsmouth', 34, 311, 'England', 'Portsmouth', 'Modern research university with strong industry connections.', 'https://www.port.ac.uk', false, 50.7989, -1.0950),
('a1b2c3d4-0035-0001-0001-0001-000000000035', 'University of Reading', 'university-of-reading', 35, 319, 'England', 'Reading', 'Research-intensive with heritage in agriculture and business.', 'https://www.reading.ac.uk', false, 51.4417, -0.9712),
('a1b2c3d4-0036-0001-0001-0001-000000000036', 'Loughborough University', 'loughborough-university', 36, 326, 'England', 'Loughborough', 'Excellence in engineering, sports and business programs.', 'https://www.lboro.ac.uk', false, 52.7655, -1.2259),
('a1b2c3d4-0037-0001-0001-0001-000000000037', 'University of Lincoln', 'university-of-lincoln', 37, 336, 'England', 'Lincoln', 'Modern campus university with industry-focused programs.', 'https://www.lincoln.ac.uk', false, 53.2286, -0.5486),
('a1b2c3d4-0038-0001-0001-0001-000000000038', 'University of Kent', 'university-of-kent', 38, 345, 'England', 'Canterbury', 'Research-led with European connections and beautiful campuses.', 'https://www.kent.ac.uk', false, 51.2978, 1.0684),
('a1b2c3d4-0039-0001-0001-0001-000000000039', 'University of Dundee', 'university-of-dundee', 39, 354, 'Scotland', 'Dundee', 'Excellence in medical research and life sciences.', 'https://www.dundee.ac.uk', false, 56.4587, -2.9706),
('a1b2c3d4-0040-0001-0001-0001-000000000040', 'University of Stirling', 'university-of-stirling', 40, 361, 'Scotland', 'Stirling', 'Beautiful campus with strong sports and media programs.', 'https://www.stir.ac.uk', false, 56.1465, -3.9364),
('a1b2c3d4-0041-0001-0001-0001-000000000041', 'University of Bristol (Technical)', 'university-of-the-west-of-england', 41, 370, 'England', 'Bristol', 'Practical programs with strong industry links.', 'https://www.uwe.ac.uk', false, 51.4996, -2.5626),
('a1b2c3d4-0042-0001-0001-0001-000000000042', 'University of Coventry', 'coventry-university', 42, 380, 'England', 'Coventry', 'Modern university with excellent employability record.', 'https://www.coventry.ac.uk', false, 52.4068, -1.5197),
('a1b2c3d4-0043-0001-0001-0001-000000000043', 'University of Huddersfield', 'university-of-huddersfield', 43, 391, 'England', 'Huddersfield', 'Research-led with excellent teaching quality.', 'https://www.hud.ac.uk', false, 53.6447, -1.7789),
('a1b2c3d4-0044-0001-0001-0001-000000000044', 'University of Salford', 'university-of-salford', 44, 402, 'England', 'Manchester', 'Industry-focused with strong media and engineering.', 'https://www.salford.ac.uk', false, 53.4832, -2.2566),
('a1b2c3d4-0045-0001-0001-0001-000000000045', 'University of Wolverhampton', 'university-of-wolverhampton', 45, 415, 'England', 'Wolverhampton', 'Accessible higher education with diverse programs.', 'https://www.wlv.ac.uk', false, 52.5885, -2.1295),
('a1b2c3d4-0046-0001-0001-0001-000000000046', 'University of Westminster', 'university-of-westminster', 46, 425, 'England', 'London', 'Central London university with career-focused programs.', 'https://www.westminster.ac.uk', false, 51.5179, -0.1748),
('a1b2c3d4-0047-0001-0001-0001-000000000047', 'Kingston University', 'kingston-university', 47, 438, 'England', 'London', 'Large diverse university with strong creative programs.', 'https://www.kingston.ac.uk', false, 51.4083, -0.3063),
('a1b2c3d4-0048-0001-0001-0001-000000000048', 'University of Essex', 'university-of-essex', 48, 445, 'England', 'Colchester', 'Research-led with strong social sciences and humanities.', 'https://www.essex.ac.uk', false, 51.8905, 0.9532),
('a1b2c3d4-0049-0001-0001-0001-000000000049', 'University of Plymouth', 'university-of-plymouth', 49, 456, 'England', 'Plymouth', 'Marine and environmental research with coastal campus.', 'https://www.plymouth.ac.uk', false, 50.4177, -4.1706),
('a1b2c3d4-0050-0001-0001-0001-000000000050', 'Newcastle University', 'newcastle-university', 50, 468, 'England', 'Newcastle', 'Research-intensive with excellent medicine and engineering.', 'https://www.ncl.ac.uk', false, 54.9783, -1.6173)
ON CONFLICT (slug) DO NOTHING;

-- Verify insertion
SELECT COUNT(*) as total_universities FROM universities;
