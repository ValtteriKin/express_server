import express from 'express';
import {v4 as uuidv4} from 'uuid';

const app = express();
app.use(express.json());  //allows program to understand json

const PORT = 3000; //what port server uses

app.listen(PORT, () => {   //starts server
    console.log('server is running on port ', PORT);
});

let todos = [];

app.post('/todos', (req, res) => {   //creates a post endpoint with /todos url path
    const newTodo = {
        id: uuidv4(),
        title: req.body.title,
        description: req.body.description,
        state: req.body.state || 'todo',   //|| default state
        dueDate: req.body.dueDate,
        createdAt: new Date().toISOString(), //generates timestamps
        updatedAt: new Date().toISOString()
    };
    
    todos.push(newTodo);

    res.status(201).json(newTodo);
});

app.get('/todos', (req, res) => {
    const state = req.query.state;   //saves query parameter
    if (state) {   //checked if user gave a status filter
        const filteredTodos = todos.filter(todo => todo.state === state);   //returns only those states that mach filter
        return res.status(200).json(filteredTodos);
    }

    res.status(200).json(todos);
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.find(todo => todo.id === id);

    if(!todo) {
        return res.status(404).json({
            error: 'Todo not found'
        });
    }
    res.status(200).json(todo);
});