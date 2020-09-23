const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

// Get all products
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      'SELECT * FROM produtos;',
      (error, resultado, fields) => {
        if (error) { return res.status(500).send({ error })}

        return res.status(200).send({ response: resultado })
      }
    )
  })
})

// Insert product
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}
    conn.query(
      'INSERT INTO produtos (nome, preco) VALUES (?,?)',
      [req.body.nome, req.body.preco],
      (error, resultado, field) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        res.status(201).send({
          mensagem: "Produto inserido",
          id_produto: resultado.insertId
        })
      } 
    )
  })
})

// Get product
router.get('/:id_produto', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?;',
      [req.params.id_produto],
      (error, resultado, fields) => {
        if (error) { return res.status(500).send({ error })}

        return res.status(200).send({ response: resultado })
      }
    )
  })
})

// Update a product
router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      `UPDATE produtos 
        SET nome          = ?,
            preco         = ?
        WHERE id_produto  = ?`,
      [
        req.body.nome, 
        req.body.preco,
        req.body.id_produto
      ],
      (error, resultado, field) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        res.status(202).send({
          mensagem: "Produto alterado com sucesso",
        })
      } 
    )
  })
})


// Delete a product
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { res.status(500).send({ error })}

    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [req.body.id_produto],
      (error, resultado, fields) => {
        conn.release()
        if (error) { res.status(500).send({ error }) }

        res.status(202).send({
          message: "Produto excluído"
        })
      }
    )
  })
})

module.exports = router