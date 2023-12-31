const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()
const { getAsync, setAsync } = require('../redis/index.js')
/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  })
  const counter_value = await getAsync('todo_counter')
  if (!counter_value) {
    await setAsync('todo_counter', 1)
  } else {
    await setAsync('todo_counter', Number(counter_value) + 1)
  }
  const value = await getAsync('todo_counter')
  console.log('counter', value)
  res.send(todo)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).send(req.todo)
})
/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const newText = req.body.text
  const newDone = req.body.done
  await Todo.updateOne(
    { _id: req.todo.id },
    { $set: { text: newText, done: newDone } }
  )
  const todo = await Todo.findById(req.todo.id)
  res.status(200).send(todo)
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
