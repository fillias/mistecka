-- ============================================================
-- SEED: LOUPENICKA
-- ============================================================

INSERT INTO loupenicka (name, slug, sort_order)
VALUES
    ('Kolem chalupy', 'kolem-chalupy', 1),
    ('Za lesem', 'za-lesem', 2);

INSERT INTO place_loupenicka (loupenicka_id, name, type, description, gps_coords, image_url)
VALUES
    (
        (SELECT id FROM loupenicka WHERE slug = 'kolem-chalupy'),
        'Stará lavička',
        'odpočinek',
        'Klidné místo pod stromem s výhledem na cestu.',
        '50.100839532771374, 14.425594500839924',
        'https://placehold.co/1200x800?text=stara-lavicka'
    ),
    (
        (SELECT id FROM loupenicka WHERE slug = 'kolem-chalupy'),
        'Kamenná zídka',
        'orientacni-bod',
        'Nízká zídka na kraji pozemku.',
        '50.1011111N, 14.4262222E',
        'https://placehold.co/1200x800?text=kamenna-zidka'
    ),
    (
        (SELECT id FROM loupenicka WHERE slug = 'kolem-chalupy'),
        'Jabloň u plotu',
        'strom',
        'Starší jabloň poblíž plotu.',
        '50.0995000, 14.4249000',
        'https://placehold.co/1200x800?text=jablon-u-plotu'
    ),
    (
        (SELECT id FROM loupenicka WHERE slug = 'za-lesem'),
        'Vyhlídka na louce',
        'vyhlidka',
        'Otevřené místo s dobrým rozhledem.',
        '49.9876543N, 14.5678901E',
        'https://placehold.co/1200x800?text=vyhlidka-na-louce'
    ),
    (
        (SELECT id FROM loupenicka WHERE slug = 'za-lesem'),
        'Mostek přes potok',
        'mostek',
        'Dřevěný mostek přes úzký potok.',
        '49.9871000, 14.5682000',
        'https://placehold.co/1200x800?text=mostek-pres-potok'
    );


-- ============================================================
-- SEED: MISTECKA
-- ============================================================

INSERT INTO mistecka (name, slug, sort_order)
VALUES
    ('Parkování', 'parkovani', 1),
    ('Výlety', 'vylety', 2);

INSERT INTO country_mistecka (mistecka_id, name, slug, code)
VALUES
    ((SELECT id FROM mistecka WHERE slug = 'parkovani'), 'Česko', 'cesko', 'CZ'),
    ((SELECT id FROM mistecka WHERE slug = 'parkovani'), 'Německo', 'nemecko', 'DE'),
    ((SELECT id FROM mistecka WHERE slug = 'vylety'), 'Rakousko', 'rakousko', 'AT');

INSERT INTO area_mistecka (mistecka_id, country_mistecka_id, name, slug)
VALUES
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'cesko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        'Sever',
        'sever'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'cesko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        'Jih',
        'jih'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'nemecko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        'Sever',
        'sever'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'nemecko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        'Jih',
        'jih'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'vylety'),
        (SELECT id FROM country_mistecka WHERE slug = 'rakousko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'vylety')),
        'Alpy',
        'alpy'
    );

INSERT INTO place_mistecka (
    mistecka_id,
    country_mistecka_id,
    area_mistecka_id,
    name,
    type,
    description,
    gps_coords,
    image_url
)
VALUES
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'cesko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        (
            SELECT am.id
            FROM area_mistecka am
            JOIN country_mistecka cm ON cm.id = am.country_mistecka_id
            JOIN mistecka m ON m.id = am.mistecka_id
            WHERE m.slug = 'parkovani' AND cm.slug = 'cesko' AND am.slug = 'sever'
        ),
        'Parkoviště u lesa',
        'parkovani',
        'Menší parkovací plocha u kraje lesa.',
        '50.0755381, 14.4378005',
        'https://placehold.co/1200x800?text=parkoviste-u-lesa'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'cesko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        (
            SELECT am.id
            FROM area_mistecka am
            JOIN country_mistecka cm ON cm.id = am.country_mistecka_id
            JOIN mistecka m ON m.id = am.mistecka_id
            WHERE m.slug = 'parkovani' AND cm.slug = 'cesko' AND am.slug = 'jih'
        ),
        'Odstavná plocha jih',
        'parkovani',
        'Provizorní odstavná plocha pro několik aut.',
        '50.0610000N, 14.4300000E',
        'https://placehold.co/1200x800?text=odstavna-plocha-jih'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'nemecko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        (
            SELECT am.id
            FROM area_mistecka am
            JOIN country_mistecka cm ON cm.id = am.country_mistecka_id
            JOIN mistecka m ON m.id = am.mistecka_id
            WHERE m.slug = 'parkovani' AND cm.slug = 'nemecko' AND am.slug = 'sever'
        ),
        'Nord Parkplatz',
        'parkovani',
        'Zpevněné parkování poblíž turistické cesty.',
        '49.4521000, 12.3456000',
        'https://placehold.co/1200x800?text=nord-parkplatz'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'parkovani'),
        (SELECT id FROM country_mistecka WHERE slug = 'nemecko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'parkovani')),
        (
            SELECT am.id
            FROM area_mistecka am
            JOIN country_mistecka cm ON cm.id = am.country_mistecka_id
            JOIN mistecka m ON m.id = am.mistecka_id
            WHERE m.slug = 'parkovani' AND cm.slug = 'nemecko' AND am.slug = 'jih'
        ),
        'Süd Stellplatz',
        'parkovani',
        'Klidné místo pro krátké zastavení.',
        '49.4519000N, 12.3462000E',
        'https://placehold.co/1200x800?text=sud-stellplatz'
    ),
    (
        (SELECT id FROM mistecka WHERE slug = 'vylety'),
        (SELECT id FROM country_mistecka WHERE slug = 'rakousko' AND mistecka_id = (SELECT id FROM mistecka WHERE slug = 'vylety')),
        (
            SELECT am.id
            FROM area_mistecka am
            JOIN country_mistecka cm ON cm.id = am.country_mistecka_id
            JOIN mistecka m ON m.id = am.mistecka_id
            WHERE m.slug = 'vylety' AND cm.slug = 'rakousko' AND am.slug = 'alpy'
        ),
        'Horské jezero',
        'vylet',
        'Malebné místo vhodné na krátkou zastávku a focení.',
        '47.5162314, 13.7035257',
        'https://placehold.co/1200x800?text=horske-jezero'
    );