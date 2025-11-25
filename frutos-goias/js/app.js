const DB_KEY = 'frutosGoiasDB';

// --- Funções de persistência de dados ---

function getDB() {
    const dbRaw = localStorage.getItem(DB_KEY);
    // Se não existir nada salvo, cria a estrutura inicial correta
    if (!dbRaw) {
        const initialDB = {
            produtos: [],
            carrinho: [],
            proximoIdProduto: 1
        };
        localStorage.setItem(DB_KEY, JSON.stringify(initialDB));
        return initialDB;
    }
    return JSON.parse(dbRaw);
}

function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function navigate(url) {
    window.location.href = url;
}

const formatarMoeda = (valor) => {
    // Garante que o valor seja um número antes de formatar
    const numero = parseFloat(valor);
    if (isNaN(numero)) return "R$ 0,00";
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
};