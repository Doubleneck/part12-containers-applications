const express = require('express')
const router = express.Router()
const { getAsync } = require('../redis')
const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits,
  })
})

/* GET todo_counter data. */
router.get('/statistics', async (req, res) => {
  const todos = await getAsync('todo_counter')
  res.send({
    added_todos: Number(todos) || 0,
  })
})

module.exports = router
