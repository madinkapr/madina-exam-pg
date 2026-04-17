export const USER = `
select 
    u.id,
    u.email,
    u.is_admin
from users u
where ($1::int IS NULL OR u.id = $1)  
AND u.is_admin=true
`