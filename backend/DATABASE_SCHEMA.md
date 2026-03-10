# AgriOne — Database schema snapshot

Generated at: **2026-03-10T16:33:41.257Z**

- Database: agrione
- Schema: public
- Tables: 9 (+ SequelizeMeta)

## Migrations (executed)

The following migration files are recorded in `SequelizeMeta`:

- 000-extensions.js
- 001-init-auth.js
- 002-create-lands.js
- 003-create-sensors.js
- 004-create-readings.js
- 005-create-alert-rules.js
- 006-create-alerts.js
- 007-create-transactions.js
- 008-create-password-reset-tokens.js
- 009-add-user-global-location.js
- 010-add-sensor-calibration.js
- 011-add-user-username.js

## Tables

### alert_rules

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | owner_id | uuid | NO |  |  |
| 3 | land_id | uuid | NO |  |  |
| 4 | enabled | boolean | NO | true |  |
| 5 | temp_min | double precision | YES |  |  |
| 6 | temp_max | double precision | YES |  |  |
| 7 | hum_min | double precision | YES |  |  |
| 8 | hum_max | double precision | YES |  |  |
| 9 | created_at | timestamp with time zone | NO | now() |  |
| 10 | updated_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| alert_rules_land_id_fkey | FK | FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE |
| alert_rules_owner_id_fkey | FK | FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE |
| alert_rules_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| alert_rules_land_id | CREATE INDEX alert_rules_land_id ON public.alert_rules USING btree (land_id) |
| alert_rules_owner_id | CREATE INDEX alert_rules_owner_id ON public.alert_rules USING btree (owner_id) |
| alert_rules_owner_id_land_id | CREATE INDEX alert_rules_owner_id_land_id ON public.alert_rules USING btree (owner_id, land_id) |
| alert_rules_pkey | CREATE UNIQUE INDEX alert_rules_pkey ON public.alert_rules USING btree (id) |

### alerts

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | owner_id | uuid | NO |  |  |
| 3 | land_id | uuid | NO |  |  |
| 4 | sensor_id | uuid | YES |  |  |
| 5 | severity | character varying(20) | NO |  |  |
| 6 | type | character varying(30) | NO |  |  |
| 7 | message | text | NO |  |  |
| 8 | value | double precision | YES |  |  |
| 9 | threshold | double precision | YES |  |  |
| 10 | created_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| alerts_land_id_fkey | FK | FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE CASCADE |
| alerts_owner_id_fkey | FK | FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE |
| alerts_sensor_id_fkey | FK | FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE SET NULL |
| alerts_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| alerts_created_at | CREATE INDEX alerts_created_at ON public.alerts USING btree (created_at) |
| alerts_land_id | CREATE INDEX alerts_land_id ON public.alerts USING btree (land_id) |
| alerts_owner_id | CREATE INDEX alerts_owner_id ON public.alerts USING btree (owner_id) |
| alerts_pkey | CREATE UNIQUE INDEX alerts_pkey ON public.alerts USING btree (id) |

### lands

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | owner_id | uuid | NO |  |  |
| 3 | name | character varying(255) | NO |  |  |
| 4 | crop_type | character varying(100) | NO |  |  |
| 5 | area_ha | numeric(10,2) | NO |  |  |
| 6 | geometry | jsonb | NO |  |  |
| 7 | centroid_lat | double precision | NO |  |  |
| 8 | centroid_lng | double precision | NO |  |  |
| 9 | created_at | timestamp with time zone | NO | now() |  |
| 10 | updated_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| lands_owner_id_fkey | FK | FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE |
| lands_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| lands_owner_id | CREATE INDEX lands_owner_id ON public.lands USING btree (owner_id) |
| lands_pkey | CREATE UNIQUE INDEX lands_pkey ON public.lands USING btree (id) |

### password_reset_tokens

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | user_id | uuid | NO |  |  |
| 3 | token_hash | character varying(64) | NO |  |  |
| 4 | expires_at | timestamp with time zone | NO |  |  |
| 5 | used_at | timestamp with time zone | YES |  |  |
| 6 | created_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| password_reset_tokens_user_id_fkey | FK | FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE |
| password_reset_tokens_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| password_reset_tokens_expires_at | CREATE INDEX password_reset_tokens_expires_at ON public.password_reset_tokens USING btree (expires_at) |
| password_reset_tokens_pkey | CREATE UNIQUE INDEX password_reset_tokens_pkey ON public.password_reset_tokens USING btree (id) |
| password_reset_tokens_token_hash | CREATE UNIQUE INDEX password_reset_tokens_token_hash ON public.password_reset_tokens USING btree (token_hash) |
| password_reset_tokens_user_id | CREATE INDEX password_reset_tokens_user_id ON public.password_reset_tokens USING btree (user_id) |

### readings

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | sensor_id | uuid | NO |  |  |
| 3 | temperature_c | double precision | NO |  |  |
| 4 | humidity_pct | double precision | NO |  |  |
| 5 | recorded_at | timestamp with time zone | NO |  |  |
| 6 | created_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| readings_sensor_id_fkey | FK | FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE |
| readings_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| readings_pkey | CREATE UNIQUE INDEX readings_pkey ON public.readings USING btree (id) |
| readings_recorded_at | CREATE INDEX readings_recorded_at ON public.readings USING btree (recorded_at) |
| readings_sensor_id | CREATE INDEX readings_sensor_id ON public.readings USING btree (sensor_id) |
| readings_sensor_id_recorded_at | CREATE INDEX readings_sensor_id_recorded_at ON public.readings USING btree (sensor_id, recorded_at) |

### refresh_tokens

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | user_id | uuid | NO |  |  |
| 3 | token_hash | character varying(255) | NO |  |  |
| 4 | revoked_at | timestamp with time zone | YES |  |  |
| 5 | expires_at | timestamp with time zone | NO |  |  |
| 6 | created_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| refresh_tokens_user_id_fkey | FK | FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE |
| refresh_tokens_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| refresh_tokens_expires_at | CREATE INDEX refresh_tokens_expires_at ON public.refresh_tokens USING btree (expires_at) |
| refresh_tokens_pkey | CREATE UNIQUE INDEX refresh_tokens_pkey ON public.refresh_tokens USING btree (id) |
| refresh_tokens_user_id | CREATE INDEX refresh_tokens_user_id ON public.refresh_tokens USING btree (user_id) |

### sensors

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | owner_id | uuid | NO |  |  |
| 3 | land_id | uuid | YES |  |  |
| 4 | sensor_code | character varying(80) | NO |  |  |
| 5 | name | character varying(255) | YES |  |  |
| 6 | last_reading_at | timestamp with time zone | YES |  |  |
| 7 | created_at | timestamp with time zone | NO | now() |  |
| 8 | updated_at | timestamp with time zone | NO | now() |  |
| 9 | calibration_temp_offset_c | double precision | NO | 0 |  |
| 10 | calibration_humidity_offset_pct | double precision | NO | 0 |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| sensors_land_id_fkey | FK | FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE SET NULL |
| sensors_owner_id_fkey | FK | FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE |
| sensors_pkey | PK | PRIMARY KEY (id) |
| sensors_sensor_code_key | UNIQUE | UNIQUE (sensor_code) |

**Indexes**

| Name | Definition |
|---|---|
| sensors_land_id | CREATE INDEX sensors_land_id ON public.sensors USING btree (land_id) |
| sensors_owner_id | CREATE INDEX sensors_owner_id ON public.sensors USING btree (owner_id) |
| sensors_pkey | CREATE UNIQUE INDEX sensors_pkey ON public.sensors USING btree (id) |
| sensors_sensor_code | CREATE UNIQUE INDEX sensors_sensor_code ON public.sensors USING btree (sensor_code) |
| sensors_sensor_code_key | CREATE UNIQUE INDEX sensors_sensor_code_key ON public.sensors USING btree (sensor_code) |

### transactions

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | owner_id | uuid | NO |  |  |
| 3 | land_id | uuid | YES |  |  |
| 4 | type | character varying(10) | NO |  |  |
| 5 | category | character varying(60) | NO |  |  |
| 6 | description | character varying(255) | YES |  |  |
| 7 | amount | numeric(12,2) | NO |  |  |
| 8 | occurred_at | timestamp with time zone | NO |  |  |
| 9 | created_at | timestamp with time zone | NO | now() |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| transactions_land_id_fkey | FK | FOREIGN KEY (land_id) REFERENCES lands(id) ON DELETE SET NULL |
| transactions_owner_id_fkey | FK | FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE |
| transactions_pkey | PK | PRIMARY KEY (id) |

**Indexes**

| Name | Definition |
|---|---|
| transactions_land_id | CREATE INDEX transactions_land_id ON public.transactions USING btree (land_id) |
| transactions_occurred_at | CREATE INDEX transactions_occurred_at ON public.transactions USING btree (occurred_at) |
| transactions_owner_id | CREATE INDEX transactions_owner_id ON public.transactions USING btree (owner_id) |
| transactions_pkey | CREATE UNIQUE INDEX transactions_pkey ON public.transactions USING btree (id) |

### users

**Columns**

| # | Column | Type | Null | Default | Comment |
|---:|---|---|---|---|---|
| 1 | id | uuid | NO | gen_random_uuid() |  |
| 2 | email | character varying(255) | NO |  |  |
| 3 | password_hash | character varying(255) | NO |  |  |
| 4 | role | character varying(20) | NO | 'USER'::character varying |  |
| 5 | created_at | timestamp with time zone | NO | now() |  |
| 6 | updated_at | timestamp with time zone | NO | now() |  |
| 7 | global_location_name | character varying(255) | YES |  |  |
| 8 | global_location_lat | double precision | YES |  |  |
| 9 | global_location_lng | double precision | YES |  |  |
| 10 | username | character varying(50) | NO |  |  |

**Constraints**

| Name | Type | Definition |
|---|---|---|
| users_pkey | PK | PRIMARY KEY (id) |
| users_email_key | UNIQUE | UNIQUE (email) |

**Indexes**

| Name | Definition |
|---|---|
| users_email_key | CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email) |
| users_global_location_lat | CREATE INDEX users_global_location_lat ON public.users USING btree (global_location_lat) |
| users_global_location_lng | CREATE INDEX users_global_location_lng ON public.users USING btree (global_location_lng) |
| users_pkey | CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id) |
| users_username_lower_unique | CREATE UNIQUE INDEX users_username_lower_unique ON public.users USING btree (lower((username)::text)) |

