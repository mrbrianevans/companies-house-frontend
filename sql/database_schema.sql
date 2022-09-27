-- Unknown how to generate base type type

create type saved_filter_category as enum ('ACCOUNTANT', 'COMPANY', 'OFFICER');

create table accounts_scanned
(
    filename             text,
    time_started         timestamp default CURRENT_TIMESTAMP,
    company_number       char(8) not null,
    accounts_date        date    not null,
    status               text,
    time_finished        timestamp,
    zip_file_date        date,
    csv_scanned          timestamp,
    number_of_facts      integer,
    number_of_long_facts integer,
    errors               text,
    constraint accounts_scanned_pkey
        primary key (company_number, accounts_date)
);

grant select on accounts_scanned to black;

create table companies
(
    name          varchar(160),
    number        char(8) not null,
    streetaddress varchar(300),
    county        varchar(50),
    country       varchar(50),
    postcode      varchar(20),
    category      varchar(100),
    origin        varchar(50),
    status        varchar(70),
    date          timestamp,
    updated       date default CURRENT_DATE,
    can_file      boolean,
    not_found     boolean,
    constraint companies_pkey
        primary key (number)
);

create table legacy_accountants
(
    name              text not null,
    company_number    char(8),
    software          text[],
    number_of_clients integer,
    constraint accountants_pkey
        primary key (name),
    constraint accountants_company_number_fkey
        foreign key (company_number) references companies
);

grant select on legacy_accountants to frontend;

grant select on legacy_accountants to black;

create table company_accounts
(
    company_number char(8) not null,
    name           text    not null,
    label          text,
    context_ref    text    not null,
    value          text,
    start_date     date,
    end_date       date    not null,
    unit           text,
    decimals       integer,
    captured       timestamp default CURRENT_TIMESTAMP,
    constraint accounts_pkey
        primary key (company_number, name, end_date, context_ref),
    constraint accounts_company_number_fkey
        foreign key (company_number) references companies
);

create index accounts_company_number_index
    on company_accounts (company_number);

create index accounts_label_idx
    on company_accounts (label);

create index accounts_value_idx
    on company_accounts (value);

create index accounts_company_number_end_date_idx
    on company_accounts (company_number, end_date);

alter table company_accounts
    add constraint short_label_and_value
        check ((length(label) + length(value)) < 2000);

grant select on company_accounts to frontend;

grant select on company_accounts to black;

create index indexed_name
    on companies (name);

create index companies_upper_idx
    on companies (upper(name::text));

create index companies_upper_idx1
    on companies (upper(name::text));

create index trgm_idx_companies_name
    on companies using gin (name gin_trgm_ops);

create index trgm_idx_companies_upper_name
    on companies using gin (upper(name::text) gin_trgm_ops);

create index companies_number_idx
    on companies ((number::text));

create index companies_postcode_idx
    on companies (postcode);

create index companies_date_idx
    on companies (date);

grant select on companies to local;

grant select on companies to frontend;

grant select on companies to stream;

grant select on companies to black;

create table company_events
(
    id             text    not null,
    company_number char(8),
    fields_changed jsonb,
    published      timestamp,
    captured       timestamp default CURRENT_TIMESTAMP,
    event          jsonb,
    new            boolean,
    timepoint      integer not null,
    constraint company_events_pkey
        primary key (timepoint)
);

create index company_events_captured_idx
    on company_events (captured);

create index company_events_company_number_idx
    on company_events (company_number);

create index company_events_date_trunc_idx
    on company_events (date_trunc('minute'::text, captured));

create index company_events_date_trunc_idx1
    on company_events (date_trunc('day'::text, captured));

create index company_events_date_trunc_idx2
    on company_events (date_trunc('hour'::text, captured));

create index company_events_date_trunc_idx3
    on company_events (date_trunc('hour'::text, published));

create index company_events_date_trunc_idx4
    on company_events (date_trunc('day'::text, published));

create index company_events_date_trunc_idx5
    on company_events (date_trunc('minute'::text, published));

create index company_events_published_idx
    on company_events (published);

alter table company_events
    add constraint sensible_date
        check (published > '1700-01-01 00:00:00'::timestamp without time zone);

comment on constraint sensible_date on company_events is 'Check that the published date was not before the year 1700';

grant select on company_events to frontend;

grant insert, select on company_events to stream;

grant select on company_events to black;

create table detailed_postcodes
(
    postcode                      text not null,
    in_use                        text,
    lat                           double precision,
    long                          double precision,
    grid_ref                      char(8),
    county                        text,
    district                      text,
    ward                          text,
    district_code                 text,
    ward_code                     text,
    country                       text,
    county_code                   text,
    constituency                  text,
    introduced                    date,
    terminated                    date,
    parish                        text,
    national_park                 text,
    population                    integer,
    households                    integer,
    built_up_area                 text,
    built_up_sub_division         text,
    lower_layer_super_output_area text,
    rural_urban                   text,
    region                        text,
    "Altitude"                    integer,
    local_authority               text,
    msoa_code                     text,
    msoa                          text,
    parish_code                   text,
    census_output_area            text,
    constituency_code             text,
    lat_updated                   date,
    nearest_station               text,
    postcode_prefix               text,
    postcode_district             text,
    plus_code                     text,
    average_income                numeric,
    constraint detailed_postcodes_pk
        primary key (postcode)
);

create index detailed_postcodes_county_idx
    on detailed_postcodes (county);

create index detailed_postcodes_county_idx1
    on detailed_postcodes using hash (county);

grant select on detailed_postcodes to frontend;

grant select on detailed_postcodes to stream;

grant select on detailed_postcodes to black;

create table filing_history_descriptions
(
    key   text not null,
    value text,
    constraint filing_history_descriptions_pkey
        primary key (key)
);

create table filing_events_legacy
(
    id               text    not null,
    category         text,
    description_code text,
    description      text,
    filing_date      date,
    timepoint        integer not null,
    published        timestamp,
    captured         timestamp default CURRENT_TIMESTAMP,
    barcode          text,
    type             text,
    company_number   char(8),
    constraint filing_events_pkey
        primary key (timepoint),
    constraint filing_events_description_code_fkey
        foreign key (description_code) references filing_history_descriptions
);

create index filing_events_captured_idx
    on filing_events_legacy (captured);

create index filing_events_company_number_idx
    on filing_events_legacy (company_number);

create index filing_events_date_trunc_idx
    on filing_events_legacy (date_trunc('minute'::text, captured));

create index filing_events_date_trunc_idx1
    on filing_events_legacy (date_trunc('hour'::text, captured));

create index filing_events_date_trunc_idx2
    on filing_events_legacy (date_trunc('day'::text, captured));

create index filing_events_date_trunc_idx3
    on filing_events_legacy (date_trunc('hour'::text, published));

create index filing_events_date_trunc_idx4
    on filing_events_legacy (date_trunc('day'::text, published));

create index filing_events_date_trunc_idx5
    on filing_events_legacy (date_trunc('minute'::text, published));

create index filing_events_published_idx
    on filing_events_legacy (published);

create index filing_events_description_code_idx
    on filing_events_legacy (description_code);

create index filing_events_filing_date_idx
    on filing_events_legacy (filing_date);

grant select on filing_events_legacy to black;

grant select on filing_history_descriptions to frontend;

grant select on filing_history_descriptions to stream;

grant select on filing_history_descriptions to black;

create table postcode_summary
(
    postcode_prefix          text not null,
    area                     text not null,
    population               integer,
    households               integer,
    postcodes                integer,
    active_postcodes         integer,
    non_geographic_postcodes integer,
    lat                      numeric,
    long                     numeric,
    constraint postcode_summary_pk
        primary key (postcode_prefix)
);

comment on column postcode_summary.postcodes is 'total number of possible postcodes in this region';

comment on column postcode_summary.active_postcodes is 'the number of postcodes currently in use';

comment on column postcode_summary.lat is 'latitude position';

comment on column postcode_summary.long is 'longitudenal position
';

create unique index postcode_summary_area_uindex
    on postcode_summary (area);

grant select on postcode_summary to frontend;

grant select on postcode_summary to black;

create table psc
(
    company_number       char(8)  not null,
    address_line_1       varchar(100),
    address_line_2       varchar(100),
    address_country      varchar(50),
    address_locality     varchar(70),
    address_po_box       varchar(15),
    address_post_code    varchar(15),
    address_premises     varchar(15),
    address_region       varchar(50),
    ceased_on            timestamp,
    country_of_residence varchar(50),
    dob_day              smallint,
    dob_month            smallint,
    dob_year             smallint,
    etag                 char(40),
    person_id            char(27) not null,
    name_title           varchar(6),
    first_name           varchar(50),
    surname              varchar(100),
    nationality          varchar(50),
    notified_on          timestamp,
    updated              timestamp,
    nature_of_control    text[],
    constraint psc_pkey
        primary key (company_number, person_id),
    constraint psc_company_number_fkey
        foreign key (company_number) references companies
);

grant select on psc to black;

create table psc_enumerations
(
    code        text not null,
    description text,
    constraint psc_enumerations_pkey
        primary key (code)
);

grant select on psc_enumerations to black;

create table sic_map
(
    code        varchar(5) not null,
    description varchar(1000),
    constraint sic_map_pkey
        primary key (code)
);

create table sic
(
    company_number char(8)    not null,
    sic_code       varchar(5) not null,
    constraint sic_pkey
        primary key (company_number, sic_code),
    constraint sic_company_number_fkey
        foreign key (company_number) references companies,
    constraint sic_sic_code_fkey
        foreign key (sic_code) references sic_map
);

create index sic_company_number_idx
    on sic (company_number);

create index sic_sic_code_idx
    on sic (sic_code);

grant select on sic to frontend;

grant select on sic to black;

grant select on sic_map to frontend;

grant select on sic_map to black;

create table very_long_accounts
(
    company_number char(8) not null,
    name           text    not null,
    label          text,
    context_ref    text    not null,
    value          text,
    start_date     date,
    end_date       date    not null,
    unit           text,
    decimals       integer,
    captured       timestamp default CURRENT_TIMESTAMP,
    constraint very_long_accounts_pkey
        primary key (company_number, name, end_date, context_ref),
    constraint accounts_company_number_fkey
        foreign key (company_number) references companies
);

grant select on very_long_accounts to black;

create table charge_events
(
    id                         text not null,
    charge_code                text,
    created_on                 date,
    delivered_on               date,
    company_number             char(8),
    timepoint                  integer,
    published                  timestamp,
    status                     text,
    satisfied_on               date,
    classification_description text,
    classification_type        text,
    particulars_description    text,
    particulars_type           integer,
    persons_entitled           text[],
    transactions               jsonb[],
    constraint charge_events_pk
        primary key (id),
    constraint charge_events_companies_number_fk
        foreign key (company_number) references companies
);

grant select on charge_events to frontend;

grant insert, select on charge_events to stream;

create table filing_events
(
    id                 text not null,
    category           text,
    description_code   text,
    description        text,
    description_values jsonb,
    filing_date        date,
    timepoint          integer,
    published          timestamp,
    captured           timestamp default CURRENT_TIMESTAMP,
    barcode            text,
    type               text,
    company_number     char(8),
    constraint filing_events_new_pkey
        primary key (id),
    constraint filing_events_description_code_fkey
        foreign key (description_code) references filing_history_descriptions
);

create index filing_events_description_code_idx1
    on filing_events using hash (description_code);

create index filing_events_filing_date_idx1
    on filing_events (filing_date);

create index filing_events_company_number_index
    on filing_events (company_number);

create index filing_events_timepoint_idx
    on filing_events (timepoint);

create index filing_events_expr_idx
    on filing_events ((description_values ->> 'officer_name'::text));

alter table filing_events
    add constraint sensible_date
        check (published > '1700-01-01 00:00:00'::timestamp without time zone);

comment on constraint sensible_date on filing_events is 'Check that the published date was not before the year 1700';

grant insert, select, update on filing_events to frontend;

grant insert, select on filing_events to stream;

grant delete, insert, references, select, trigger, truncate, update on filing_events to company_events_saver;

grant select on filing_events to events_freq_cloud_func;

create table saved_filters
(
    id           text                                                              not null,
    last_viewed  timestamp,
    view_count   integer               default 0,
    created      timestamp             default CURRENT_TIMESTAMP,
    last_run     timestamp             default CURRENT_TIMESTAMP,
    time_to_run  integer[]             default ARRAY []::integer[],
    filters      jsonb[],
    query        text,
    results      jsonb[],
    category     saved_filter_category default 'ACCOUNTANT'::saved_filter_category not null,
    result_count integer,
    constraint saved_filters_pk
        primary key (id, category)
);

comment on column saved_filters.id is 'a hash of the filter object';

grant delete, insert, references, select, trigger, truncate, update on saved_filters to frontend;

create table accounts
(
    id                   serial,
    compound_id          varchar(255)                                       not null,
    user_id              integer                                            not null,
    provider_type        varchar(255)                                       not null,
    provider_id          varchar(255)                                       not null,
    provider_account_id  varchar(255)                                       not null,
    refresh_token        text,
    access_token         text,
    access_token_expires timestamp with time zone,
    created_at           timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at           timestamp with time zone default CURRENT_TIMESTAMP not null,
    constraint accounts_pkey1
        primary key (id)
);

grant select, update, usage on sequence accounts_id_seq to frontend;

grant select, update, usage on sequence accounts_id_seq to black;

create unique index compound_id
    on accounts (compound_id);

create index provider_account_id
    on accounts (provider_account_id);

create index provider_id
    on accounts (provider_id);

create index user_id
    on accounts (user_id);

grant select on accounts to frontend;

grant delete, insert, references, select, trigger, truncate, update on accounts to black;

create table sessions
(
    id            serial,
    user_id       integer                                            not null,
    expires       timestamp with time zone                           not null,
    session_token varchar(255)                                       not null,
    access_token  varchar(255)                                       not null,
    created_at    timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at    timestamp with time zone default CURRENT_TIMESTAMP not null,
    constraint sessions_pkey
        primary key (id)
);

grant select, update, usage on sequence sessions_id_seq to frontend;

grant select, update, usage on sequence sessions_id_seq to black;

create unique index session_token
    on sessions (session_token);

create unique index access_token
    on sessions (access_token);

grant delete, insert, references, select, trigger, truncate, update on sessions to frontend;

grant delete, insert, references, select, trigger, truncate, update on sessions to black;

create table verification_requests
(
    id         serial,
    identifier varchar(255)                                       not null,
    token      varchar(255)                                       not null,
    expires    timestamp with time zone                           not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    updated_at timestamp with time zone default CURRENT_TIMESTAMP not null,
    constraint verification_requests_pkey
        primary key (id)
);

grant select, update, usage on sequence verification_requests_id_seq to frontend;

grant select, update, usage on sequence verification_requests_id_seq to black;

create unique index token
    on verification_requests (token);

grant delete, insert, references, select, trigger, truncate, update on verification_requests to frontend;

grant delete, insert, references, select, trigger, truncate, update on verification_requests to black;

create table cached_filters
(
    id           text    not null,
    last_viewed  timestamp,
    view_count   integer,
    created      timestamp default CURRENT_TIMESTAMP,
    last_run     timestamp,
    time_to_run  integer[],
    filters      jsonb[] not null,
    query        text,
    category     saved_filter_category,
    result_count integer,
    constraint cached_filters_id_pk
        primary key (id)
);

grant insert, select, update on cached_filters to frontend;

grant insert, select, update on cached_filters to black;

create table cached_filter_results
(
    id        serial,
    filter_fk text,
    data_fk   text,
    constraint unique_cached_result
        unique (filter_fk, data_fk),
    constraint cached_filter_results_cached_filters_id_fk
        foreign key (filter_fk) references cached_filters
            on delete cascade
);

comment on column cached_filter_results.data_fk is 'foreign key to company number or another data sources primary key';

grant select, update, usage on sequence cached_filter_results_id_seq to frontend;

grant select, update, usage on sequence cached_filter_results_id_seq to black;

grant insert, select, update on cached_filter_results to frontend;

grant insert, select, update on cached_filter_results to black;

create table user_roles
(
    code        text not null,
    name        text not null,
    description text,
    constraint roles_pk
        primary key (code)
);

create table users
(
    id             serial,
    name           varchar(255),
    email          varchar(255),
    email_verified timestamp with time zone,
    image          text,
    created_at     timestamp with time zone default CURRENT_TIMESTAMP   not null,
    updated_at     timestamp with time zone default CURRENT_TIMESTAMP   not null,
    name_updated   timestamp                default CURRENT_TIMESTAMP,
    uid            uuid                     default gen_random_uuid(),
    role_code      text                     default 'unpaid_user'::text not null,
    constraint users_pkey
        primary key (id),
    constraint users_user_roles_code_fk
        foreign key (role_code) references user_roles
            on update cascade on delete set default
);

grant select, update, usage on sequence users_id_seq to frontend;

grant select, update, usage on sequence users_id_seq to black;

create unique index email
    on users (email);

create unique index users_uid_uindex
    on users (uid);

grant delete, insert, references, select, trigger, truncate, update on users to frontend;

grant delete, insert, references, select, trigger, truncate, update on users to black;

create table user_filters
(
    id               serial,
    title            text,
    created          timestamp default CURRENT_TIMESTAMP,
    user_id_fk       integer,
    cached_filter_fk text,
    constraint user_filters_pk
        primary key (id),
    constraint user_filters_users_id_fk
        foreign key (user_id_fk) references users
            on update cascade on delete cascade,
    constraint user_filters_cached_filters_id_fk
        foreign key (cached_filter_fk) references cached_filters
            on update cascade on delete set null
);

comment on table user_filters is 'this table stores filters saved by a user to their account';

grant select, update, usage on sequence user_filters_id_seq to frontend;

grant select, update, usage on sequence user_filters_id_seq to black;

create unique index user_filters_unique_per_user
    on user_filters (cached_filter_fk, user_id_fk);

grant insert, select, update on user_filters to frontend;

grant insert, select, update on user_filters to black;

grant select on user_roles to frontend;

create table user_operations
(
    code        text not null,
    name        text not null,
    description text,
    constraint user_operations_pk
        primary key (code)
);

create table user_exports
(
    id             serial,
    user_filter_fk integer,
    timestamp      timestamp default CURRENT_TIMESTAMP,
    time_to_export integer,
    operation_code text,
    constraint user_exports_pk
        primary key (id),
    constraint user_exports_user_filters_id_fk
        foreign key (user_filter_fk) references user_filters
            on update cascade on delete set null,
    constraint user_exports_user_operations_code_fk
        foreign key (operation_code) references user_operations
);

comment on column user_exports.time_to_export is 'milliseconds';

grant select, update, usage on sequence user_exports_id_seq to frontend;

grant select, update, usage on sequence user_exports_id_seq to black;

grant insert, select on user_exports to frontend;

grant insert, select, update on user_exports to black;

create table user_role_quotas
(
    id            serial,
    role_code     text,
    operation     text    not null,
    monthly_limit integer not null,
    constraint user_role_quotas_pk
        primary key (id),
    constraint unique_role_operation
        unique (role_code, operation),
    constraint user_role_quotas_user_roles_code_fk
        foreign key (role_code) references user_roles
            on update cascade on delete cascade,
    constraint user_role_quotas_user_operations_code_fk
        foreign key (operation) references user_operations
            on update cascade on delete cascade
);

comment on column user_role_quotas.operation is 'the operation that the quota restricts';

grant select on user_role_quotas to frontend;

grant select on user_role_quotas to black;

create table person_officers
(
    person_number             char(12) not null,
    post_code                 text,
    birth_date                date,
    title                     varchar(50),
    forenames                 varchar(50),
    surname                   text     not null,
    honours                   varchar(50),
    care_of                   varchar(100),
    po_box                    varchar(10),
    address_line_1            text,
    address_line_2            varchar(50),
    post_town                 varchar(50),
    county                    varchar(50),
    country                   varchar(50),
    occupation                varchar(40),
    nationality               varchar(40),
    usual_residential_country varchar(160),
    officer_name_vector       tsvector generated always as (to_tsvector('simple'::regconfig,
                                                                        (((COALESCE(forenames, ''::character varying))::text || ' '::text) ||
                                                                         surname))) stored,
    constraint person_officers_pkey
        primary key (person_number)
);

create table officer_appointments
(
    company_number   char(8),
    person_number    char(12),
    appointment_type text,
    appointment_date date,
    constraint officer_appointments_person_number_fkey
        foreign key (person_number) references person_officers
);

create index officer_appointments_person_number_idx
    on officer_appointments (person_number);

create index officer_appointments_company_number_idx
    on officer_appointments (company_number);

grant select on officer_appointments to frontend;

create index person_officers_birth_date_idx
    on person_officers (birth_date);

create index person_officers_nationality_idx
    on person_officers using hash (nationality);

create index person_officers_occupation_idx
    on person_officers (occupation);

create index officer_name_index
    on person_officers using gin (officer_name_vector);

grant select on person_officers to frontend;

create materialized view short_list_accounts as
SELECT a.company_number,
       a.end_date
FROM accounts a
WHERE a.label = 'UK Companies House registered number'::text
GROUP BY a.company_number, a.end_date
ORDER BY a.end_date, a.company_number;

create unique index short_list_accounts_company_number_end_date_idx
    on short_list_accounts (company_number, end_date);

grant select on short_list_accounts to black;

create materialized view companies_count as
SELECT now()                 AS last_updated_count,
       (SELECT count(*) AS count
        FROM companies)      AS companies_rows,
       (SELECT count(DISTINCT filing_events.company_number) AS count
        FROM filing_events)  AS filing_events_companies,
       (SELECT count(DISTINCT company_events.company_number) AS count
        FROM company_events) AS company_events_companies,
       (SELECT count(DISTINCT filing_events.id) AS count
        FROM filing_events)  AS filing_events_ids,
       (SELECT count(DISTINCT company_events.id) AS count
        FROM company_events) AS company_events_ids,
       (SELECT count(*) AS count
        FROM filing_events)  AS filing_events_rows,
       (SELECT count(*) AS count
        FROM company_events) AS company_events_rows,
       (SELECT count(*) AS count
        FROM accounts)       AS accounts_rows,
       (SELECT count(DISTINCT accounts.company_number) AS count
        FROM accounts)       AS accounts_companies;

grant select on companies_count to black;

create materialized view wide_accounts as
SELECT r.company_number,
       (SELECT b.value::date AS value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Balance sheet date'::text
        LIMIT 1)                                                               AS balance_sheet_date,
       (SELECT b.value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND (b.label = 'Name of entity accountants'::text OR
               b.label = 'Name of entity auditors'::text)
        LIMIT 1)                                                               AS accountants,
       (SELECT b.value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Name of production software'::text
        LIMIT 1)                                                               AS accouting_software,
       (SELECT max(to_number(b.value, '999,999,999,999'::text)) AS max
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Average number of employees during the period'::text) AS employees,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Current assets'::text)                                AS current_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Cash at bank and on hand'::text)                      AS cash_at_bank,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Debtors'::text)                                       AS debtors,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Creditors'::text)                                     AS creditors,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Fixed assets'::text)                                  AS fixed_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Net assets (liabilities)'::text)                      AS net_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Total assets less current liabilities'::text)         AS total_assets_less_current_liabilities,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Equity'::text)                                        AS equity,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Turnover / revenue'::text)                            AS revenue,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Profit (loss)'::text)                                 AS profit,
       (SELECT array_agg(DISTINCT b.value) AS array_agg
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Name of entity officer'::text)                        AS officers
FROM short_list_accounts r
LIMIT 1362251;

create materialized view wide_accounts_part_two as
SELECT r.company_number,
       (SELECT b.value::date AS value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Balance sheet date'::text
        LIMIT 1)                                                               AS balance_sheet_date,
       (SELECT b.value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND (b.label = 'Name of entity accountants'::text OR
               b.label = 'Name of entity auditors'::text)
        LIMIT 1)                                                               AS accountants,
       (SELECT b.value
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Name of production software'::text
        LIMIT 1)                                                               AS accouting_software,
       (SELECT max(to_number(b.value, '999,999,999,999'::text)) AS max
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Average number of employees during the period'::text) AS employees,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Current assets'::text)                                AS current_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Cash at bank and on hand'::text)                      AS cash_at_bank,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Debtors'::text)                                       AS debtors,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Creditors'::text)                                     AS creditors,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Fixed assets'::text)                                  AS fixed_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Net assets (liabilities)'::text)                      AS net_assets,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Total assets less current liabilities'::text)         AS total_assets_less_current_liabilities,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Equity'::text)                                        AS equity,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Turnover / revenue'::text)                            AS revenue,
       (SELECT CASE
                   WHEN avg(to_number(b.value, '999,999,999,999'::text)) > 0::numeric
                       THEN max(to_number(b.value, '999,999,999,999'::text))
                   ELSE min(to_number(b.value, '999,999,999,999'::text))
                   END AS min
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Profit (loss)'::text)                                 AS profit,
       (SELECT array_agg(DISTINCT b.value) AS array_agg
        FROM accounts b
        WHERE b.company_number = r.company_number
          AND b.end_date = r.end_date
          AND b.label = 'Name of entity officer'::text)                        AS officers
FROM short_list_accounts r
OFFSET 1362251 LIMIT 1362251;

create materialized view wide_accounts_combined as
SELECT wide_accounts.company_number,
       wide_accounts.balance_sheet_date,
       wide_accounts.accountants,
       wide_accounts.accouting_software,
       wide_accounts.employees,
       wide_accounts.current_assets,
       wide_accounts.cash_at_bank,
       wide_accounts.debtors,
       wide_accounts.creditors,
       wide_accounts.fixed_assets,
       wide_accounts.net_assets,
       wide_accounts.total_assets_less_current_liabilities,
       wide_accounts.equity,
       wide_accounts.revenue,
       wide_accounts.profit,
       wide_accounts.officers
FROM wide_accounts
UNION
SELECT wide_accounts_part_two.company_number,
       wide_accounts_part_two.balance_sheet_date,
       wide_accounts_part_two.accountants,
       wide_accounts_part_two.accouting_software,
       wide_accounts_part_two.employees,
       wide_accounts_part_two.current_assets,
       wide_accounts_part_two.cash_at_bank,
       wide_accounts_part_two.debtors,
       wide_accounts_part_two.creditors,
       wide_accounts_part_two.fixed_assets,
       wide_accounts_part_two.net_assets,
       wide_accounts_part_two.total_assets_less_current_liabilities,
       wide_accounts_part_two.equity,
       wide_accounts_part_two.revenue,
       wide_accounts_part_two.profit,
       wide_accounts_part_two.officers
FROM wide_accounts_part_two;

create index wide_accounts_combined_accountants_idx
    on wide_accounts_combined (accountants);

create index wide_accounts_combined_accouting_software_idx
    on wide_accounts_combined (accouting_software);

create index wide_accounts_combined_company_number_idx
    on wide_accounts_combined (company_number);

create index wide_accounts_combined_balance_sheet_date_idx
    on wide_accounts_combined (balance_sheet_date);

create index wide_accounts_combined_employees_idx
    on wide_accounts_combined (employees);

grant select on wide_accounts_combined to frontend;

grant select on wide_accounts_combined to black;

create materialized view accountants as
SELECT w1.accountants                    AS name_on_accounts,
       (WITH matching_numbers AS (
           SELECT companies.number
           FROM companies
           WHERE upper(companies.name::text) ~~ upper(w1.accountants || '%'::text)
       )
        SELECT CASE
                   WHEN count(*) = 1 THEN string_agg(matching_numbers.number::text, ''::text)
                   ELSE NULL::text
                   END AS company_number
        FROM matching_numbers)           AS company_number,
       (SELECT w2.accouting_software
        FROM wide_accounts_combined w2
        WHERE w1.accountants = w2.accountants
        GROUP BY w2.accouting_software
        ORDER BY (count(DISTINCT w2.company_number)) DESC
        LIMIT 1)                         AS software,
       count(DISTINCT w1.company_number) AS number_of_clients
FROM wide_accounts_combined w1
WHERE w1.accountants IS NOT NULL
GROUP BY w1.accountants;

create index trgm_idx_accountants_upper_name
    on accountants using gin (upper(name_on_accounts) gin_trgm_ops);

create index trgm_idx_accountants_lower_name
    on accountants using gin (lower(name_on_accounts) gin_trgm_ops);

create index trgm_idx_accountants_lower_software
    on accountants using gin (lower(software) gin_trgm_ops);

create index accountants_software_idx
    on accountants (software);

create index accountants_lower_idx
    on accountants (lower(software));

grant select on accountants to frontend;

create materialized view list_accounts as
SELECT a.company_number,
       a.end_date
FROM company_accounts a
GROUP BY a.company_number, a.end_date
ORDER BY a.end_date, a.company_number;

create view readable_role_quotas(role, operation, monthly_limit) as
SELECT ur.name AS role,
       uo.name AS operation,
       urq.monthly_limit
FROM user_role_quotas urq
         JOIN user_operations uo ON urq.operation = uo.code
         JOIN user_roles ur ON ur.code = urq.role_code;

create view user_export_usage(period, user_id, operation_code, export_usage) as
WITH unique_user_exports AS (
    SELECT DISTINCT ON (u.id, cf.id) to_char(ue."timestamp", 'Mon YYYY'::text) AS period,
                                     u.id                                      AS user_id,
                                     ue.operation_code,
                                     cf.result_count
    FROM user_exports ue
             JOIN user_filters uf ON uf.id = ue.user_filter_fk
             JOIN cached_filters cf ON cf.id = uf.cached_filter_fk
             JOIN users u ON uf.user_id_fk = u.id
)
SELECT unique_user_exports.period,
       unique_user_exports.user_id,
       unique_user_exports.operation_code,
       sum(unique_user_exports.result_count) AS export_usage
FROM unique_user_exports
GROUP BY unique_user_exports.period, unique_user_exports.user_id, unique_user_exports.operation_code;

comment on view user_export_usage is 'Summarises the number of downloads per user, per category, per month. Counts multiple downloads of the same filter by the same user only once';

grant select on user_export_usage to frontend;

grant select on user_export_usage to black;

create view accountant_view
            (name_on_accounts, company_number, software, number_of_clients, registered_name, streetaddress, county,
             area, country, postcode, company_type, country_of_origin, status, date_of_creation, balance_sheet_date,
             accountants, employees, current_assets, cash_at_bank, debtors, creditors, fixed_assets, net_assets,
             total_assets_less_current_liabilities, equity, revenue, profit, officers)
as
SELECT a.name_on_accounts,
       a.company_number,
       a.software,
       a.number_of_clients,
       c.name      AS registered_name,
       c.streetaddress,
       dp.county,
       dp.district AS area,
       dp.country,
       c.postcode,
       c.category  AS company_type,
       c.origin    AS country_of_origin,
       c.status,
       c.date      AS date_of_creation,
       wac.balance_sheet_date,
       wac.accountants,
       wac.employees,
       wac.current_assets,
       wac.cash_at_bank,
       wac.debtors,
       wac.creditors,
       wac.fixed_assets,
       wac.net_assets,
       wac.total_assets_less_current_liabilities,
       wac.equity,
       wac.revenue,
       wac.profit,
       wac.officers
FROM accountants a
         LEFT JOIN companies c ON c.number::text = a.company_number
         LEFT JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
         LEFT JOIN wide_accounts_combined wac ON a.company_number = wac.company_number::text;

grant select on accountant_view to frontend;

create view company_view
            (company_number, name, streetaddress, county, area, country, postcode, company_type, country_of_origin,
             status, date_of_creation, balance_sheet_date, accountants, employees, current_assets, cash_at_bank,
             debtors, creditors, fixed_assets, net_assets, total_assets_less_current_liabilities, equity, revenue,
             profit, officers)
as
SELECT DISTINCT ON (wac.company_number) wac.company_number,
                                        c.name,
                                        c.streetaddress,
                                        dp.county,
                                        dp.district AS area,
                                        dp.country,
                                        c.postcode,
                                        c.category  AS company_type,
                                        c.origin    AS country_of_origin,
                                        c.status,
                                        c.date      AS date_of_creation,
                                        wac.balance_sheet_date,
                                        wac.accountants,
                                        wac.employees,
                                        wac.current_assets,
                                        wac.cash_at_bank,
                                        wac.debtors,
                                        wac.creditors,
                                        wac.fixed_assets,
                                        wac.net_assets,
                                        wac.total_assets_less_current_liabilities,
                                        wac.equity,
                                        wac.revenue,
                                        wac.profit,
                                        wac.officers
FROM wide_accounts_combined wac
         JOIN companies c ON c.number = wac.company_number
         JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
ORDER BY wac.company_number, wac.balance_sheet_date DESC;

grant select on company_view to frontend;

grant select on company_view to stream;

create view officer_ages(person_number, age) as
SELECT person_officers.person_number,
       date_part('year'::text, now()) - date_part('year'::text, person_officers.birth_date) AS age
FROM person_officers;

create view insolvency_prediction_input
            (company_number, average_income_of_area, altitude, latitude, longtitude, company_type, date_of_creation,
             status, updated, age_years, balance_sheet_date, employees, current_assets, cash_at_bank, debtors,
             creditors, fixed_assets, net_assets, total_assets_less_current_liabilities, equity, revenue, profit,
             number_of_officers)
as
SELECT c.number                                                 AS company_number,
       dp.average_income                                        AS average_income_of_area,
       dp."Altitude"                                            AS altitude,
       dp.lat                                                   AS latitude,
       dp.long                                                  AS longtitude,
       c.category                                               AS company_type,
       c.date                                                   AS date_of_creation,
       c.status,
       c.updated,
       2021::double precision - date_part('year'::text, c.date) AS age_years,
       wac.balance_sheet_date,
       wac.employees,
       wac.current_assets,
       wac.cash_at_bank,
       wac.debtors,
       wac.creditors,
       wac.fixed_assets,
       wac.net_assets,
       wac.total_assets_less_current_liabilities,
       wac.equity,
       wac.revenue,
       wac.profit,
       array_length(wac.officers, 1)                            AS number_of_officers
FROM wide_accounts_combined wac
         JOIN companies c ON c.number = wac.company_number
         JOIN detailed_postcodes dp ON c.postcode::text = dp.postcode
WHERE wac.employees IS NOT NULL
  AND wac.employees < 100000::numeric
ORDER BY wac.employees DESC
LIMIT 100000;

create function set_limit(real) returns real
    strict
    language c
as
$$
begin
-- missing source code
end;
$$;

create function show_limit() returns real
    stable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function show_trgm(text) returns text[]
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function similarity(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function similarity_op(text, text) returns boolean
    stable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function word_similarity(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function word_similarity_op(text, text) returns boolean
    stable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function word_similarity_commutator_op(text, text) returns boolean
    stable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function similarity_dist(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function word_similarity_dist_op(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function word_similarity_dist_commutator_op(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_in(cstring) returns gtrgm
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_out(gtrgm) returns cstring
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_consistent(internal, text, smallint, oid, internal) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_distance(internal, text, smallint, oid, internal) returns double precision
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_compress(internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_decompress(internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_penalty(internal, internal, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_picksplit(internal, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_union(internal, internal) returns gtrgm
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_same(gtrgm, gtrgm, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gin_extract_value_trgm(text, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal) returns internal
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal,
                                    internal) returns boolean
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal) returns "char"
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function strict_word_similarity(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function strict_word_similarity_op(text, text) returns boolean
    stable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function strict_word_similarity_commutator_op(text, text) returns boolean
    stable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function strict_word_similarity_dist_op(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function strict_word_similarity_dist_commutator_op(text, text) returns real
    immutable
    strict
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create function gtrgm_options(internal) returns void
    immutable
    parallel safe
    language c
as
$$
begin
-- missing source code
end;
$$;

create operator % (procedure = similarity_op, leftarg = text, rightarg = text, commutator = %, join = matchingjoinsel, restrict = matchingsel);

create operator <-> (procedure = similarity_dist, leftarg = text, rightarg = text, commutator = <->);

create operator family gist_trgm_ops using gist;

alter operator family gist_trgm_ops using gist add
    operator 1 %(text, text),
    operator 2 <->(text, text) for order by float_ops,
    operator 3 ~~(text,text),
    operator 4 ~~*(text,text),
    operator 5 ~(text,text),
    operator 6 ~*(text,text),
    operator 7 %>(text, text),
    operator 8 <->>(text, text) for order by float_ops,
    operator 9 %>>(text, text),
    operator 10 <->>>(text, text) for order by float_ops,
    function 1(text, text) gtrgm_consistent(internal, text, smallint, oid, internal),
    function 2(text, text) gtrgm_union(internal, internal),
    function 3(text, text) gtrgm_compress(internal),
    function 4(text, text) gtrgm_decompress(internal),
    function 5(text, text) gtrgm_penalty(internal, internal, internal),
    function 6(text, text) gtrgm_picksplit(internal, internal),
    function 7(text, text) gtrgm_same(gtrgm, gtrgm, internal),
    function 8(text, text) gtrgm_distance(internal, text, smallint, oid, internal),
    function 10(text, text) gtrgm_options(internal);

create operator class gist_trgm_ops for type text using gist as storage gtrgm operator 1 %(text, text),
	function 1(text, text) gtrgm_consistent(internal, text, smallint, oid, internal),
	function 2(text, text) gtrgm_union(internal, internal),
	function 3(text, text) gtrgm_compress(internal),
	function 4(text, text) gtrgm_decompress(internal),
	function 5(text, text) gtrgm_penalty(internal, internal, internal),
	function 6(text, text) gtrgm_picksplit(internal, internal),
	function 7(text, text) gtrgm_same(gtrgm, gtrgm, internal);

create operator family gin_trgm_ops using gin;

alter operator family gin_trgm_ops using gin add
    operator 1 %(text, text),
    operator 3 ~~(text,text),
    operator 4 ~~*(text,text),
    operator 5 ~(text,text),
    operator 6 ~*(text,text),
    operator 7 %>(text, text),
    operator 9 %>>(text, text),
    function 2(text, text) gin_extract_value_trgm(text, internal),
    function 3(text, text) gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal),
    function 4(text, text) gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal),
    function 6(text, text) gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal);

create operator class gin_trgm_ops for type text using gin as storage integer operator 1 %(text, text),
	function 1(text, text) btint4cmp(integer,integer),
	function 2(text, text) gin_extract_value_trgm(text, internal),
	function 3(text, text) gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal),
	function 4(text, text) gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal);

-- Cyclic dependencies found

create operator %> (procedure = word_similarity_commutator_op, leftarg = text, rightarg = text, commutator = <%, join = matchingjoinsel, restrict = matchingsel);

create operator <% (procedure = word_similarity_op, leftarg = text, rightarg = text, commutator = %>, join = matchingjoinsel, restrict = matchingsel);

-- Cyclic dependencies found

create operator %>> (procedure = strict_word_similarity_commutator_op, leftarg = text, rightarg = text, commutator = <<%, join = matchingjoinsel, restrict = matchingsel);

create operator <<% (procedure = strict_word_similarity_op, leftarg = text, rightarg = text, commutator = %>>, join = matchingjoinsel, restrict = matchingsel);

-- Cyclic dependencies found

create operator <->> (procedure = word_similarity_dist_commutator_op, leftarg = text, rightarg = text, commutator = <<->);

create operator <<-> (procedure = word_similarity_dist_op, leftarg = text, rightarg = text, commutator = <->>);

-- Cyclic dependencies found

create operator <->>> (procedure = strict_word_similarity_dist_commutator_op, leftarg = text, rightarg = text, commutator = <<<->);

create operator <<<-> (procedure = strict_word_similarity_dist_op, leftarg = text, rightarg = text, commutator = <->>>);

