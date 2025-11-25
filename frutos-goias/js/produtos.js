// --- Lógica para produto-novo.html ---
function CadastroProduto() {
    const form = document.getElementById('form-cadastro');

    if (!form) return; 

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        // Pega os valores dos inputs
        const nome = document.getElementById('nome').value;
        const codigo = document.getElementById('codigo').value.trim(); 
        
        // troca vírgula por ponto
        const custoStr = document.getElementById('custo').value.replace(',', '.');
        const valorStr = document.getElementById('valor').value.replace(',', '.');
        const qtdStr = document.getElementById('qtd').value;
        
        const quantidade = parseInt(qtdStr || 0);
        const custo = parseFloat(custoStr || 0);
        const valor = parseFloat(valorStr || 0);

        // --- VALIDAÇÕES ---
        
        // 1. Verifica campos obrigatórios básicos
        if (!nome || valor <= 0) {
            alert('Por favor, preencha o Nome e o Valor de Venda corretamente.');
            return;
        }

        // 2. Verifica se o código foi digitado 
        if (!codigo) {
            alert('Atenção: O Código do Produto é obrigatório.');
            return;
        }

        const db = getDB();

        // 3. Verifica se já existe um produto com esse mesmo código/ID
        const produtoExistente = db.produtos.find(p => p.id === codigo);
        if (produtoExistente) {
            alert(`Erro: Já existe um produto cadastrado com o código "${codigo}". Use outro código.`);
            return;
        }

        // Cria o objeto do produto usando o código como ID
        const novoProduto = {
            id: codigo,         
            codigo: codigo,     
            nome: nome,
            custo: custo,
            valor: valor,
            quantidade: quantidade
        };

        db.produtos.push(novoProduto);
        saveDB(db);

        alert(`Produto "${nome}" (Cód: ${codigo}) cadastrado com sucesso!`);
        navigate('produtos.html');
    });
}

// --- Lógica para produtos.html (Listagem) ---
function ListagemProdutos() {
    const tabelaBody = document.getElementById('tabelaprodutos');
    if (!tabelaBody) return;

    const db = getDB();
    tabelaBody.innerHTML = '';
    
    if (db.produtos.length === 0) {
        tabelaBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px">Nenhum produto cadastrado.</td></tr>';
        return;
    }

    db.produtos.forEach(produto => {
        const row = document.createElement('tr');
        
        // Calcula o custo total daquele estoque
        const valorCustoTotal = produto.custo * produto.quantidade; 

        row.innerHTML = `
            <td>${produto.id}</td>
            <td><strong>${produto.nome}</strong></td>
            <td>${formatarMoeda(produto.valor)}</td>
            <td>${produto.quantidade}</td>
            <td style="color:#888">${formatarMoeda(valorCustoTotal)}</td>
            <td>-</td>
            <td class="acoes" style="text-align:right">
                <div class="acao-ic bad" title="Remover" onclick="removerProduto('${produto.id}')">✖</div>
            </td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Função para remover

window.removerProduto = function(id) {
    if (confirm(`Tem certeza que deseja remover o produto código "${id}"?`)) {
        const db = getDB();
        // Filtra removendo o item que tem esse ID
        db.produtos = db.produtos.filter(p => p.id != id);
        saveDB(db);
        ListagemProdutos();
    }
}

// Inicializa a função correta dependendo da tela
document.addEventListener('DOMContentLoaded', () => {
    CadastroProduto();
    ListagemProdutos();
});