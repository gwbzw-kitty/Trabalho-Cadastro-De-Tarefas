const urlBase = 'http://159.65.228.63/';
let recursos = [];

function mostrar(qual) {
    document.getElementById("lista").classList.add("hidden");
    document.getElementById("cadastro").classList.add("hidden");
    document.getElementById(qual).classList.remove("hidden");

    if (qual === "lista") carregarTarefas();
}

async function carregarTarefas() {
    const resp = await fetch(urlBase + "tarefas");
    const tarefas = await resp.json();

    const area = document.getElementById("areaLista");
    area.innerHTML = "";

    if (tarefas.length === 0) {
        area.innerHTML = `<p class="msg">Nenhuma tarefa cadastrada</p>`;
        return;
    }

    const tabela = document.createElement("table");

    const header = document.createElement("tr");
    ["ID", "Prioridade", "Descrição", "Local", "Data Limite", "Matrícula", "Recursos"]
        .forEach(txt => {
            const th = document.createElement("th");
            th.textContent = txt;
            header.appendChild(th);
        });
    tabela.appendChild(header);

    for (const t of tarefas) {
        const row = document.createElement("tr");

        const tdId = document.createElement("td");
        tdId.textContent = t.id;

        const tdPri = document.createElement("td");
        tdPri.textContent = t.prioridade;
        if (t.prioridade === "Urgente") tdPri.classList.add("urgente");

        const tdDesc = document.createElement("td");
        tdDesc.textContent = t.descricao;

        const tdLocal = document.createElement("td");
        tdLocal.textContent = t.local;

        const tdData = document.createElement("td");
        tdData.textContent = t.dataLimite;

        const tdMat = document.createElement("td");
        tdMat.textContent = t.matricula;

        const tdRec = document.createElement("td");
        tdRec.textContent = t.recursosNecessarios.join(", ");

        row.appendChild(tdId);
        row.appendChild(tdPri);
        row.appendChild(tdDesc);
        row.appendChild(tdLocal);
        row.appendChild(tdData);
        row.appendChild(tdMat);
        row.appendChild(tdRec);

        tabela.appendChild(row);
    }

    area.appendChild(tabela);
}

setInterval(() => {
    if (!document.getElementById("lista").classList.contains("hidden")) {
        carregarTarefas();
    }
}, 3000);


function addRecurso() {
    const r = document.getElementById("recursoTemp").value.trim();
    if (r === "") return;

    recursos.push(r);

    const li = document.createElement("li");
    li.textContent = r;
    document.getElementById("listaRecursos").appendChild(li);

    document.getElementById("recursoTemp").value = "";
}

async function salvarTarefa() {
    const prioridade = document.getElementById("prioridade").value;
    const descricao = document.getElementById("descricao").value.trim();
    const local = document.getElementById("local").value.trim();
    const data = document.getElementById("data").value;
    const matricula = document.getElementById("matricula").value.trim();

    if (!prioridade || !descricao || !local || !data || !matricula) {
        alert("Preencha corretamente");
        return;
    }

    const tarefa = {
        prioridade,
        descricao,
        local,
        dataLimite: data,
        matricula: parseInt(matricula),
        recursosNecessarios: recursos
    };

    await fetch(urlBase + "tarefas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(tarefa)
    });

    alert("Tarefa salva ");

    recursos = [];
    document.getElementById("listaRecursos").innerHTML = "";

    mostrar("lista");
}