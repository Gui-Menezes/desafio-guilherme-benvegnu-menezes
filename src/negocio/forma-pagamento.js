function formaDePagamento(pagamento, valorCompra) {
  switch (pagamento) {
    case "dinheiro":
      const resultadoDinheiro = valorCompra * 0.95;
      return resultadoDinheiro.toFixed(2).toString().replace(".", ",");
    case "credito":
      const resultadoCredito = valorCompra * 1.03;
      return resultadoCredito.toFixed(2).toString().replace(".", ",");
    case "debito":
      return valorCompra.toFixed(2).toString().replace(".", ",");
  }
}

export { formaDePagamento };
