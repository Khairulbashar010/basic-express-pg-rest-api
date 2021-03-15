const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json()); // => req.body

// Get data
app.get('/get_todos', async(req, res) => {
    try{
        const allTodos = await pool.query(
            "SELECT * FROM todo"
        );
        res.json(allTodos.rows);
    } catch(err){
        console.log(err.message)
    }
});

// Post data
app.post('/post_todos', async(req, res) => {
    try{
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) Values ($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch(err) {
        console.error(err.message);
    }
});

// Get a data

 app.get('/get_todo/:id', async(req, res) => {
     try {
        const { id } = req.params;
         const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
         res.json(todo.rows[0]);
     } catch (err) {
         console.error(err.message); 
     }
 });

 // Update a Todo
 app.put('/edit_todo/:id', async(req, res) => {
     try {
        const { id } = req.params;
        const { description } = req.body;

         const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
         res.json(`ID no ${id} is updated`);
     } catch (err) {
         console.error(err.message);  
     }
 });

 // Delete a Todo
 app.delete('/delete/:id', async(req, res) => {
     try {
         const { id } = req.params;
         const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
         res.json(`ID no ${id} is deleted`);
     } catch (err) {
         console.error(err.message);        
     }
 });

app.listen(3000, () => {
    console.log('Server connected');
})