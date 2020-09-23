const express = require('express')
const router = express.Router()

// Get all orders
router.get('/', (req, res, next) => {
  res.status(200).send({
    message: 'Usando o GET em pedidos'
  })
})

// Insert order
router.post('/', (req, res, next) => {

  const pedido = {
    id_produto: req.body.id,
    quantidade: req.body.quantidade
  }

  res.status(201).send({
    message: 'Usando POST em pedidos',
    pedidoCriado: pedido
  })
})

// Get order
router.get('/:id_pedido', (req, res, next) => {
  const id = req.params.id_pedido
  res.status(200).send({
    message: 'Você passou um ID',
    id: id
  })
})

// Delete a order
router.delete('/', (req, res, next) => {
  res.status(201).send({
    message: 'Usando o DELETE'
  })
})

module.exports = router