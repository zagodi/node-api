const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

// Get all orders
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      `SELECT pedidos.id_pedido,
        pedidos.quantidade,
        produtos.id_produto,
        produtos.nome,
        produtos.preco
      FROM pedidos
      INNER JOIN produtos
      ON produtos.id_produto = pedidos.id_produto;`,
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error })}
        const response = {
          pedidos: result.map((pedido) => {
            return {
              id_pedido: pedido.id_pedido,
              produto: {
                id_produto: pedido.id_produto,
                nome: pedido.nome,
                preco: predido.preco
              },
              nome: pedido.nome,
              quantidade: pedido.quantidade,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um pedido',
                url: 'http://localhost/3000/pedidos/' + pedido.id_pedido
              }
            }
          })
        }
        return res.status(200).send(response)
      }
    )
  })
})

// Insert order
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}
    conn.query(
      'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
      [req.body.id_produto, req.body.quantidade],
      (error, result, field) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        const response = {
          mensagem: "Pedido criado",
          pedidoCriado: {
            id_pedido: result.id_pedido,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os pedidos",
              url: "http://localhost:3000/pedidos"
            }
          }
        }

        res.status(201).send(response)
      } 
    )
  })
})

// Get order
router.get('/:id_pedido', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      'SELECT * FROM produtos WHERE pedidos = ?;',
      [req.params.id_pedido],
      (error, result, fields) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        if (resultado.length == 0) {
          return res.status(404).send({
            mensagem: "Pedido não encontrado"
          })
        }

        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            quantidade: result[0].quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os pedidos",
              url: "http://localhost:3000/pedidos"
            }
          }
        }

        return res.status(200).send(response)
      }
    )
  })
})

router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      `UPDATE pedidos 
        SET id_produto   = ?,
            quantidade   = ?
        WHERE id_pedido  = ?`,
      [
        req.body.id_produto, 
        req.body.quantidade,
        req.body.id_pedido
      ],
      (error, result, field) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        const response = {
          mensagem: "Pedido atualizado com sucesso",
          pedidoAtualizado: {
            id_pedido: req.body.id_pedido,
            id_produto: req.body.id_produto,
            quantidade: req.body.quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um pedido",
              url: "http://localhost:3000/pedidos" + req.body.id_pedido
            }
          }
        }

        res.status(202).send(response)
      } 
    )
  })
})

// Delete a order
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { res.status(500).send({ error })}

    conn.query(
      'DELETE FROM pedidos WHERE id_pedido = ?',
      [req.body.id_pedido],
      (error, result, fields) => {
        conn.release()
        if (error) { res.status(500).send({ error }) }

        const response = {
          mensagem: "Pedido removido",
          request: {
            tipo: 'POST',
            descricao: "Insere um pedido",
            url: "http://localhost:3000/pedidos",
            body: {
              id_produto: "Number",
              quantidade: "Number"
            }
          }
        }

        res.status(202).send(response)
      }
    )
  })
})

module.exports = router