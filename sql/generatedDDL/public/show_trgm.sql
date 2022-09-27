create function public.show_trgm(text) returns text[]
	immutable
	strict
	parallel safe
	language c
as $$
begin
-- missing source code
end;
$$;

alter function public.show_trgm(text) owner to black;

