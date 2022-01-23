-- public.cards definition
-- Drop table
-- DROP TABLE public.cards;
CREATE TABLE public.cards (
  id int4 NOT NULL,
  "name" varchar(50) NOT NULL,
  color varchar(50) NOT NULL,
  "type" varchar(50) NOT NULL,
  CONSTRAINT cards_pkey PRIMARY KEY (id)
);
-- public.battles definition
-- Drop table
-- DROP TABLE public.battles;
CREATE TABLE public.battles (
  id serial4 NOT NULL,
  mana int4 NOT NULL,
  red bool NOT NULL,
  blue bool NOT NULL,
  green bool NOT NULL,
  white bool NOT NULL,
  black bool NOT NULL,
  gold bool NOT NULL,
  "rule" varchar(50) NULL,
  elo int4 NOT NULL,
  winner varchar(50) NOT NULL,
  loser varchar(50) NOT NULL,
  battle_queue_id varchar(200) NOT NULL,
  league_id int4 NULL,
  CONSTRAINT battles_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX battle_battle_queue_id_idx ON public.battles USING btree (battle_queue_id);
-- public.battle_cards definition
-- Drop table
-- DROP TABLE public.battle_cards;
CREATE TABLE public.battle_cards (
  id serial4 NOT NULL,
  card_detail_id int4 NOT NULL,
  "position" int4 NULL,
  is_winner bool NOT NULL,
  battle_id int4 NOT NULL,
  is_summoner bool NOT NULL,
  CONSTRAINT battle_cards_pkey PRIMARY KEY (id)
);
-- public.battle_cards foreign keys
ALTER TABLE
  public.battle_cards
ADD
  CONSTRAINT battle_cards_fk FOREIGN KEY (battle_id) REFERENCES public.battles(id);
ALTER TABLE
  public.battle_cards
ADD
  CONSTRAINT battle_cards_fk1 FOREIGN KEY (card_detail_id) REFERENCES public.cards(id);