create operator public.% (procedure = public.similarity_op, leftarg = text, rightarg = text, commutator = public.%, join = matchingjoinsel, restrict = matchingsel);

alter operator public.%(text, text) owner to black;

