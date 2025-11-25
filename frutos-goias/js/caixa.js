// --- Logica para abrir-caixa.html  ---
function atualizarTabelaCaixa() {
    const db = getDB();
    const tabelaBody = document.getElementById('tabela-caixa-body'); 
    const totalTag = document.getElementById('total-venda'); 
    
    if (!tabelaBody || !totalTag) return;

    tabelaBody.innerHTML = '';
    let subtotal = 0;

    db.carrinho.forEach((item, index) => {
        const totalItem = item.valor * item.quantidade;
        subtotal += totalItem;
        const row = tabelaBody.insertRow();
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${formatarMoeda(item.valor)}</td>
            <td>${item.quantidade}x</td>
            <td>${formatarMoeda(totalItem)}</td>
            <td></td>
            <td class="acoes" style="text-align:right">
                <div class="acao-ic" title="Editar">✎</div>
                <div class="acao-ic bad" title="Remover" data-index="${index}">✖</div>
            </td>
        `;
    });

    totalTag.textContent = formatarMoeda(subtotal);
}

function initCaixa() {
    const inputBusca = document.querySelector('.busca input');
    const btnPagar = document.getElementById('btn-pagar');
    const btnDeletar = document.getElementById('btn-deletar');
    const tabelaBody = document.getElementById('tabela-caixa-body');

    if (!inputBusca) return;

    // --- Adicionar Item ao Carrinho ---
    inputBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const termoBusca = inputBusca.value.trim();
            const idDigitado = parseInt(termoBusca);

            const db = getDB();
            const produtoEncontrado = db.produtos.find(p => p.id === idDigitado || p.codigo === termoBusca);

            if (produtoEncontrado) {
                // adiciona o item no carrinho
                const itemExistente = db.carrinho.find(item => item.id === produtoEncontrado.id);
                
                if (itemExistente) {
                    itemExistente.quantidade++;
                } else {
                    db.carrinho.push({
                        id: produtoEncontrado.id,
                        nome: produtoEncontrado.nome,
                        valor: produtoEncontrado.valor,
                        quantidade: 1
                    });
                }
                saveDB(db);
                atualizarTabelaCaixa();
                inputBusca.value = '';
            } else {
                alert('Produto não encontrado. Tente buscar pelo ID ou Código.');
            }
        }
    });

    // --- Remover Item do Carrinho ---
    tabelaBody.addEventListener('click', (e) => {
        if (e.target.title === 'Remover') {
            const index = parseInt(e.target.dataset.index);
            const db = getDB();
            db.carrinho.splice(index, 1);
            saveDB(db);
            atualizarTabelaCaixa();
        }
    });

    // --- Deletar Venda (Esvaziar Carrinho) ---
    btnDeletar.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Deseja realmente deletar esta venda?')) {
            const db = getDB();
            db.carrinho = [];
            saveDB(db);
            atualizarTabelaCaixa();
        }
    });

    // --- Botão Pagar ---
    btnPagar.addEventListener('click', (e) => {
        e.preventDefault();
        const db = getDB();
        if (db.carrinho.length === 0) {
            alert('Adicione produtos para pagar.');
            return;
        }
        navigate('pagamento.html');
    });

    // Inicializa o carrinho ao carregar a página
    atualizarTabelaCaixa();
}

// --- Lógica para pagamento.html ---
function initPagamento() {
    const boxPills = document.querySelector('.boxPagamento');
    const btnFinalizarPag = document.getElementById('btn-finalizar-pag');

    if (!boxPills) return;

    const db = getDB();
    let total = 0;
    db.carrinho.forEach(item => total += item.valor * item.quantidade);

    // Atualiza os resumos
    const subtotalPill = document.getElementById('total-subtotal');
    const totalPill = document.getElementById('total-final');
    const diferencaPill = document.getElementById('total-diferenca');

    if (subtotalPill && totalPill && diferencaPill) {
        subtotalPill.textContent = formatarMoeda(total);
        totalPill.textContent = formatarMoeda(total);
        diferencaPill.textContent = formatarMoeda(total); 
    }

    // Finaliza a venda e limpa o carrinho
    btnFinalizarPag.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Confirmar o pagamento e finalizar a venda?')) {
            const db = getDB();
            
            // Simulação de baixa de estoque e registro da venda
            db.carrinho.forEach(carrinhoItem => {
                const produtoEmEstoque = db.produtos.find(p => p.id === carrinhoItem.id);
                if (produtoEmEstoque) {
                    produtoEmEstoque.quantidade -= carrinhoItem.quantidade;
                }
            });

            db.carrinho = []; // Limpa o carrinho
            saveDB(db);
            alert('Venda finalizada com sucesso! Estoque atualizado.');
            navigate('abrir-caixa.html');
        }
    });
}


// Inicializa a função correta
document.addEventListener('DOMContentLoaded', () => {
    if (document.title.includes('Abrir Caixa')) {
        initCaixa();
    }
    if (document.title.includes('Pagamento')) {
        initPagamento();
    }
});