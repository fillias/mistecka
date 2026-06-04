-- ============================================================
-- DUMMY DATA
-- ============================================================

-- LOUPENICKA
INSERT INTO loupenicka (id, name, slug, sort_order)
VALUES
    (1, 'Loupeníčko', 'loupenicko', 0),
    (2, 'Ovocné toulky', 'ovocne-toulky', 1);

INSERT INTO place_loupenicka (
    id,
    loupenicka_id,
    name,
    type,
    description,
    gps_coords,
    large_image_url,
    small_image_url
)
VALUES
    (
        1,
        1,
        'Bota',
        'jablíčka',
        'Stará jabloň u polní cesty, dobrý přístup i autem.',
        '49.123456, 16.543210',
        'https://placehold.co/1600x900/1e293b/ffffff.webp?text=Bota+Large',
        'https://placehold.co/400x225/334155/ffffff.webp?text=Bota+Small'
    ),
    (
        2,
        1,
        'U remízku',
        'švestky',
        'Stromy na kraji pole, nejlepší sběr koncem léta.',
        '49.135000, 16.520000',
        'https://placehold.co/1600x900/4b5563/ffffff.webp?text=U+remizku+Large',
        'https://placehold.co/400x225/6b7280/ffffff.webp?text=U+remizku+Small'
    ),
    (
        3,
        2,
        'Lesní okraj',
        'houby',
        'Smrkový les s častým výskytem hřibů po dešti.',
        '48.987654, 16.412345',
        'https://placehold.co/1600x900/14532d/ffffff.webp?text=Lesni+okraj+Large',
        'https://placehold.co/400x225/166534/ffffff.webp?text=Lesni+okraj+Small'
    );

-- MISTECKA
INSERT INTO mistecka (id, name, slug, sort_order)
VALUES
    (1, 'Místečka', 'mistecka', 0);

INSERT INTO country_mistecka (
    id,
    mistecka_id,
    name,
    slug,
    code
)
VALUES
    (1, 1, 'Česko', 'cesko', 'CZ'),
    (2, 1, 'Rakousko', 'rakousko', 'AT'),
    (3, 1, 'Itálie', 'italie', 'IT');

INSERT INTO area_mistecka (
    id,
    mistecka_id,
    country_mistecka_id,
    name,
    slug
)
VALUES
    (1, 1, 1, 'Jižní Morava', 'jizni-morava'),
    (2, 1, 1, 'Krkonoše', 'krkonose'),
    (3, 1, 2, 'Dolní Rakousko', 'dolni-rakousko'),
    (4, 1, 3, 'Lago di Garda', 'lago-di-garda');

INSERT INTO place_mistecka (
    id,
    mistecka_id,
    country_mistecka_id,
    area_mistecka_id,
    name,
    type,
    description,
    gps_coords,
    large_image_url,
    small_image_url
)
VALUES
    (
        1,
        1,
        1,
        1,
        'Nové Mlýny',
        'kite spot',
        'Rovná voda a dobrý vítr, oblíbené místo na jihu Moravy.',
        '48.874200, 16.693400',
        'https://placehold.co/1600x900/0f766e/ffffff.webp?text=Nove+Mlyny+Large',
        'https://placehold.co/400x225/0d9488/ffffff.webp?text=Nove+Mlyny+Small'
    ),
    (
        2,
        1,
        1,
        2,
        'Labská bouda',
        'hory',
        'Výchozí bod pro túry, krásné výhledy a drsnější počasí.',
        '50.770800, 15.549000',
        'https://placehold.co/1600x900/1d4ed8/ffffff.webp?text=Labska+bouda+Large',
        'https://placehold.co/400x225/2563eb/ffffff.webp?text=Labska+bouda+Small'
    ),
    (
        3,
        1,
        2,
        3,
        'Payerbach',
        'bike spot',
        'Hezké traily a výlety v kopcovité krajině.',
        '47.695000, 15.863000',
        'https://placehold.co/1600x900/7c3aed/ffffff.webp?text=Payerbach+Large',
        'https://placehold.co/400x225/8b5cf6/ffffff.webp?text=Payerbach+Small'
    ),
    (
        4,
        1,
        3,
        4,
        'Torbole',
        'wind spot',
        'Legendární místo u Gardy se silným větrem a krásným jezerem.',
        '45.869200, 10.876000',
        'https://placehold.co/1600x900/ea580c/ffffff.webp?text=Torbole+Large',
        'https://placehold.co/400x225/f97316/ffffff.webp?text=Torbole+Small'
    );

-- Posun identity sekvencí za ručně vložená ID
SELECT setval('loupenicka_id_seq', (SELECT MAX(id) FROM loupenicka));
SELECT setval('place_loupenicka_id_seq', (SELECT MAX(id) FROM place_loupenicka));
SELECT setval('mistecka_id_seq', (SELECT MAX(id) FROM mistecka));
SELECT setval('country_mistecka_id_seq', (SELECT MAX(id) FROM country_mistecka));
SELECT setval('area_mistecka_id_seq', (SELECT MAX(id) FROM area_mistecka));
SELECT setval('place_mistecka_id_seq', (SELECT MAX(id) FROM place_mistecka));