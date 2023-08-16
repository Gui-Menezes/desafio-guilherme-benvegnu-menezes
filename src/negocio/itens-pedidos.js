import { verificaProduto } from "./verifica-produto.js";

function itensPedidos(itens) {
  if (itens && itens.length > 0) {
    let resultado = 0;
    const listaPedido = [];

    for (const item of itens) {
      const [produto, quantidade] = item.split(",");

      if (!produto || !quantidade) {
        throw "Item inválido!";
      }
      const quantidadeInt = parseInt(quantidade.trim(), 10);

      if (quantidadeInt != 0) {
        const produtoExistente = verificaProduto(produto);

        listaPedido.push(produtoExistente.codigo);

        const valorProduto = parseFloat(
          produtoExistente.valor.replace(",", ".")
        );

        const valorTotalDaCompra = valorProduto * quantidadeInt;

        resultado += valorTotalDaCompra;
      } else {
        throw "Quantidade inválida!";
      }
    }
    if (
      (!listaPedido.includes("cafe") && listaPedido.includes("chantily")) ||
      (!listaPedido.includes("sanduiche") && listaPedido.includes("queijo"))
    ) {
      throw "Item extra não pode ser pedido sem o principal";
    }
    return resultado;
  } else {
    throw "Não há itens no carrinho de compra!";
  }
}

export { itensPedidos };
