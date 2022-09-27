create view public.user_export_usage(period, user_id, operation_code, export_usage) as
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

comment on view public.user_export_usage is 'Summarises the number of downloads per user, per category, per month. Counts multiple downloads of the same filter by the same user only once';

alter table public.user_export_usage owner to "orange-pc";

grant select on public.user_export_usage to frontend;

grant select on public.user_export_usage to black;

