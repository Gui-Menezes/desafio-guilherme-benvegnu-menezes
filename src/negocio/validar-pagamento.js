function validarPagamento(metodoDePagamento) {
  const pagamentos = ["debito", "credito", "dinheiro"];
  if (pagamentos.includes(metodoDePagamento)) {
    return true;
  } else {
    throw "Forma de pagamento inválida!";
  }
}

export { validarPagamento };
