const mysql = require('../mysql')

exports.deleteImagem = async (req, res, next) => {
  try {
    const query = 'DELETE FROM imagens_produtos WHERE id_imagem = ?'
    await mysql.execute(query, [req.params.id_imagem])

    const response = {
      mensagem: "Imagem removida",
    }

    return res.status(202).send(response)    
  } catch (error) {
    res.status(500).send({ error })
  }
}