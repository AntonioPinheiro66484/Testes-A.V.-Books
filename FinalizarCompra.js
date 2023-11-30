const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let carrinho = [];
let pedido = [];
let valorTotal = 0;
let valorFrete = 0;
let prazoEntrega = 7;
let imprevisto = false;
let cancelarPedido = false;

function adicionarItem() {
  rl.question("Digite o nome do produto: ", (nome) => {
    rl.question("Digite o preço do produto: ", (preco) => {
      rl.question("Digite a quantidade do produto: ", (quantidade) => {
        let precoFloat = parseFloat(preco);
        let quantidadeInt = parseInt(quantidade);

        // Verifica se a quantidade desejada é maior que 10
        if (quantidadeInt > 10) {
          console.log("Quantidade de produto fora de estoque. Tente novamente com uma quantidade menor.");
          menu();
          return;
        }

        let index = carrinho.findIndex(item => item.nome === nome);

        if (index !== -1) {
          carrinho[index].quantidade += quantidadeInt;
          carrinho[index].precoTotal += precoFloat * quantidadeInt;
        } else {
          carrinho.push({
            nome: nome,
            preco: precoFloat,
            quantidade: quantidadeInt,
            precoTotal: precoFloat * quantidadeInt
          });
        }

        // Zera o valorTotal antes de recalcular
        valorTotal = 0;
        for (let item of carrinho) {
          valorTotal += item.precoTotal;
        }

        exibirCarrinho();
        menu();
      });
    });
  });
}
function excluirItem() {
  if (carrinho.length === 0) {
    console.log("Erro: Não é possível excluir itens do carrinho vazio.");
    menu();
    return;
  }

  rl.question("Digite o nome do produto que deseja excluir: ", (nome) => {
    rl.question("Digite a quantidade a ser excluída: ", (quantidadeExcluir) => {
      let quantidadeInt = parseInt(quantidadeExcluir);
      let index = carrinho.findIndex(item => item.nome === nome);

      if (index !== -1) {
        if (quantidadeInt <= carrinho[index].quantidade) {
          carrinho[index].quantidade -= quantidadeInt;
          carrinho[index].precoTotal -= carrinho[index].preco * quantidadeInt;

          if (carrinho[index].quantidade === 0) {
            carrinho.splice(index, 1);
          }
        } else {
          console.log("Erro: Quantidade a ser excluída é maior do que a quantidade no carrinho.");
        }
      } else {
        console.log("Erro: Produto não encontrado no carrinho.");
      }

      // Zera o valorTotal antes de recalcular
      valorTotal = 0;
      for (let item of carrinho) {
        valorTotal += item.precoTotal;
      }

      exibirCarrinho();
      menu();
    });
  });
}

function calcularFrete() {
  if (carrinho.length === 0) {
    console.log("Erro: Não é possível calcular o frete com o carrinho vazio.");
    menu();
    return;
  }

  rl.question("Digite o estado de entrega: ", (estado) => {
    if (estado.toLowerCase() === "sp") {
      valorFrete = 0;
      console.log(`Frete Grátis para São Paulo! Valor Total da Compra: R$ ${valorTotal.toFixed(2)}`);
      escolherFormaPagamento();
    } else {
      // Altera para 15% de frete para outros estados
      valorFrete = valorTotal * 0.15;
      valorTotal += valorFrete;
      console.log(`Frete para ${estado}: R$ ${valorFrete.toFixed(2)}. Valor Total da Compra: R$ ${valorTotal.toFixed(2)}`);
      escolherFormaPagamento();
    }
  });
}

function escolherFormaPagamento() {
  if (carrinho.length === 0) {
    console.log("Erro: Não é possível finalizar a compra com o carrinho vazio.");
    menu();
    return;
  }

  rl.question("Escolha a forma de pagamento (1 - Boleto, 2 - Cartão de Crédito, 3 - Débito): ", (opcaoPagamento) => {
    switch (opcaoPagamento) {
      case "1":
        aplicarDescontoBoleto();
        break;
      case "2":
        escolherParcelasCartao();
        break;
      case "3":
        finalizarCompra();
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
        escolherFormaPagamento();
    }
  });
}


function aplicarDescontoBoleto() {
  let descontoBoleto = valorTotal * 0.10;
  valorTotal -= descontoBoleto;
  console.log(`Desconto de 10% para pagamento com boleto. Total a pagar: R$ ${valorTotal.toFixed(2)}`);

  finalizarCompra();
}

function escolherParcelasCartao() {
  rl.question("Digite o número de parcelas desejadas (até 5x sem juros): ", (numParcelas) => {
    let parcelas = parseInt(numParcelas);

    if (parcelas >= 1 && parcelas <= 5) {
      let valorParcela = valorTotal / parcelas;
      console.log(`Pagamento em ${parcelas}x sem juros. Valor de cada parcela: R$ ${valorParcela.toFixed(2)}`);
      finalizarCompra();
    } else {
      console.log("Número de parcelas inválido. Tente novamente.");
      escolherParcelasCartao();
    }
  });
}

function finalizarCompra() {
  console.log("====================");
  console.log(`Valor Total da Compra: R$ ${valorTotal.toFixed(2)}`);
  
  // Se o pedido foi cancelado, informa que o valor será devolvido
  if (cancelarPedido) {
    console.log("Compra cancelada. O valor total será devolvido.");
  } else {
    console.log("Compra Finalizada! Obrigado!");

    // Adiciona os itens do carrinho ao pedido com o status "a caminho"
    for (let item of carrinho) {
      pedido.push({ ...item, status: "a caminho" });
    }

    // Aumenta a probabilidade de imprevistos
    aumentarProbabilidadeImprevistos();

    // Inicia o prazo de entrega com a pergunta para cancelar o pedido
    iniciarPrazoEntrega();
  }
}

function aumentarProbabilidadeImprevistos() {
  // Aumenta a probabilidade de imprevistos para 70%
  imprevisto = Math.random() < 0.7;
}

function perguntarCancelarPedido() {
  rl.question("Deseja cancelar o pedido? (s/n): ", (resposta) => {
    if (resposta.toLowerCase() === "s") {
      cancelarPedido = true;
      console.log("Pedido cancelado! Status: Cancelado");
    } else {
      // Se o usuário decidir não cancelar, continua a contagem do prazo de entrega
      iniciarPrazoEntrega();
    }
  });
}

function iniciarPrazoEntrega() {
  console.log(`Prazo de entrega estimado: ${prazoEntrega} dias`);

  // Se ocorreu um imprevisto, aumenta a probabilidade de cancelamento
  if (imprevisto) {
    console.log("Ocorreu um imprevisto. O prazo de entrega pode ser afetado.");

    // Pergunta ao usuário se deseja cancelar o pedido
    perguntarCancelarPedido();
  }

  // Inicia o contador do prazo de entrega apenas se o pedido não foi cancelado
  if (!cancelarPedido) {
    contarPrazoEntrega();
  }
}

function contarPrazoEntrega() {
  if (prazoEntrega > 0 && !cancelarPedido) {
    prazoEntrega--;

    // Se ocorreu um imprevisto, aumenta o prazo de entrega em 3 dias
    if (imprevisto) {
      console.log("Ocorreu um imprevisto. O prazo de entrega foi aumentado em 3 dias.");
      prazoEntrega += 3;
      imprevisto = false;
    }

    console.log(`Prazo de entrega restante: ${prazoEntrega} dias`);

    // Se o prazo de entrega chegou a 0, o pedido foi entregue
    if (prazoEntrega === 0) {
      console.log("Pedido entregue! Status: Concluído");
      rl.close();
    } else {
      // Continua contando o prazo de entrega
      setTimeout(contarPrazoEntrega, 1000);
    }
  } else {
    // Se o prazo de entrega chegou a 0 ou o pedido foi cancelado, encerra o processo
    if (!cancelarPedido) {
      console.log("Pedido entregue! Status: Concluído");
    }
    rl.close();
  }
}

function exibirCarrinho() {
  console.log("Carrinho de Compras:");
  console.log("====================");

  for (let item of carrinho) {
    console.log(`${item.nome} - R$ ${item.preco.toFixed(2)} x ${item.quantidade} = R$ ${item.precoTotal.toFixed(2)}`);
  }

  console.log("====================");
  console.log(`Subtotal: R$ ${valorTotal.toFixed(2) - valorFrete.toFixed(2)}`);
  console.log(`Frete: R$ ${valorFrete.toFixed(2)}`);
  console.log(`Valor Total: R$ ${valorTotal.toFixed(2)}`);
}

function menu() {
  rl.question("Digite 1 para adicionar um item, 2 para excluir um item, 3 para calcular frete, 4 para sair: ", (acao) => {
    switch (acao) {
      case "1":
        adicionarItem();
        break;
      case "2":
        excluirItem();
        break;
      case "3":
        calcularFrete();
        break;
      case "4":
        rl.close();
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
        menu();
    }
  });
}

menu();

