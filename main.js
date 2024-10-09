const nome = document.getElementById("NomeTarefa")
const descricao = document.getElementById("DescricaoTarefa")
const Tarefas = document.getElementById("Tarefas")
const ListaTarefas = document.getElementById("To-DoList")


carregarTarefa()

Tarefas.addEventListener("submit", function (evento) {
  evento.preventDefault()
  const nomeTarefa = nome.value
  const descricaoTarefa = descricao.value
  const Concluir = "False"

  criarTarefa(nomeTarefa, descricaoTarefa, Concluir)
})

async function criarTarefa(nome, descricao, Concluir) {
  const resposta = await fetch("http://localhost:3000/List", {
    method: "POST",
    headers: {'Content-Type':"aplicattion/json"},
    body: JSON.stringify({nome,descricao, Concluir})
  })

  if (!resposta.ok) {
    console.log(`Aconteceu um erro! ${resposta.status} - ${resposta.statusText}`)
  } else {
    carregarTarefa()
  }
}

async function carregarTarefa() {
  const resposta = await fetch("http://localhost:3000/List")
  const tarefas = await resposta.json()

  console.log(tarefas)
  exibirTarefas(tarefas)
}

async function exibirTarefas(tarefas) {
  ListaTarefas.innerHTML = ""
  tarefas.forEach((tarefa) => {
    const cardsTarefas = document.createElement("li")

    const titulo = document.createElement("h3")
    titulo.textContent = tarefa.nome

    const descricao = document.createElement("p")
    descricao.textContent = tarefa.descricao
    
    const botoes = document.createElement("div")

    const editar = document.createElement("button")
    editar.textContent = "Editar Descricao"
    editar.addEventListener("click", () => editarTarefa(tarefa))

    const excluir = document.createElement("button")
    excluir.textContent = "Deletar"
    excluir.addEventListener("click", () => deletarTarefa(tarefa.id))

    botoes.append(editar, excluir)
    

    if (tarefa.Concluir == "False")  {
      const concluir = document.createElement("button")
      concluir.textContent = "Concluido"
      concluir.addEventListener("click", () => Concluido(tarefa))

      botoes.append(concluir)
    } else {
      pintarTarefa(cardsTarefas)
    }
    


    cardsTarefas.append(titulo, descricao, botoes)
    ListaTarefas.append(cardsTarefas)
  });
}

async function editarTarefa(tarefa) {
  const descricaoTarefa = prompt("Digite a nova descrição da tarefa: ")

  const body = JSON.stringify({descricao: descricaoTarefa})

  await fetch(`http://localhost:3000/List/${tarefa.id}`, {
    method:"PATCH",
    headers: {'Content-Type':"application/json"},
    body
  })
}

async function deletarTarefa(id) {
  await fetch(`http://localhost:3000/List/${id}`, {
    method: "DELETE"
  })
}

async function Concluido(tarefa) {

  const body = JSON.stringify({Concluir: "True"})

  await fetch(`http://localhost:3000/List/${tarefa.id}`, {
    method:"PATCH",
    headers: {'Content-Type':"application/json"},
    body
  })
  
}

async function pintarTarefa(cardsTarefas) {
  cardsTarefas.className = "Concluido"

}