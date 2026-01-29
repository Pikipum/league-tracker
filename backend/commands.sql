CREATE DATABASE league;

\c league

CREATE TABLE matches (
  match_id text PRIMARY KEY,
  payload jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX matches_created_at_idx ON matches(created_at);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO users (email, username, password_hash)
VALUES ('test@example.com', 'user', crypt('password', gen_salt('bf')));

CREATE INDEX matches_metadata_participants_gin_idx
ON matches USING gin ((payload->'metadata'->'participants'));

CREATE INDEX matches_participants_gin_idx
ON matches USING gin ((payload->'info'->'participants') jsonb_path_ops);

CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  puuid text NOT NULL,
  game_name text NOT NULL,
  tag_line text NOT NULL,
  region text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, puuid)
);