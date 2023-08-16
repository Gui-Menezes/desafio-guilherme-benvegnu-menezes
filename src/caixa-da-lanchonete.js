import { formaDePagamento } from "./negocio/forma-pagamento.js";
import { validarPagamento } from "./negocio/validar-pagamento.js";
import { itensPedidos } from "./negocio/itens-pedidos.js";

class CaixaDaLanchonete {
  calcularValorDaCompra(metodoDePagamento, itens) {
    try {
      if (validarPagamento(metodoDePagamento)) {
        const valorCompra = itensPedidos(itens);
        const valorFinal = formaDePagamento(metodoDePagamento, valorCompra);
        return "R$ " + valorFinal;
      }
    } catch (err) {
      return err;
    }
  }
}

export { CaixaDaLanchonete };
