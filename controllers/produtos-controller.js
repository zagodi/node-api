const mysql = require('../mysql').pool

exports.getProdutos = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      'SELECT * FROM produtos;',
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error })}
        const response = {
          quantidade: result.length,
          produtos: result.map((prod) => {
            return {
              id_produto: prod.id_produto,
              nome: prod.nome,
              preco: prod.preco,
              imagem_produto: prod.imagem_produto,
              request: {
                tipo: 'GET',
                descricao: 'Retorna os detalhes de um produto',
                url: 'http://localhost/3000/produtos/' + prod.id_produto
              }
            }
          })
        }
        return res.status(200).send(response)
      }
    )
  })
}

exports.postProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}
    conn.query(
      'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?, ?, ?)',
      [req.body.nome, req.body.preco, req.file.path],
      (error, result, field) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        const response = {
          mensagem: "Produto inserido com sucesso",
          produtoCriado: {
            id_produto: result.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/produtos"
            }
          }
        }

        res.status(201).send(response)
      } 
    )
  })
}

exports.getProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error })}

    conn.query(
      'SELECT * FROM produtos WHERE id_produto = ?;',
      [req.params.id_produto],
      (error, result, fields) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        if (resultado.length == 0) {
          return res.status(404).send({
            mensagem: "Produto não encontrado"
          })
        }

        const response = {
          produto: {
            id_produto: result[0].id_produto,
            nome: result[0].nome,
            preco: result[0].preco,
            request: {
              tipo: "GET",
              descricao: "Retorna todos os produtos",
              url: "http://localhost:3000/produtos"
            }
          }
        }

        return res.status(200).send(response)
      }
    )
  })
}

exports.updateProduto = (req, res, next) => {
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
      (error, result, field) => {
        conn.release() // IMPORTATE
        if (error) { return res.status(500).send({ error })}

        const response = {
          mensagem: "Produto atualizado com sucesso",
          produtoAtualizado: {
            id_produto: req.body.id_produto,
            nome: req.body.nome,
            preco: req.body.preco,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um produto",
              url: "http://localhost:3000/produtos" + req.body.id_produto
            }
          }
        }

        res.status(202).send(response)
      } 
    )
  })
}

exports.deleteProduto = (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { res.status(500).send({ error })}

    conn.query(
      'DELETE FROM produtos WHERE id_produto = ?',
      [req.body.id_produto],
      (error, result, fields) => {
        conn.release()
        if (error) { res.status(500).send({ error }) }

        const response = {
          mensagem: "Produto removido",
          request: {
            tipo: 'POST',
            descricao: "Insere um produto",
            url: "http://localhost:3000/produtos",
            body: {
              nome: "String",
              preco: "Number"
            }
          }
        }

        res.status(202).send(response)
      }
    )
  })
}