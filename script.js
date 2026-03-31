// TRAVA DE SEGURANÇA
if (sessionStorage.getItem('topsun_logado') !== 'true') {
    window.location.href = 'login.html';
}

function sairSistema() {
    sessionStorage.removeItem('topsun_logado');
    window.location.href = 'login.html';
}

const regioesDisponiveis = [
    "Oeste SC", "Norte SC", "Serrana SC", "Vale do Itajaí", "Grande Florianópolis", "Sul SC",
    "Noroeste PR", "Centro-Oeste PR", "Centro-Norte PR", "Norte Pioneiro PR", "Centro-Leste PR", "Oeste PR",
    "Sudoeste PR", "Centro-Sul PR", "Sudeste PR", "Grande Curitiba", "Noroeste RS", "Nordeste RS",
    "Centro-Oeste RS", "Centro-Leste RS", "Grande Porto Alegre", "Sudoeste RS", "Sudeste RS",
    "SP", "MT", "RJ", "Microrregião de Jaraguá", "GO", "Vale do Itapocú", "Joinville",
    "São Bento do Sul", "Blumenau", "Brusque", "Itajaí", "Florianópolis", "Criciúma",
    "Canoinhas", "Rio do Sul", "Lages", "Ponte Serrada", "Concórdia", "Chapeco", "Nova Balneário Piçarras"
];

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function mostrarAba(idAba) {
    document.querySelectorAll('.aba-conteudo').forEach(aba => aba.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    const abaAlvo = document.getElementById(idAba);
    if(abaAlvo) abaAlvo.style.display = 'block';
    
    if(idAba === 'aba-principal') document.getElementById('btn-principal').classList.add('active');
    if(idAba === 'aba-equipe' || idAba === 'aba-editar-equipe') document.getElementById('btn-equipe').classList.add('active');
    if(idAba === 'aba-usuarios') document.getElementById('btn-usuarios').classList.add('active');
}

// ==========================================
// PREENCHIMENTO DINÂMICO DOS SELECTS
// ==========================================
function preencherSelectsRegiaoBase() {
    const selectCadastro = document.getElementById('regiaoBase');
    const selectEdicao = document.getElementById('editRegiaoBase');
    
    if (!selectCadastro || !selectEdicao) return;

    let optionsHTML = '<option value="">Selecione uma região...</option>';
    
    regioesDisponiveis.sort().forEach(regiao => {
        optionsHTML += `<option value="${regiao}">${regiao}</option>`;
    });

    selectCadastro.innerHTML = optionsHTML;
    selectEdicao.innerHTML = optionsHTML;
}

// ==========================================
// LÓGICA DE USUÁRIOS
// ==========================================
function salvarUsuario() {
    const indexEdit = document.getElementById('editUsuarioIndex').value;
    const nome = document.getElementById('nomeUsuario').value;
    const email = document.getElementById('emailUsuario').value;
    const senha = document.getElementById('senhaUsuario').value;
    const nivel = document.getElementById('nivelUsuario').value;

    if (!nome || !email || !senha) { 
        showToast("Preencha todos os campos do usuário!", "error"); 
        return; 
    }
    
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (indexEdit !== "") {
        const emailExiste = usuarios.find((u, i) => u.email === email && i != indexEdit);
        if(emailExiste) {
            showToast("Este e-mail já pertence a outro usuário!", "error");
            return;
        }
        usuarios[indexEdit] = { nome, email, senha, nivel };
        showToast("Usuário atualizado com sucesso!");
    } else {
        const emailExiste = usuarios.find(u => u.email === email);
        if(emailExiste) {
            showToast("Este e-mail já está cadastrado!", "error");
            return;
        }
        usuarios.push({ nome, email, senha, nivel });
        showToast("Usuário cadastrado com sucesso!");
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cancelarEdicaoUsuario(); 
    atualizarUsuarios();
}

function prepararEdicaoUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let user = usuarios[index];
    
    document.getElementById('editUsuarioIndex').value = index;
    document.getElementById('nomeUsuario').value = user.nome;
    document.getElementById('emailUsuario').value = user.email;
    document.getElementById('senhaUsuario').value = user.senha;
    document.getElementById('nivelUsuario').value = user.nivel;
    
    document.getElementById('tituloCadastroUsuario').innerHTML = '<i class="fas fa-user-edit"></i> Editar Usuário';
    document.getElementById('btnSalvarUsuario').innerHTML = '<i class="fas fa-save"></i> Salvar Alterações';
    document.getElementById('btnCancelarEdicaoUsuario').style.display = 'flex';
}

function cancelarEdicaoUsuario() {
    document.getElementById('editUsuarioIndex').value = '';
    document.getElementById('nomeUsuario').value = '';
    document.getElementById('emailUsuario').value = '';
    document.getElementById('senhaUsuario').value = '';
    document.getElementById('nivelUsuario').value = 'Comum';
    
    document.getElementById('tituloCadastroUsuario').innerHTML = '<i class="fas fa-user-plus"></i> Novo Usuário';
    document.getElementById('btnSalvarUsuario').innerHTML = '<i class="fas fa-check"></i> Cadastrar Usuário';
    document.getElementById('btnCancelarEdicaoUsuario').style.display = 'none';
}

function atualizarUsuarios() {
    const listaUsuarios = document.getElementById('lista-usuarios-gestao');
    const emptyState = document.getElementById('empty-state-usuarios');
    const contador = document.getElementById('contador-usuarios');
    
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if(usuarios.length === 0) {
        usuarios.push({ nome: "Administrador", email: "admin@topsun.com.br", senha: "123", nivel: "Admin" });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    listaUsuarios.innerHTML = '';
    contador.innerText = usuarios.length;
    
    if(usuarios.length === 0) emptyState.style.display = 'block';
    else emptyState.style.display = 'none';

    usuarios.forEach((user, index) => {
        const badgeClasse = user.nivel === 'Admin' ? 'badge-admin' : 'badge-comum';
        
        listaUsuarios.innerHTML += `
            <tr>
                <td><strong>${user.nome}</strong><br><small style="color:#7f8c8d">${user.email}</small></td>
                <td><span class="badge-status ${badgeClasse}">${user.nivel}</span></td>
                <td style="text-align: right;">
                    <button class="btn-icon btn-edit" onclick="prepararEdicaoUsuario(${index})" title="Editar Usuário"><i class="fas fa-cog"></i></button>
                    <button class="btn-icon btn-del" onclick="removerUsuario(${index})" title="Excluir Usuário"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

function removerUsuario(index) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const admins = usuarios.filter(u => u.nivel === 'Admin');
    if (usuarios[index].nivel === 'Admin' && admins.length <= 1) {
        showToast("Você não pode excluir o último Administrador!", "error");
        return;
    }

    if(confirm("Deseja realmente excluir este usuário?")) {
        usuarios.splice(index, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        showToast("Usuário removido.", "error");
        cancelarEdicaoUsuario();
        atualizarUsuarios();
    }
}

// ==========================================
// LÓGICA DE EQUIPES
// ==========================================
function gerarCheckboxesRegioes() {
    const container = document.getElementById('lista-checkbox-regioes');
    if(!container) return;
    container.innerHTML = '';
    regioesDisponiveis.sort().forEach(regiao => {
        container.innerHTML += `<label class="item-checkbox"><input type="checkbox" name="regiao" value="${regiao}"><span>${regiao}</span></label>`;
    });
}

function salvarEquipe() {
    const nome = document.getElementById('nomeEquipe').value;
    const resp = document.getElementById('respEquipe').value;
    const regiaoBase = document.getElementById('regiaoBase').value;

    if (!nome || !resp || !regiaoBase) { 
        showToast("Preencha todos os campos, incluindo a Região Base!", "error"); 
        return; 
    }
    
    let equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    equipes.push({ 
        nome, 
        resp, 
        regiaoBase,
        status: "Ativo", 
        custo20: 0, custo65: 0, custo66: 0, 
        cidades: [], obs: "" 
    });
    localStorage.setItem('equipes', JSON.stringify(equipes));
    
    document.getElementById('nomeEquipe').value = '';
    document.getElementById('respEquipe').value = '';
    document.getElementById('regiaoBase').value = '';
    
    showToast("Equipe cadastrada!");
    atualizarEquipes();
}

function atualizarEquipes() {
    const displayPrincipal = document.getElementById('display-equipes');
    const listaGestao = document.getElementById('lista-equipes-gestao');
    const emptyState = document.getElementById('empty-state');
    const contador = document.getElementById('contador-equipes');
    const equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    
    displayPrincipal.innerHTML = '';
    listaGestao.innerHTML = '';
    contador.innerText = equipes.length;
    
    if(equipes.length === 0) emptyState.style.display = 'block';
    else emptyState.style.display = 'none';
    
    equipes.forEach((eq, index) => {
        const statusClasse = eq.status === "Ativo" ? "status-ativo" : "status-inativo";
        const regioesFiltro = Array.isArray(eq.cidades) ? eq.cidades.join(' ') : '';
        const termosDeBusca = `${eq.nome} ${eq.resp} ${eq.regiaoBase || ''} ${regioesFiltro}`.toLowerCase();
        
        displayPrincipal.innerHTML += `
            <div class="card-equipe-resumo" data-busca="${termosDeBusca}">
                <div class="card-header-resumo">
                    <h3>${eq.nome}</h3>
                    <span class="badge-status ${statusClasse}">${eq.status}</span>
                </div>
                <div class="card-body-resumo">
                    <p><i class="fas fa-user-tie"></i> ${eq.resp}</p>
                    <p style="margin-top: -10px; font-weight: 600; color: var(--primary);">
                        <i class="fas fa-map-marker-alt"></i> ${eq.regiaoBase || 'Não definida'}
                    </p>
                    <button class="btn-detalhes" onclick="abrirDetalhes(${index})">
                        Ver Detalhes <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>`;
            
        listaGestao.innerHTML += `
            <tr>
                <td><strong>${eq.nome}</strong><br><small style="color:#7f8c8d">${eq.resp}</small></td>
                <td><span class="badge-status ${statusClasse}">${eq.status}</span></td>
                <td style="text-align: right;">
                    <button class="btn-icon btn-edit" onclick="abrirEdicao(${index})"><i class="fas fa-cog"></i></button>
                    <button class="btn-icon btn-del" onclick="removerEquipe(${index})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    });
}

function abrirDetalhes(index) {
    const equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    const eq = equipes[index];
    const modal = document.getElementById('modalDetalhes');
    const conteudo = document.getElementById('conteudoModal');
    
    const regioes = Array.isArray(eq.cidades) ? eq.cidades : [];
    let tagsHTML = regioes.map(reg => `<span class="tag-cidade">${reg}</span>`).join('');
    
    const obsHTML = eq.obs ? `
        <div class="info-item" style="margin-top: 15px;">
            <h4>Observações:</h4>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #eee; font-size: 0.9rem; margin-top: 5px; white-space: pre-wrap;">${eq.obs}</div>
        </div>
    ` : '';

    conteudo.innerHTML = `
        <div class="modal-header-info"><h2>${eq.nome}</h2><span class="badge-status ${eq.status === 'Ativo' ? 'status-ativo' : 'status-inativo'}">${eq.status}</span></div>
        <div class="modal-grid">
            <div class="info-item"><strong>Responsável:</strong> ${eq.resp}</div>
            <div class="info-item"><strong>Região Base:</strong> <span style="color: var(--primary); font-weight: bold;">${eq.regiaoBase || 'Não definida'}</span></div>
            
            <div class="info-custo-card">
                <h4>Custos de Instalação</h4>
                <div class="custo-row"><span>Até 20m:</span> <strong>R$ ${Number(eq.custo20).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></div>
                <div class="custo-row"><span>Até 65m:</span> <strong>R$ ${Number(eq.custo65).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></div>
                <div class="custo-row"><span>Acima 66m:</span> <strong>R$ ${Number(eq.custo66).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></div>
            </div>
            
            ${obsHTML}
            
            <div class="info-item"><h4>Outras Regiões Atendidas:</h4><div class="container-tags">${tagsHTML || '<small>Nenhuma outra região configurada</small>'}</div></div>
        </div>`;
    modal.style.display = "block";
}

function fecharModal() { document.getElementById('modalDetalhes').style.display = "none"; }

function filtrarEquipes() {
    const termo = document.getElementById('inputBusca').value.toLowerCase();
    const cards = document.querySelectorAll('.card-equipe-resumo');
    
    cards.forEach(card => {
        const conteudoParaBusca = card.getAttribute('data-busca');
        if(conteudoParaBusca.includes(termo)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function abrirEdicao(index) {
    const equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    const eq = equipes[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editNomeEquipe').value = eq.nome;
    document.getElementById('editRespEquipe').value = eq.resp;
    document.getElementById('editRegiaoBase').value = eq.regiaoBase || "";
    document.getElementById('editStatus').value = eq.status || "Ativo";
    document.getElementById('editCusto20').value = eq.custo20;
    document.getElementById('editCusto65').value = eq.custo65;
    document.getElementById('editCusto66').value = eq.custo66;
    document.getElementById('editObs').value = eq.obs || "";

    const checkboxes = document.querySelectorAll('input[name="regiao"]');
    checkboxes.forEach(cb => { cb.checked = eq.cidades.includes(cb.value); });
    mostrarAba('aba-editar-equipe');
}

function confirmarEdicao() {
    const index = document.getElementById('editIndex').value;
    let equipes = JSON.parse(localStorage.getItem('equipes')) || [];
    const selecionadas = Array.from(document.querySelectorAll('input[name="regiao"]:checked')).map(cb => cb.value);
    
    if(equipes[index]) {
        equipes[index].nome = document.getElementById('editNomeEquipe').value;
        equipes[index].resp = document.getElementById('editRespEquipe').value;
        equipes[index].regiaoBase = document.getElementById('editRegiaoBase').value;
        equipes[index].status = document.getElementById('editStatus').value;
        equipes[index].custo20 = parseFloat(document.getElementById('editCusto20').value) || 0;
        equipes[index].custo65 = parseFloat(document.getElementById('editCusto65').value) || 0;
        equipes[index].custo66 = parseFloat(document.getElementById('editCusto66').value) || 0;
        equipes[index].obs = document.getElementById('editObs').value;
        equipes[index].cidades = selecionadas;
    }
    
    localStorage.setItem('equipes', JSON.stringify(equipes));
    showToast("Alterações salvas!");
    atualizarEquipes();
    mostrarAba('aba-equipe');
}

function removerEquipe(index) {
    if(confirm("Deseja excluir permanentemente esta equipe?")) {
        let equipes = JSON.parse(localStorage.getItem('equipes')) || [];
        equipes.splice(index, 1);
        localStorage.setItem('equipes', JSON.stringify(equipes));
        showToast("Equipe removida.", "error");
        atualizarEquipes();
    }
}

window.onload = function() {
    gerarCheckboxesRegioes();
    preencherSelectsRegiaoBase();
    atualizarEquipes();
    atualizarUsuarios();
};