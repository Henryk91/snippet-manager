import { RawSection } from "../../types/types";

const section: RawSection = {
  id: "sql",
  label: "SQL",
  identifier: "sql",
  snippets: [
    // ===== Basics =====
    {
      title: "Select + filter + order",
      description: "Common SELECT with WHERE and ORDER BY:",
      markdown: `
-- Get active users created this year
SELECT id, email, created_at
FROM users
WHERE active = true
  AND created_at >= date_trunc('year', now())
ORDER BY created_at DESC
LIMIT 20;
`,
    },
    {
      title: "Aggregate and group",
      description: "GROUP BY with COUNT, SUM, AVG:",
      markdown: `
-- Orders per customer this month
SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS revenue
FROM orders
WHERE created_at >= date_trunc('month', now())
GROUP BY customer_id
HAVING COUNT(*) > 0
ORDER BY revenue DESC;
`,
    },
    {
      title: "LIKE and ILIKE search",
      description: "Case-insensitive matching with ILIKE (Postgres):",
      markdown: `
-- Find users by email domain
SELECT id, email
FROM users
WHERE email ILIKE '%@example.com';
`,
    },

    // ===== Joins =====
    {
      title: "INNER JOIN",
      description: "Get matching rows across tables:",
      markdown: `
SELECT o.id, o.total, u.email
FROM orders o
JOIN users u ON u.id = o.customer_id
WHERE o.status = 'paid';
`,
    },
    {
      title: "LEFT JOIN with COALESCE",
      description: "Keep left rows; default missing values:",
      markdown: `
SELECT u.id, u.email, COALESCE(SUM(o.total), 0) AS revenue
FROM users u
LEFT JOIN orders o ON o.customer_id = u.id AND o.status = 'paid'
GROUP BY u.id, u.email
ORDER BY revenue DESC;
`,
    },

    // ===== CTEs, subqueries, windows =====
    {
      title: "CTE (WITH) + reuse",
      description: "Build a temp set and query it again:",
      markdown: `
WITH recent AS (
  SELECT *
  FROM orders
  WHERE created_at >= now() - interval '7 days'
)
SELECT customer_id, COUNT(*) AS cnt, SUM(total) AS revenue
FROM recent
GROUP BY customer_id
ORDER BY revenue DESC;
`,
    },
    {
      title: "Window functions",
      description: "Ranking and running totals:",
      markdown: `
-- Rank orders by total per customer
SELECT
  customer_id,
  id AS order_id,
  total,
  RANK() OVER (PARTITION BY customer_id ORDER BY total DESC) AS rnk,
  SUM(total) OVER (PARTITION BY customer_id ORDER BY created_at
                   ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders;
`,
    },
    {
      title: "IN vs EXISTS",
      description: "Prefer EXISTS for correlated checks:",
      markdown: `
-- Customers with at least one paid order
SELECT u.*
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = u.id AND o.status = 'paid'
);
`,
    },

    // ===== Write ops =====
    {
      title: "INSERT with RETURNING",
      description: "Get inserted rows back immediately:",
      markdown: `
INSERT INTO users (email, active)
VALUES ('alice@example.com', true)
RETURNING id, email, created_at;
`,
    },
    {
      title: "UPSERT (ON CONFLICT)",
      description: "Insert or update when unique key collides:",
      markdown: `
-- Unique on users(email)
INSERT INTO users (email, active)
VALUES ('alice@example.com', true)
ON CONFLICT (email) DO UPDATE
SET active = EXCLUDED.active,
    updated_at = now()
RETURNING id, email, active;
`,
    },
    {
      title: "UPDATE specific rows",
      description: "Update with a WHERE filter:",
      markdown: `
UPDATE orders
SET status = 'refunded',
    refunded_at = now()
WHERE id = $1
RETURNING *;
`,
    },
    {
      title: "DELETE safely",
      description: "Delete with conditions and RETURNING:",
      markdown: `
DELETE FROM sessions
WHERE last_seen_at < now() - interval '30 days'
RETURNING id, user_id;
`,
    },

    // ===== Schema & indexes =====
    {
      title: "Create table with constraints",
      description: "Primary key, unique, default values:",
      markdown: `
CREATE TABLE users (
  id           bigserial PRIMARY KEY,
  email        text NOT NULL UNIQUE,
  active       boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);
`,
    },
    {
      title: "Foreign key and cascade",
      description: "Orders reference users; cascade on delete:",
      markdown: `
CREATE TABLE orders (
  id           bigserial PRIMARY KEY,
  customer_id  bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total        numeric(12,2) NOT NULL,
  status       text NOT NULL CHECK (status IN ('pending','paid','refunded')),
  created_at   timestamptz NOT NULL DEFAULT now()
);
`,
    },
    {
      title: "Indexes for performance",
      description: "B-tree, partial, and functional indexes:",
      markdown: `
-- Speed lookups by email
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Only paid orders
CREATE INDEX IF NOT EXISTS idx_orders_paid ON orders (customer_id)
WHERE status = 'paid';

-- Case-insensitive search by lower(email)
CREATE INDEX IF NOT EXISTS idx_users_lower_email ON users ((lower(email)));
`,
    },

    // ===== Dates, pagination, text =====
    {
      title: "Date helpers",
      description: "Truncate, intervals, and ranges:",
      markdown: `
-- Orders per day for last 7 days
SELECT date_trunc('day', created_at) AS day, COUNT(*)
FROM orders
WHERE created_at >= now() - interval '7 days'
GROUP BY day
ORDER BY day;
`,
    },
    {
      title: "Pagination (keyset)",
      description: "Faster than OFFSET for large tables:",
      markdown: `
-- After you got last_id from previous page:
SELECT id, email
FROM users
WHERE id > $1
ORDER BY id
LIMIT 50;
`,
    },
    {
      title: "Full text search (basic)",
      description: "Use tsvector + tsquery:",
      markdown: `
-- One-time: generated column + GIN index
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS search tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))) STORED;

CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN (search);

-- Query
SELECT id, title
FROM posts
WHERE search @@ plainto_tsquery('english', $1)
ORDER BY ts_rank(search, plainto_tsquery('english', $1)) DESC;
`,
    },

    // ===== JSON (Postgres) =====
    {
      title: "JSON read",
      description: "Extract fields from jsonb columns:",
      markdown: `
-- settings is jsonb
SELECT
  id,
  settings->>'theme'      AS theme,          -- text
  (settings->'flags') @> '["beta"]' AS has_beta  -- boolean
FROM users
WHERE (settings->>'lang') = 'de';
`,
    },
    {
      title: "JSON update",
      description: "Merge JSON with jsonb_set / concatenation:",
      markdown: `
-- Set theme to 'dark'
UPDATE users
SET settings = jsonb_set(settings, '{theme}', to_jsonb('dark'::text), true)
WHERE id = $1;

-- Merge a fragment
UPDATE users
SET settings = settings || '{"flags": ["beta","pro"]}'::jsonb
WHERE id = $1;
`,
    },

    // ===== Transactions & debugging =====
    {
      title: "Transactions",
      description: "Group statements atomically:",
      markdown: `
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- ROLLBACK;  -- in case of error
`,
    },
    {
      title: "Explain analyze",
      description: "Inspect query plan and timing:",
      markdown: `
EXPLAIN ANALYZE
SELECT u.id, COUNT(o.*)
FROM users u
LEFT JOIN orders o ON o.customer_id = u.id
GROUP BY u.id;
`,
    },
  ],
};

export default section;
