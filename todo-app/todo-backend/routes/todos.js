const express = require('express')
const { Todo } = require('../mongo')
const router = express.Router()

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
  res.send(todo)
})

/* GET todo. */
//router.get('/:id', async (req, res) => {
//  const { id } = req.params
//  req.todo = await Todo.findById(id)
//  res.send(req.todo)
//res.sendStatus(405) // Implement this
//})
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
