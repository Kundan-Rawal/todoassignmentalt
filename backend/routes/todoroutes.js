import express from 'express';
import pool from '../db.js'; 
import verifyToken from '../middleware/authentication.js'; 

const router = express.Router();

router.use(verifyToken);

router.get('/', async (req, res) => {
    try {
        const todos = await pool.query(
            'SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(todos.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 

router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        const newTodo = await pool.query(
            'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
            [req.user.id, title]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { is_completed } = req.body;
        const update = await pool.query(
            'UPDATE todos SET is_completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [is_completed, id, req.user.id]
        );

        if (update.rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json(update.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query(
            'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (deleteTodo.rows.length === 0) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;