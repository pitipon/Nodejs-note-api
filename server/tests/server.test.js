const expect = require('expect')
const request = require('supertest')
const { ObjectID } = require('mongodb')

const { app } = require('./../server')
const { Todo } = require('./../models/todo')

// mock todo
const todos = [{ 
    _id: new ObjectID(),
    text: 'First todo' 
}, { 
    _id: new ObjectID(),
    text: 'Second todo',
    completed: true,
    completedAt: 333
}]

// Delete all todo
beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done())
})

// TEST POST 
describe('POST /todos', () => {
    it('should crate a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

// TEST GET
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

// TEST GET BY ID
describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should return 404 if todo not found', (done) => {
        // make sure you get a 404 back
        var hexId = new ObjectID().toHexString()

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
        // /todos/123
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done)
    })
})

// TEST Delete by id
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString()
        

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
            })

            Todo.findById(hexId).then((todo) => {
                done()
            }).catch((e) => done(e))
    })

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString()

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done)
    })

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done)
    })
})

// TEST PATCH
describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        var hexId = todos[0]._id.toHexString()
        var text = 'This should be the new text'

        // update text, set complated true
        // 200
        // text is changed, completed is true
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(true)
            })
            .end(done)
        
    })

    it('should clear complatedAt when todo is not completed', (done) => {
        // grab id of second todo item
        var hexId = todos[1]._id.toHexString()
        var text = 'This should be the new text'

        // update text, set complated false
        // 200
        // text id changed, complated false, complatedAt id null .toNotExist
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text)
                expect(res.body.todo.completed).toBe(false)
            })
            .end(done)
    })
})