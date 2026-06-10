# Místečka

Privátní webová aplikace pro ukládání a správu oblíbených míst ve třech kategoriích: **Místečka** (cestovatelská místa), **Loupeníčko** (místa ke sběru ovoce a lesních plodů) a **Parkování**.

---

## Funkce

- Přidávání, editace a mazání míst s GPS souřadnicemi, popisem a fotografií
- Automatický resize nahraných fotek přes AWS Lambda
- Správa hierarchie: sekce → země → oblast → místo
- Role-based přístup (admin / editor)
- Tmavý a světlý režim

---

## Tech Stack

| Vrstva             | Technologie                                            |
| ------------------ | ------------------------------------------------------ |
| Frontend & Backend | Next.js 16 (App Router, Server Components, Typescript) |
| Databáze           | Supabase (PostgreSQL + RLS)                            |
| Autentizace        | Supabase Auth                                          |
| Úložiště           | AWS S3 (upload bucket + resized bucket)                |
| Image processing   | AWS Lambda (automatický resize po uploadu)             |
| Styling            | Tailwind CSS                                           |
| DB Backup          | GitHub Actions + Artifacts                             |
| Deployment         | Netlify                                                |

---

## Lokální vývoj

### Požadavky

- Node.js 24+
- pnpm (nebo npm/yarn)
- Supabase CLI
- AWS účet s nakonfigurovanými buckety a Lambda funkcí

### Instalace

```bash
git clone <repo-url>
cd mistecka
pnpm install
```

### Konfigurace prostředí

Zkopíruj `.env.example` do `.env.local` a vyplň hodnoty:

```bash
cp .env.example .env.local
```

### Proměnné prostředí

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# AWS
MISTECKA_AWS_REGION=eu-central-1
MISTECKA_AWS_ACCESS_KEY_ID=<access-key-id>
MISTECKA_AWS_SECRET_ACCESS_KEY=<secret-access-key>

# S3 Buckety
MISTECKA_AWS_S3_BUCKET_UPLOAD=<upload bucket>
MISTECKA_AWS_S3_BUCKET_RESIZED=<resized bucket>
```

> **Poznámka:** `SUPABASE_SERVICE_ROLE_KEY`, `MISTECKA_AWS_ACCESS_KEY_ID`, `MISTECKA_AWS_SECRET_ACCESS_KE` je tajný klíč — nikdy ho nevkládej do klientského kódu ani verzovacího systému.

### Spuštění dev

```bash
netlify dev
```

### lokal build pro test

```bash
npm run build
```

jinak se to buildi v netlify automaticky po push do github

Aplikace běží na [http://localhost:3000](http://localhost:3000).

## Databázové zálohy

Zálohy databáze jsou automatizovány přes **GitHub Actions**. Záloha se spouští podle nastaveného cron schedule, výstupní SQL dump je uložen jako GitHub Actions Artifact a dostupný ke stažení přímo z repozitáře.

---

## AWS infrastruktura

### S3 buckety

- **Upload bucket** — přijímá originální fotografie nahrané z aplikace
- **Resized bucket** — obsahuje zpracované verze (`small` a `large` ve formátu WebP)

### Lambda funkce

Po nahrání souboru do upload bucketu se automaticky spustí Lambda funkce, která:

1. Přečte originální obrázek
2. Vytvoří dvě varianty: `small` (náhled) a `large` (plná verze)
3. Uloží obě varianty do resized bucketu ve struktuře odpovídající hierarchii místa

### IAM oprávnění

IAM user používaný aplikací potřebuje tato oprávnění:

```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:GetObject", "s3:HeadObject", "s3:DeleteObject"],
  "Resource": ["arn:aws:s3:::<upload-bucket>/*", "arn:aws:s3:::<resized-bucket>/*"]
}
```

---

## Struktura projektu

```
app/
  api/                  # Route handlers (PATCH, DELETE, POST pro místa)
  (routes)/             # Page komponenty
components/             # UI komponenty (modaly, karty, detaily)
lib/
  supabase/             # Supabase klienti (server, admin)
  s3.ts                 # AWS S3 klient
  utils.ts              # Pomocné funkce
types/
  supabase.ts           # Generované typy z Supabase
```
