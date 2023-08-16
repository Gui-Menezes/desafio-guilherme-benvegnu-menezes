import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";
import { formaDePagamento } from "./negocio/forma-pagamento.js";
import { verificaProduto } from "./negocio/verifica-produto.js";
import { menu } from "./dados/menu.js";
import { validarPagamento } from "./negocio/validar-pagamento.js";
import { itensPedidos } from "./negocio/itens-pedidos.js";

describe('CaixaDaLanchonete', () => {

    const validaTeste = (formaDePagamento, resultadoEsperado, itens) => {
        const resultado = new CaixaDaLanchonete()
            .calcularValorDaCompra(formaDePagamento, itens);

        expect(resultado.replace("\xa0", " ")).toEqual(resultadoEsperado);
    };

    test.each([
        ['com carrinho vazio', 'dinheiro', 'Não há itens no carrinho de compra!', []],
        ['com carrinho vazio', 'credito', 'Não há itens no carrinho de compra!', []],
        ['com carrinho vazio', 'debito', 'Não há itens no carrinho de compra!', []],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));

    test.each([
        ['dinheiro', 'R$ 2,85', ['cafe,1']],
        ['credito', 'R$ 3,09', ['cafe,1']],
        ['debito', 'R$ 3,00', ['cafe,1']],
    ])('compra simples em %p deve resultar em %p', validaTeste);

    test.each([
        ['credito', 'R$ 11,85', ['cafe,1', 'sanduiche,1', 'queijo,1']],
        ['debito', 'R$ 11,50', ['cafe,1', 'sanduiche,1', 'queijo,1']],
    ])('compra de 3 itens em %p deve resultar em %p', validaTeste);

    test.each([
        ['dinheiro', 'R$ 33,73', ['cafe,4', 'sanduiche,3', 'queijo,2']],
        ['credito', 'R$ 36,56', ['cafe,4', 'sanduiche,3', 'queijo,2']],
        ['debito', 'R$ 35,50', ['cafe,4', 'sanduiche,3', 'queijo,2']],
    ])('compra de múltiplas quantidades em %p deve resultar em %p', validaTeste);

    test.each([
        ['com quantidade zero', 'dinheiro', 'Quantidade inválida!', ['cafe,0']],
        ['com um valor', 'credito', 'Item inválido!', ['1']],
        ['com código inexistente', 'debito', 'Item inválido!', ['pizza, 1']],
        ['com forma de pagamento inválida', 'especie', 'Forma de pagamento inválida!', ['cafe, 1']],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));

    test.each([
        ['chantily', 'dinheiro', 'Item extra não pode ser pedido sem o principal', ['chantily,1']],
        ['queijo', 'credito', 'Item extra não pode ser pedido sem o principal', ['queijo,1']],
        ['chantily com outro item', 'credito', 'Item extra não pode ser pedido sem o principal', ['chantily,1', 'sanduiche,1']],
        ['queijo com outro item', 'debito', 'Item extra não pode ser pedido sem o principal', ['cafe,1', 'queijo,1']],
    ])('compra %p em %p deve resultar em %p', (_, formaDePagamento, resultadoEsperado, itens) =>
        validaTeste(formaDePagamento, resultadoEsperado, itens));
});


describe('formaDePagamento', () => {
    test('deve calcular o valor com desconto para pagamento em dinheiro', () => {
        const resultado = formaDePagamento('dinheiro', 100);

        // Esperado: (100 * 0.95) = 95
        expect(resultado).toBe('95,00');
    });

    test('deve calcular o valor com acréscimo para pagamento no crédito', () => {
        const resultado = formaDePagamento('credito', 100);

        // Esperado: (100 * 1.03) = 103
        expect(resultado).toBe('103,00');
    });

    test('deve retornar o valor original para pagamento no débito', () => {
        const resultado = formaDePagamento('debito', 100);

        // Esperado: 100
        expect(resultado).toBe('100,00');
    });
});

describe('verificaProduto', () => {

    test('deve retornar o produto existente', () => {
        const produto = verificaProduto('cafe');
        expect(produto).toEqual(menu[0]);
    });

    test('deve lançar um erro para um produto inexistente', () => {
        expect(() => {
            verificaProduto('produto3');
        }).toThrow('Item inválido!');
    });
});

describe('validarPagamento', () => {
    test('deve retornar verdadeiro para métodos de pagamento válidos', () => {
        const metodosValidos = ["debito", "credito", "dinheiro"];

        metodosValidos.forEach((metodo) => {
            const resultado = validarPagamento(metodo);
            expect(resultado).toBe(true);
        });
    });

    test('deve lançar um erro para métodos de pagamento inválidos', () => {
        const metodosInvalidos = ["paypal", "cheque", "pix"];

        metodosInvalidos.forEach((metodo) => {
            expect(() => {
                validarPagamento(metodo);
            }).toThrow('Forma de pagamento inválida!');
        });
    });
});

describe('itensPedidos', () => {
    test('deve calcular o valor total corretamente', () => {
        const itens = ['cafe,2', 'sanduiche,3'];

        const resultado = itensPedidos(itens);

        // Esperado: (3 * 2) + (6.50 * 3) = 25.5
        expect(resultado).toBe(25.5);
    });

    test('deve lançar um erro para item inválido', () => {
        const itens = ['cafe,', ',2', ''];

        itens.forEach((item) => {
            expect(() => {
                itensPedidos([item]);
            }).toThrow('Item inválido!');
        });
    });

    test('deve lançar um erro para quantidade inválida', () => {
        const itens = ['cafe,0', 'sanduiche,3'];

        expect(() => {
            itensPedidos(itens);
        }).toThrow('Quantidade inválida!');
    });

    test('deve lançar um erro para carrinho vazio', () => {
        const itens = [];

        expect(() => {
            itensPedidos(itens);
        }).toThrow('Não há itens no carrinho de compra!');
    });

    test('deve lançar um erro para item extra sem o principal', () => {
        const itens1 = ['chantily,1'];
        const itens2 = ['queijo,1'];
        const itens3 = ['chantily,1', 'sanduiche,1'];
        const itens4 = ['queijo,1', 'cafe,1'];

        [itens1, itens2, itens3, itens4].forEach((itens) => {
            expect(() => {
                itensPedidos(itens);
            }).toThrow('Item extra não pode ser pedido sem o principal');
        });
    });
});