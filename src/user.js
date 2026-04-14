export const USER = `
select 
    u.id,
    u.email,
    u.is_admin
from users u
where u.is_admin=true
offset ($1-1)*$2 limit $2;
`