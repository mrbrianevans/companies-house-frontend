-- filter by location
SELECT *
FROM legacy_accountants a,
     companies c,
     postcode_summary p
WHERE a.company_number = c.number
  AND c.postcode LIKE p.postcode_prefix || '%'
  AND p.area = 'Taunton';
