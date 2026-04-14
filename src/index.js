import fastify from "fastify";
import { query } from "./query.js";
import { USER } from "./user.js";
import md5 from "md5";

const app = fastify();

app.get('/users', async(req,res)=>{
    let {page=1, count=10} = req.query;

    page = parseInt(page) || 1;
    count = parseInt(count) || 10;

    const users = await query(USER, page, count);

    return users;
})

app.post('/signup', async (req, res) => {
    const { email, password, is_admin = false } = req.body;


    if (!email || !password) {
        return res.code(400).send({ error: 'Email and password are required' });
    }

    const hashedPassword = md5(password);

    try {
        const existingUsers = await query('SELECT id FROM users WHERE email = $1', email);
        if (existingUsers.length > 0) {
            return res.code(409).send({ error: 'User with this email already exists' });
        }

        await query(
            'INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) ',
            email,
            hashedPassword,
            is_admin || false
        );

        return res.code(201).send({massage: "Added data "});
    } catch (error) {
        console.error('Signup error:', error);
        return res.code(500).send({ error: 'Internal server error' });
    }
})

app.post('login', async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.code(400).send({ error: 'Email and password already exist' });
    }

   try {
        const users = await query(
            'SELECT id, email, password, is_admin FROM users WHERE email = $1',
            email
        );

        if (users.length === 0) {
            return res.code(401).send({ error: 'Invalid email or password' });
        }

        const user = users[0];

        const hashedPassword = md5(password);

        if (user.password !== hashedPassword) {
            return res.code(401).send({ error: 'Invalid email or password' });
        }

        return res.code(200).send({
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.code(500).send({ error: 'Internal server error' });
    }




})

app.listen({port: (process.env.BACKEND_PORT) || 3000 }, ()=> console.log('Server is running on port 3000'))

