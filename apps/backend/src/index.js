import fastify from "fastify";
import cors from '@fastify/cors'
import { query } from "./query.js";
import { USER } from "./user.js";
import md5 from "md5";
import jwt from 'jsonwebtoken';

const app = fastify();

app.register(cors, { 
  origin: "*" 
});

app.get('/users', async (req, res) => {
    try {
        let { page = 1, count = 10, user_id, token } = req.query;

        if (!token) {
            return res.code(401).send({ error: "Token required" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        page = parseInt(page) || 1;
        count = parseInt(count);
        user_id = isNaN(parseInt(user_id)) ? null : parseInt(user_id);

        if (isNaN(page) || page < 1) {
            return res.code(400).send({ error: "Page must be a valid positive number" });
        }

        if (isNaN(count) || count < 1) {
            return res.code(400).send({ error: "Count must be a valid positive number" });
        }

        const users = await query(USER, user_id);

        if (users.length > 0) {
            if (users[0].id !== decoded.id && !decoded.is_admin) {
                return res.code(403).send({ error: "Forbidden" });
            }
        }

        return {
            loggedUser: decoded,
            users
        }

    } catch (error) {
        console.error("Error", error);

        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.code(401).send({ error: "Invalid token" });
        }

        return res.code(500).send({ error: "Internal server error" });
    }
})

app.post('/signup', async (req, res) => {
    const { email, password, is_admin = false } = req.body;


    if (!email || !email.includes('@')) {
        return res.code(400).send({ error: 'Invalid email' });
    }

    if (!password || password.length < 4) {
        return res.code(400).send({ error: 'Password must be at least 4 characters long' });
    }

    
    try {
        const existingUsers = await query('SELECT id FROM users WHERE email = $1', email);
        if (existingUsers.length > 0) {
            return res.code(409).send({ error: 'User with this email already exists' });
        }
        
        const hashedPassword = md5(password);

        await query(
            'INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) ',
            email,
            hashedPassword,
            is_admin || false
        );

        return res.code(201).send({ message: "Successfully added data" });
    } catch (error) {
        console.error('Signup error:', error);
        return res.code(500).send({ error: 'Internal server error' });
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.code(400).send({ error: 'Email and password are required' });
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

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                is_admin: user.is_admin
            },
            process.env.JWT_SECRET
        )

        return res.code(200).send({
            token,
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

app.listen({ port: (process.env.BACKEND_PORT) || 3000 }, () => console.log('Server is running on port 3000'))

