var Pedido = /** @class */ (function () {
    function Pedido() {
        this.status = "Pendente";
        this.dataEntrega = new Date();
    }
    Pedido.prototype.concluirPedido = function () {
        this.status = "Concluído";
    };
    Pedido.prototype.notificarAtraso = function (novoPrazo) {
        this.dataEntrega = novoPrazo;
    };
    Pedido.prototype.cancelarPedido = function () {
        this.status = "Cancelado";
    };
    return Pedido;
}());
var SistemaPedido = /** @class */ (function () {
    function SistemaPedido() {
    }
    SistemaPedido.prototype.visualizarPedido = function (pedido) {
        return "Status do Pedido: ".concat(pedido.status, ", Data de Entrega: ").concat(pedido.dataEntrega.toDateString());
    };
    return SistemaPedido;
}());
// Testes do Fluxo Principal
var pedido = new Pedido();
var sistemaPedido = new SistemaPedido();
// Teste 1: Compra efetuada finalizada com sucesso.
pedido.concluirPedido();
console.log("Teste 1:", pedido.status === "Concluído");
// Teste 2: Sistema realiza a baixa no estoque.
console.log("Teste 2: Visualização do pedido após a compra:", sistemaPedido.visualizarPedido(pedido));
// Teste 3: Cliente retorna status do pedido.
console.log("Teste 3: Status do Pedido após a compra:", sistemaPedido.visualizarPedido(pedido));
// Fluxo Alternativo
// Teste 4: Testar se a data está fora ou dentro do prazo
var novoPrazoDentroDoPrazo = new Date();
var novoPrazoForaDoPrazo = new Date();
novoPrazoForaDoPrazo.setDate(novoPrazoForaDoPrazo.getDate() + 10); // Adiciona 10 dias para simular atraso
pedido.notificarAtraso(novoPrazoDentroDoPrazo);
console.log("Teste 4: Novo prazo dentro do prazo:", pedido.dataEntrega.toDateString() === novoPrazoDentroDoPrazo.toDateString());
// Fluxo de Exceção
// Teste 5: Sistema retorna imprevisto e atualiza seu prazo de entrega
var novoPrazoAposImprevisto = new Date();
novoPrazoAposImprevisto.setDate(novoPrazoAposImprevisto.getDate() + 5); // Adiciona 5 dias para simular novo prazo após imprevisto
console.log("Teste 5: Visualização do pedido após imprevisto:", sistemaPedido.visualizarPedido(pedido));
console.log("Teste 6: Cliente está de acordo com novo prazo?", pedido.dataEntrega.toDateString() === novoPrazoAposImprevisto.toDateString());
// Teste 7: Cancelamento do pedido em caso de discordância do cliente
pedido.cancelarPedido();
console.log("Teste 7: Pedido cancelado após discordância do cliente:", pedido.status === "Cancelado");
