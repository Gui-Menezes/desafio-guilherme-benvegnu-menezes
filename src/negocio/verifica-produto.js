import { menu } from "../dados/menu.js";

function verificaProduto(nomeProduto) {
  const produtoExistente = menu.find((item) => item.codigo === nomeProduto);

  if (!produtoExistente) {
    throw "Item inválido!";
  }

  return produtoExistente;
}

export { verificaProduto };
