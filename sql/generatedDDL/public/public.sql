create schema public;

comment on schema public is 'standard public schema';

alter schema public owner to cloudsqlsuperuser;

grant create, usage on schema public to public;

