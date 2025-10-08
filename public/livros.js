const formulario = document.getElementById('FormLivros');

formulario.onsubmit = gravarLivro;

function gravarLivro(event) {

        if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    if (validarFormulario()) {
        const titulo = document.getElementById('titulo').value;
        const autor = document.getElementById('autor').value;
        const idCliente = document.getElementById('idCliente').value;

        console.log("Enviando para o backend:", titulo, autor, idCliente);


        fetch('http://localhost:3000/livros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                liv_titulo: titulo,
                liv_autor: autor,
                cli_cliente: idCliente
            })
            
        })
        .then((res) => res.json())
        .then((data) => {
            alert(data.mensagem);
            if (data.status) {
                formulario.reset();
                mostrarLivros();
            }
        })
        .catch((error) => {
            console.error('Erro ao cadastrar livro:', error);
        });
       

    }

}

function validarFormulario() {
    const formvalidado = formulario.checkValidity();
    formulario.classList.toggle('was-validated', !formvalidado);
    return formvalidado;
}

function deletarLivro(id){
    if(confirm("Deseja realmente deletar o livro de ID " + id + "?")){
        fetch("http://localhost:3000/livros/" + id, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then(data => {
            alert(data.mensagem);
            if(data.status){
                mostrarLivros();
            }
        })
        .catch(error => console.error("Erro ao deletar livro:", error));
    }
}

function mostrarLivros(){
    const espacotabela = document.getElementById("tabelaLivros");
    espacotabela.innerHTML = "";

    fetch("http://localhost:3000/livros", { method: "GET" })
    .then(res => res.json())
    .then(data => {
        if(data.status){
            const tabela = document.createElement("table");
            tabela.className = "table table-striped table-hover";

            const cabecalho = document.createElement("thead");
            cabecalho.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>ID Cliente</th>
                    <th>Nome Cliente</th>
                    <th>Ações</th>
                </tr>
            `;
            tabela.appendChild(cabecalho);

            const corpo = document.createElement("tbody");
            for(const livro of data.livros){
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${livro.id}</td>
                    <td>${livro.titulo}</td>
                    <td>${livro.autor}</td>
                    <td>${livro.cli_id ?? '-'}</td>
                    <td>${livro.nome_cliente ?? 'Não associado'}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deletarLivro(${livro.id})">Deletar</button>
                    </td>
                `;
                corpo.appendChild(linha);
            }
            tabela.appendChild(corpo);
            espacotabela.appendChild(tabela);
        }
    })
    .catch(error => console.error("Erro ao carregar livros:", error));
}

document.addEventListener('DOMContentLoaded', mostrarLivros);
