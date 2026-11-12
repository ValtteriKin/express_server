import express from 'express';
import {v4 as uuidv4} from 'uuid';

const app = express();
app.use(express.json());  //allows program to understand json

const PORT = 3000; //what port server uses

app.listen(PORT, () => {   //starts server
    console.log('server is running on port ', PORT);
});

let todos = [];
const allowedStates = ['todo', 'doing', 'done']

app.post('/todos', (req, res) => {   //creates a post endpoint with /todos url path
    const {title, description, state} = req.body; //data sent by put request

    if(typeof title !== 'string' || title.trim().length === 0 || typeof description !== 'string' || description.trim().length === 0){
    return res.status(400).json({
        error: 'Todo filled incorrectly'
    });
    }
    if(state !== undefined){   
        if(!allowedStates.includes(state)){
            return res.status(400).json({
            error: 'status filled incorrectly'
            });
        }
    }
    const newTodo = {
        id: uuidv4(),
        title,
        description,
        state: state || 'todo',   //|| default state
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
            if(!allowedStates.includes(state)){
                return res.status(400).json({
                error: 'status filled incorrectly'
            });
        }
        const filteredTodos = todos.filter(todo => todo.state === state);   //returns only those states that mach filter
        return res.status(200).json(filteredTodos);
    }

    res.status(200).json(todos);
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.find(todo => todo.id === id);  //finds todo based on id

    if(!todo) {
        return res.status(404).json({
            error: 'Todo not found'
        });
    }
    res.status(200).json(todo);
});

app.put('/todos/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.find(todo => todo.id === id);

    if (!todo) {
        return res.status(404).json({
            error: 'Todo not found'
        });
    }

    const {title, description, state} = req.body; //data sent by put request

    if(title === undefined && description === undefined && state === undefined){
        return res.status(400).json({
            error: 'Todo filled incorrectly'
        });
    }

    if(title !== undefined){
        if(typeof title !== 'string' || title.trim().length === 0){
            return res.status(400).json({
                error: 'Todo filled incorrectly'
            });
        }
    }
    if(description !== undefined){
        if(typeof description !== 'string' || description.trim().length === 0){
            return res.status(400).json({
                error: 'Todo filled incorrectly'
            });
        }
    }
    if(state !== undefined){
        if(!allowedStates.includes(state)){
                return res.status(400).json({
                    error: 'Todo filled incorrectly'
                });
        }
    }
    todo.title = title ?? todo.title;  //checks whether value is null or undefined
    todo.description = description ?? todo.description;  //if value1 is not null or undefined use it.   value1 ?? value2
    todo.state = state ?? todo.state;                    // else use value2

    res.status(200).json(todo);
});


app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    const todo = todos.findIndex(todo => todo.id === id);   //findIndex returns array index 

    if (todo === -1) {  //-1 means not found
        return res.status(404).json({
            error: 'Todo not found'
        });
    }

    const deleted = todos.splice(todo, 1);  //splice deletes at given index and number of elemnts given and return deleted items
    res.status(200).json(deleted);

});