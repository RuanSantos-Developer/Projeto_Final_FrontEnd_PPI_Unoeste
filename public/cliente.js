const formulario = document.getElementById('FormClientes');

formulario.onsubmit = gravarCliente;

mostrarTabelaClientes()



function gravarCliente(event) {

    if(validarFormulario()) {

        const cpf = document.getElementById('cpf').value;
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;

        console.log(`Nome: ${nome} - Email: ${email} - Telefone: ${telefone}`);

        fetch('http://localhost:3000/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: cpf
            })
        })
        .then((res) =>{return res.json()})
        .then((data) => {
            if(data.status){
                formulario.reset();
                mostrarTabelaClientes();
            }
            alert(data.mensagem);
        })
        .catch((error) => {
            console.error('Erro ao cadastrar cliente:', error);
        });
    }
        event.stopPropagation();
        event.preventDefault();


}

function validarFormulario() {

    const formvalidado = formulario.checkValidity();

    if (formvalidado) {

        formulario.classList.remove('was-validated');

    } else {
        
        formulario.classList.add('was-validated');
    }
    return formvalidado;
}

function deletarCliente(id){
    if(confirm("Deseja realmente deletar o cliente de ID " + id + "?")){
        fetch("http://localhost:3000/clientes/" + id, {
            method: "DELETE",
        }).then((res) => {return res.json()})
        .then((data) => {
            if(data.status){
                mostrarTabelaClientes();
            }
             alert(data.mensagem);
        })
        .catch((error) => {
            console.error("Erro ao deletar cliente:", error);
        });
    }
}

function mostrarTabelaClientes(){
    const espacotabela = document.getElementById("tabelaClientes");
    espacotabela.innerHTML = "";

    

    fetch("http://localhost:3000/clientes", {
        method: "GET",

}).then((res) => {
    if(res.ok){
    return res.json()
    }
}).then((data) => {
    if(data.status){
    const tabela = document.createElement("table");
    tabela.className = "table table-striped table-hover";

    const cabecalho = document.createElement("thead");
    cabecalho.innerHTML = `
        <tr>
            <th>ID</th>
            <th>CPF</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
        </tr>
    `;
    tabela.appendChild(cabecalho);

    const corpoTabela = document.createElement("tbody");
    for(const cliente of data.clientes){
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${cliente.cli_id}</td>
            <td>${cliente.cli_cpf}</td>
            <td>${cliente.cli_nome}</td>
            <td>${cliente.cli_email}</td>
            <td>${cliente.cli_telefone}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deletarCliente(${cliente.cli_id})">Deletar</button>
                <button class="btn btn-warning btn-sm" onclick="editarCliente(${cliente.cli_id})">Editar</button>
            </td>
        `;
        corpoTabela.appendChild(linha);
    }
    tabela.appendChild(corpoTabela);
    espacotabela.appendChild(tabela);
    }
    })
    .catch((error) => {
        console.error("Erro ao carregar clientes:", error);
    });
}