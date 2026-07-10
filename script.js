const GOOGLE_SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbzNj21I4pL3XWhDKH_Chdtwd-4W7VdHknUJOjWDhImqG1mVLQwp7qPjLCdKF3OKy5U2yQ/exec';
const USAR_GOOGLE_SHEETS = true;

// ====== SANITIZAÇÃO HTML (PREVENÇÃO XSS) ======
function sanitizeHTML(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}

function sanitizeAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g,'&amp;').replace(/'/g,'&#39;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ====== BIBLIOTECA DE ÍCONES (SVG) ======
// Substitui os emojis por ícones vetoriais, herdando a cor do texto (currentColor).
const ICONS = {
    user:          '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    lock:          '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    home:          '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    edit:          '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    barChart:      '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    activity:      '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    calendar:      '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    list:          '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    printer:       '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    settings:      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    moon:          '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    sun:           '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    plusCircle:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
    refresh:       '<polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>',
    save:          '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
    search:        '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    download:      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    upload:        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    trash:         '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    store:         '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    cloud:         '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    monitor:       '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    target:        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    xCircle:       '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    award:         '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
    trendingDown:  '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
    alertTriangle: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    lightbulb:     '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
    menu:          '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
    x:             '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
};

function icon(name, extraClass = '') {
    const path = ICONS[name];
    if (!path) return '';
    return `<span class="icon ${sanitizeAttr(extraClass)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg></span>`;
}

function renderStaticIcons() {
    document.querySelectorAll('[data-icon]').forEach(el => {
        const name = el.getAttribute('data-icon');
        const path = ICONS[name];
        if (path) {
            el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
        }
    });
}
// ====== LOGIN (AUTENTICAÇÃO VIA GOOGLE APPS SCRIPT) ======
async function fazerLogin() {
    const usuario = document.getElementById('login-usuario').value.trim();
    const senha = document.getElementById('login-senha').value.trim();
    const erroEl = document.getElementById('login-erro');
    const btnLogin = document.querySelector('.btn-login');

    if (!usuario || !senha) {
        erroEl.textContent = 'Preencha usuário e senha!';
        erroEl.classList.remove('hidden');
        setTimeout(() => erroEl.classList.add('hidden'), 3000);
        return;
    }

    btnLogin.disabled = true;
    btnLogin.textContent = 'Autenticando...';

    try {
        if (USAR_GOOGLE_SHEETS) {
            const response = await fetch(GOOGLE_SHEETS_API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'login', usuario: usuario, senha: senha })
            });
            const result = await response.json();

            if (result.success) {
                document.getElementById('login-screen').classList.add('hidden');
                document.querySelector('.app-container').style.display = 'flex';
                localStorage.setItem('auditsort38_session', result.sessionToken || 'active');
                localStorage.setItem('auditsort38_user', sanitizeAttr(usuario));
                showToast('Bem-vindo à Loja 38!');
            } else {
                erroEl.textContent = 'Usuário ou senha inválidos!';
                erroEl.classList.remove('hidden');
                document.getElementById('login-senha').value = '';
                setTimeout(() => erroEl.classList.add('hidden'), 3000);
            }
        } else {
            document.getElementById('login-screen').classList.add('hidden');
            document.querySelector('.app-container').style.display = 'flex';
            localStorage.setItem('auditsort38_session', 'local_active');
            localStorage.setItem('auditsort38_user', sanitizeAttr(usuario));
            showToast('Bem-vindo à Loja 38!');
        }
    } catch (error) {
        console.error('Erro na autenticação:', error);
        erroEl.textContent = 'Erro de conexão. Tente novamente.';
        erroEl.classList.remove('hidden');
        setTimeout(() => erroEl.classList.add('hidden'), 3000);
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Entrar no Sistema';
    }
}

function verificarLogin() {
    const session = localStorage.getItem('auditsort38_session');
    if (session) {
        document.getElementById('login-screen').classList.add('hidden');
        document.querySelector('.app-container').style.display = 'flex';
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.querySelector('.app-container').style.display = 'none';
    }
}

function fazerLogout() {
    localStorage.removeItem('auditsort38_session');
    localStorage.removeItem('auditsort38_user');
    document.getElementById('login-screen').classList.remove('hidden');
    document.querySelector('.app-container').style.display = 'none';
    document.getElementById('login-usuario').value = '';
    document.getElementById('login-senha').value = '';
}
// Banco de dados
let appData = JSON.parse(localStorage.getItem('auditsort38_v2_data')) || {
    audits: [],
    config: {
        auditores: ['Auditor Principal', 'CoordenaÃ§Ã£o Loja 38', 'Auditor Setorial'],
        setores: ['Mercearia', 'Frios e LaticÃ­nios', 'Hortifruti', 'AÃ§ougue e Peixaria', 'Bazar e TÃªxtil', 'Padaria'],
        metaLoja: 98.0
    }
};

let charts = {};
let currentCalendarDate = new Date();
let sincronizado = false;

// ====== INICIAR SISTEMA ======
document.addEventListener('DOMContentLoaded', async () => {
    renderStaticIcons();
    verificarLogin();

    updateLiveClock();
    setInterval(updateLiveClock, 1000);
    setAutomaticGreeting();
    resetFormDateTime();
    populateSelectOptions();
    renderConfigLists();
    
    if (USAR_GOOGLE_SHEETS) {
        await carregarDadosNuvem();
    }
    
    updateGlobalMetrics();
    renderHomeChart();
    navigate('home');
});

// ====== GOOGLE SHEETS ======
async function carregarDadosNuvem() {
    try {
        showToast('Sincronizando...');
        const response = await fetch(GOOGLE_SHEETS_API_URL);
        const dadosNuvem = await response.json();
        
        if (dadosNuvem && dadosNuvem.length > 0) {
            appData.audits = dadosNuvem.map(a => ({ ...a, data: normalizarData(a.data) }));
            saveToLocalStorage();
            sincronizado = true;
            showToast('Dados sincronizados!');
        }
    } catch (error) {
        console.error('Erro ao carregar:', error);
        sincronizado = false;
    }
}

async function salvarNaPlanilha(auditsArray) {
    if (!USAR_GOOGLE_SHEETS) return;
    
    try {
        await fetch(GOOGLE_SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify(auditsArray)
        });
        sincronizado = true;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        sincronizado = false;
    }
}

async function deletarDaPlanilha(id) {
    if (!USAR_GOOGLE_SHEETS) return;
    
    try {
        const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=delete&id=${encodeURIComponent(id)}`);
        const result = await response.json();
        console.log('ExcluÃ­do da planilha:', result);
    } catch (error) {
        console.error('Erro ao deletar:', error);
    }
}

// ====== RELÃ“GIO E SAUDAÃ‡ÃƒO ======
function updateLiveClock() {
    const el = document.getElementById('current-date-time');
    if (el) el.innerText = new Date().toLocaleString('pt-BR');
}

function setAutomaticGreeting() {
    const hr = new Date().getHours();
    let greet = 'Bom dia!';
    if (hr >= 12 && hr < 18) greet = 'Boa tarde!';
    else if (hr >= 18) greet = 'Boa noite!';
    
    const el = document.getElementById('greeting');
    if (el) el.innerText = `${greet} GestÃ£o Loja 38.`;
}

function resetFormDateTime() {
    const now = new Date();
    const dInput = document.getElementById('form-data');
    const hInput = document.getElementById('form-hora');
    if (dInput) dInput.value = now.toISOString().split('T')[0];
    if (hInput) hInput.value = now.toTimeString().substring(0, 5);
}

// ====== TOAST ======
function showToast(msg, isDanger = false) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerText = msg;
    t.style.backgroundColor = isDanger ? '#DC3545' : '#174A7C';
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}

// ====== UTILITÃRIO DE DATA ======
function normalizarData(valor) {
    if (!valor) return '';
    const match = String(valor).match(/(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : String(valor);
}

function formatarDataBR(valor) {
    const iso = normalizarData(valor);
    if (!iso) return '-';
    return iso.split('-').reverse().join('/');
}

// ====== NAVEGAÃ‡ÃƒO ======
function navigate(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    
    const target = document.getElementById(pageId);
    if (target) target.classList.remove('hidden');
    
    document.querySelectorAll('.menu button').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`btn-${pageId}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    const titles = {
        'home': 'Home Hub - Loja 38',
        'nova-auditoria': 'LanÃ§amento de Auditoria',
        'dashboard': 'Analytics & Dashboards',
        'analises': 'AnÃ¡lises Inteligentes',
        'calendario-view': 'CalendÃ¡rio SemafÃ³rico',
        'historico': 'HistÃ³rico de Auditorias',
        'relatorio-divisoes': 'RelatÃ³rio de DivisÃµes',
        'configuracoes': 'ConfiguraÃ§Ãµes'
    };
    
    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.innerText = titles[pageId] || 'AuditSort 38';

    if (pageId === 'home') {
        updateGlobalMetrics();
        renderHomeChart();
    } else if (pageId === 'historico') {
        renderHistoryTable();
    } else if (pageId === 'dashboard') {
        populateFilterSelects();
        applyFilters();
    } else if (pageId === 'analises') {
        generateSmartAnalysis();
    } else if (pageId === 'calendario-view') {
        renderCalendar();
    } else if (pageId === 'relatorio-divisoes') {
        populateReportSetorOptions();
        populateDivisaoFilterOptions();
        gerarRelatorioDivisao();
    }

    closeMobileSidebar();
}

// ====== MENU MOBILE (SIDEBAR RETRÃTIL) ======
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn = document.getElementById('btn-mobile-menu');
    if (!sidebar || !overlay) return;

    const isOpen = sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('active', isOpen);
    if (btn) btn.innerHTML = isOpen ? icon('x') : icon('menu');
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn = document.getElementById('btn-mobile-menu');
    if (!sidebar || !overlay) return;

    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    if (btn) btn.innerHTML = icon('menu');
}

// ====== TEMA ESCURO ======
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) btn.innerHTML = isDark ? `${icon('sun')} Modo Claro` : `${icon('moon')} Modo Escuro`;
}

// ====== SALVAR DADOS ======
function saveToLocalStorage() {
    localStorage.setItem('auditsort38_v2_data', JSON.stringify(appData));
    updateGlobalMetrics();
}

// ====== CONFIGURAÃ‡Ã•ES ======
function populateSelectOptions() {
    const fAuditor = document.getElementById('form-auditor');
    const fSetor = document.getElementById('form-setor');
    
    if (fAuditor) {
        fAuditor.innerHTML = '<option value="">Selecione o Auditor...</option>';
        appData.config.auditores.forEach(a => fAuditor.innerHTML += `<option value="${sanitizeAttr(a)}">${sanitizeHTML(a)}</option>`);
    }
    if (fSetor) {
        fSetor.innerHTML = '<option value="">Selecione o Setor...</option>';
        appData.config.setores.forEach(s => fSetor.innerHTML += `<option value="${sanitizeAttr(s)}">${sanitizeHTML(s)}</option>`);
    }
    
    const metaInput = document.getElementById('config-meta-loja');
    if (metaInput) metaInput.value = appData.config.metaLoja;
}

function renderConfigLists() {
    const listAud = document.getElementById('list-auditores');
    const listSet = document.getElementById('list-setores');
    
    if (listAud) {
        listAud.innerHTML = '';
        appData.config.auditores.forEach(a => {
            listAud.innerHTML += `<li>${sanitizeHTML(a)} <button class="btn-danger btn-sm" onclick="removeConfigItem('auditores', '${sanitizeAttr(a)}')">Remover</button></li>`;
        });
    }
    if (listSet) {
        listSet.innerHTML = '';
        appData.config.setores.forEach(s => {
            listSet.innerHTML += `<li>${sanitizeHTML(s)} <button class="btn-danger btn-sm" onclick="removeConfigItem('setores', '${sanitizeAttr(s)}')">Remover</button></li>`;
        });
    }
}

function addConfigItem(key, inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const val = input.value.trim();
    if (!val) return;
    
    if (!appData.config[key].includes(val)) {
        appData.config[key].push(val);
        saveToLocalStorage();
        renderConfigLists();
        populateSelectOptions();
        input.value = '';
        showToast('Adicionado com sucesso!');
    } else {
        showToast('Item jÃ¡ existe!', true);
    }
}

function removeConfigItem(key, val) {
    appData.config[key] = appData.config[key].filter(item => item !== val);
    saveToLocalStorage();
    renderConfigLists();
    populateSelectOptions();
    showToast('Removido.', true);
}

function saveMetaStore() {
    const input = document.getElementById('config-meta-loja');
    if (!input) return;
    
    const val = parseFloat(input.value);
    if (!isNaN(val) && val >= 0 && val <= 100) {
        appData.config.metaLoja = val;
        saveToLocalStorage();
        showToast('Meta atualizada!');
    }
}

// ====== FORMULÃRIO DE AUDITORIA ======
function calculateFormMetrics() {
    const previstos = parseInt(document.getElementById('form-previstos').value) || 0;
    const picking = parseInt(document.getElementById('form-picking').value) || 0;
    const deposito = parseInt(document.getElementById('form-deposito').value) || 0;
    const areaVendas = parseInt(document.getElementById('form-areavendas').value) || 0;
    const encontrados = picking + deposito + areaVendas;
    const infoBox = document.getElementById('form-metricas-calculadas');
    
    if (!infoBox) return;
    
    if (previstos <= 0) {
        infoBox.textContent = 'Preencha os itens previstos...';
        return;
    }
    
    if (encontrados > previstos) {
        infoBox.innerHTML = '<span class="text-danger">Soma de encontrados (Picking + DepÃ³sito + Ãrea de Vendas) maior que previstos!</span>';
        return;
    }
    
    const naoEncontrados = previstos - encontrados;
    const confPerc = ((encontrados / previstos) * 100).toFixed(1);
    const rupPerc = (100 - parseFloat(confPerc)).toFixed(1);
    const pctPicking = ((picking / previstos) * 100).toFixed(1);
    const pctDeposito = ((deposito / previstos) * 100).toFixed(1);
    const pctAreaVendas = ((areaVendas / previstos) * 100).toFixed(1);
    
    infoBox.innerHTML = `NÃ£o encontrados: <strong>${naoEncontrados}</strong><br>` +
                        `Conformidade: <strong class="text-success">${confPerc}%</strong> | Ruptura: <strong class="text-danger">${rupPerc}%</strong><br>` +
                        `Picking: <strong>${pctPicking}%</strong> | DepÃ³sito: <strong>${pctDeposito}%</strong> | Ãrea de Vendas: <strong>${pctAreaVendas}%</strong>`;
}

function clearAuditForm() {
    const form = document.getElementById('audit-form');
    if (form) {
        form.reset();
        resetFormDateTime();
        calculateFormMetrics();
    }
}

document.getElementById('audit-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const previstos = parseInt(document.getElementById('form-previstos').value) || 0;
    const picking = parseInt(document.getElementById('form-picking').value) || 0;
    const deposito = parseInt(document.getElementById('form-deposito').value) || 0;
    const areaVendas = parseInt(document.getElementById('form-areavendas').value) || 0;
    const encontrados = picking + deposito + areaVendas;
    
    if (previstos <= 0) {
        showToast('Itens previstos invÃ¡lido!', true);
        return;
    }
    if (encontrados > previstos) {
        showToast('Soma de encontrados nÃ£o pode superar previstos!', true);
        return;
    }
    
    const naoEncontrados = previstos - encontrados;
    const conformidade = parseFloat(((encontrados / previstos) * 100).toFixed(2));
    const ruptura = parseFloat((100 - conformidade).toFixed(2));
    
    const divisaoInput = document.getElementById('form-divisao').value.trim();
    const obsInput = document.getElementById('form-observacao').value.trim();

    if (divisaoInput.length > 100 || obsInput.length > 500) {
        showToast('Texto excede o limite permitido!', true);
        return;
    }
    
    const auditObj = {
        id: 'audit_' + Date.now(),
        data: document.getElementById('form-data').value,
        hora: document.getElementById('form-hora').value,
        auditor: document.getElementById('form-auditor').value,
        setor: document.getElementById('form-setor').value,
        divisao: divisaoInput,
        previstos: previstos,
        picking: picking,
        deposito: deposito,
        areaVendas: areaVendas,
        encontrados: encontrados,
        naoEncontrados: naoEncontrados,
        conformidade: conformidade,
        ruptura: ruptura,
        observacao: obsInput
    };
    
    appData.audits.push(auditObj);
    saveToLocalStorage();
    await salvarNaPlanilha(auditObj);
    
    showToast('Auditoria salva!');
    clearAuditForm();
});

// ====== HOME ======
function updateGlobalMetrics() {
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    const currentMonthAudits = appData.audits.filter(a => a.data.startsWith(currentMonthStr));
    
    let totalPrevistos = 0, totalEncontrados = 0;
    currentMonthAudits.forEach(a => {
        totalPrevistos += a.previstos;
        totalEncontrados += a.encontrados;
    });
    
    const confMes = totalPrevistos > 0 ? ((totalEncontrados / totalPrevistos) * 100).toFixed(1) : "0.0";
    const rupMes = totalPrevistos > 0 ? (100 - parseFloat(confMes)).toFixed(1) : "0.0";
    
    document.getElementById('home-conformidade').innerText = `${confMes}%`;
    document.getElementById('home-ruptura').innerText = `${rupMes}%`;
    document.getElementById('home-total-auditorias').innerText = currentMonthAudits.length;
    document.getElementById('home-meta-loja').innerText = `${appData.config.metaLoja.toFixed(1)}%`;
    
    const ultimaBox = document.getElementById('home-ultima-auditoria');
    if (appData.audits.length > 0) {
        const sorted = [...appData.audits].sort((a,b) => b.id.localeCompare(a.id));
        const last = sorted[0];
        const dataFmt = formatarDataBR(last.data);
        
        ultimaBox.innerHTML = `
            <strong>Data:</strong> ${sanitizeHTML(dataFmt)} Ã s ${sanitizeHTML(last.hora)}<br>
            <strong>Setor/DivisÃ£o:</strong> ${sanitizeHTML(last.setor)} (${sanitizeHTML(last.divisao)})<br>
            <strong>Conformidade:</strong> <span class="${last.conformidade >= appData.config.metaLoja ? 'text-success' : 'text-danger'}">${sanitizeHTML(String(last.conformidade))}%</span><br>
            <strong>Auditor:</strong> ${sanitizeHTML(last.auditor)}<br>
            <small>${sincronizado ? icon('cloud') + ' Online' : icon('monitor') + ' Offline'}</small>
        `;
    } else {
        ultimaBox.innerHTML = '<p class="text-muted">Nenhuma auditoria registrada.</p>';
    }
}

function renderHomeChart() {
    if (charts['homeEvolucao']) charts['homeEvolucao'].destroy();
    
    const canvas = document.getElementById('chartHomeEvolucao');
    if (!canvas) return;
    
    const agrupado = {};
    appData.audits.forEach(a => {
        if (!agrupado[a.data]) agrupado[a.data] = { prev: 0, enc: 0 };
        agrupado[a.data].prev += a.previstos;
        agrupado[a.data].enc += a.encontrados;
    });
    
    const datasOrdenadas = Object.keys(agrupado).sort().slice(-10);
    const valores = datasOrdenadas.map(d => ((agrupado[d].enc / agrupado[d].prev) * 100).toFixed(1));
    const labels = datasOrdenadas.map(d => d.split('-').reverse().slice(0,2).join('/'));
    
    charts['homeEvolucao'] = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels.length ? labels : ['Sem dados'],
            datasets: [{
                label: 'Conformidade (%)',
                data: valores.length ? valores : [0],
                borderColor: '#174A7C',
                backgroundColor: 'rgba(23, 74, 124, 0.08)',
                fill: true,
                tension: 0,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 100 } }
        }
    });
}

// ====== HISTÃ“RICO ======
function renderHistoryTable() {
    const termo = document.getElementById('search-history')?.value.toLowerCase() || '';
    const tbody = document.getElementById('history-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const sorted = [...appData.audits].sort((a,b) => b.data.localeCompare(a.data) || b.hora.localeCompare(a.hora));
    
    const filtrados = sorted.filter(a => {
        return a.divisao.toLowerCase().includes(termo) || 
               a.setor.toLowerCase().includes(termo) || 
               a.auditor.toLowerCase().includes(termo) ||
               (a.observacao && a.observacao.toLowerCase().includes(termo));
    });
    
    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;">Nenhum registro.</td></tr>';
        return;
    }
    
    filtrados.forEach(a => {
        const dataFmt = formatarDataBR(a.data);
        const isAcima = a.conformidade >= appData.config.metaLoja;
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${sanitizeHTML(dataFmt)}</strong> ${sanitizeHTML(a.hora)}</td>
                <td>${sanitizeHTML(a.setor)}</td>
                <td>${sanitizeHTML(a.divisao)}</td>
                <td>${sanitizeHTML(String(a.previstos))}</td>
                <td>${sanitizeHTML(String(a.encontrados))}<br><small class="text-muted">P:${sanitizeHTML(String(a.picking ?? '-'))} D:${sanitizeHTML(String(a.deposito ?? '-'))} AV:${sanitizeHTML(String(a.areaVendas ?? '-'))}</small></td>
                <td>${sanitizeHTML(String(a.naoEncontrados))}</td>
                <td class="${isAcima ? 'text-success' : 'text-danger'}" style="font-weight:700;">${sanitizeHTML(String(a.conformidade))}%</td>
                <td class="text-danger">${sanitizeHTML(String(a.ruptura))}%</td>
                <td>${sanitizeHTML(a.auditor)}</td>
                <td>
                    <button class="btn-secondary btn-sm" onclick="duplicateAuditItem('${sanitizeAttr(a.id)}')">Duplicar</button>
                    <button class="btn-danger btn-sm" onclick="deleteAuditItem('${sanitizeAttr(a.id)}')">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function duplicateAuditItem(id) {
    const audit = appData.audits.find(a => a.id === id);
    if (!audit) return;

    navigate('nova-auditoria');

    setTimeout(() => {
        document.getElementById('form-setor').value = audit.setor;
        document.getElementById('form-divisao').value = audit.divisao;
        document.getElementById('form-previstos').value = audit.previstos;
        document.getElementById('form-picking').value = audit.picking;
        document.getElementById('form-deposito').value = audit.deposito;
        document.getElementById('form-areavendas').value = audit.areaVendas;
        document.getElementById('form-observacao').value = audit.observacao || '';
        calculateFormMetrics();
        showToast('Auditoria carregada para duplicaÃ§Ã£o. Ajuste e salve.');
    }, 100);
}

function duplicateAuditItem(id) {
    const audit = appData.audits.find(a => a.id === id);
    if (!audit) return;

    navigate('nova-auditoria');

    setTimeout(() => {
        document.getElementById('form-setor').value = audit.setor;
        document.getElementById('form-divisao').value = audit.divisao;
        document.getElementById('form-previstos').value = audit.previstos;
        document.getElementById('form-picking').value = audit.picking;
        document.getElementById('form-deposito').value = audit.deposito;
        document.getElementById('form-areavendas').value = audit.areaVendas;
        document.getElementById('form-observacao').value = audit.observacao || '';
        calculateFormMetrics();
        showToast('Auditoria carregada para duplicação. Ajuste e salve.');
    }, 100);
}

function deleteAuditItem(id) {
    const modalHTML = `
        <div id="confirm-modal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <h4 style="margin-bottom: 15px;">${icon('trash')} Confirmar ExclusÃ£o</h4>
                <p style="margin-bottom: 20px;">Tem certeza que deseja excluir este registro permanentemente?</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-secondary" onclick="fecharConfirmModal()">Cancelar</button>
                    <button class="btn-danger" id="btn-confirmar-delete">Sim, Excluir</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('btn-confirmar-delete').onclick = async function() {
        fecharConfirmModal();
        appData.audits = appData.audits.filter(a => a.id !== id);
        saveToLocalStorage();
        await deletarDaPlanilha(id);
        renderHistoryTable();
        showToast('Registro excluÃ­do com sucesso!', true);
    };
}

function fecharConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    if (modal) modal.remove();
}

// ====== DASHBOARD ======
function populateFilterSelects() {
    const fSetor = document.getElementById('filter-setor');
    const fAuditor = document.getElementById('filter-auditor');
    
    if (fSetor) {
        fSetor.innerHTML = '<option value="">Todos os Setores</option>';
        appData.config.setores.forEach(s => fSetor.innerHTML += `<option value="${sanitizeAttr(s)}">${sanitizeHTML(s)}</option>`);
    }
    if (fAuditor) {
        fAuditor.innerHTML = '<option value="">Todos os Auditores</option>';
        appData.config.auditores.forEach(a => fAuditor.innerHTML += `<option value="${sanitizeAttr(a)}">${sanitizeHTML(a)}</option>`);
    }
}

function applyFilters() {
    const fMes = document.getElementById('filter-mes')?.value || '';
    const fSetor = document.getElementById('filter-setor')?.value || '';
    const fDivisao = document.getElementById('filter-divisao')?.value.toLowerCase() || '';
    const fAuditor = document.getElementById('filter-auditor')?.value || '';
    
    const filtrados = appData.audits.filter(a => {
        if (fMes && !a.data.startsWith(fMes)) return false;
        if (fSetor && a.setor !== fSetor) return false;
        if (fDivisao && !a.divisao.toLowerCase().includes(fDivisao)) return false;
        if (fAuditor && a.auditor !== fAuditor) return false;
        return true;
    });
    
    renderDashboard(filtrados);
}

function renderDashboard(dados) {
    document.getElementById('dash-total').innerText = dados.length;
    
    if (dados.length === 0) {
        document.getElementById('dash-conformidade').innerText = "0%";
        document.getElementById('dash-ruptura').innerText = "0%";
        document.getElementById('dash-melhor').innerText = "0%";
        document.getElementById('dash-pior').innerText = "0%";
        destroyDashboardCharts();
        return;
    }
    
    let tPrev = 0, tEnc = 0, melhor = 0, pior = 100;
    dados.forEach(a => {
        tPrev += a.previstos;
        tEnc += a.encontrados;
        if (a.conformidade > melhor) melhor = a.conformidade;
        if (a.conformidade < pior) pior = a.conformidade;
    });
    
    document.getElementById('dash-conformidade').innerText = `${((tEnc/tPrev)*100).toFixed(1)}%`;
    document.getElementById('dash-ruptura').innerText = `${(100 - (tEnc/tPrev)*100).toFixed(1)}%`;
    document.getElementById('dash-melhor').innerText = `${melhor.toFixed(1)}%`;
    document.getElementById('dash-pior').innerText = `${pior.toFixed(1)}%`;
    
    buildDashboardCharts(dados);
}

function destroyDashboardCharts() {
    ['dashEvolucaoConf', 'dashEvolucaoRup', 'dashSetores', 'dashDivisoes', 'dashMeses', 'dashTendencia', 'dashLocalizacao'].forEach(id => {
        if (charts[id]) charts[id].destroy();
    });
}

function buildDashboardCharts(dados) {
    destroyDashboardCharts();
    
    const porData = {};
    dados.forEach(a => {
        if (!porData[a.data]) porData[a.data] = { prev: 0, enc: 0 };
        porData[a.data].prev += a.previstos;
        porData[a.data].enc += a.encontrados;
    });
    const datas = Object.keys(porData).sort();
    const labels = datas.map(d => d.split('-').reverse().slice(0,2).join('/'));
    const confs = datas.map(d => ((porData[d].enc/porData[d].prev)*100).toFixed(1));
    const rups = confs.map(c => (100 - parseFloat(c)).toFixed(1));
    
    charts['dashEvolucaoConf'] = new Chart(document.getElementById('chartDashEvolucaoConf'), {
        type: 'line', data: { labels, datasets: [{ label: 'Conformidade', data: confs, borderColor: '#28A745' }] },
        options: { scales: { y: { min: 0, max: 100 } } }
    });
    
    charts['dashEvolucaoRup'] = new Chart(document.getElementById('chartDashEvolucaoRup'), {
        type: 'line', data: { labels, datasets: [{ label: 'Ruptura', data: rups, borderColor: '#DC3545' }] },
        options: { scales: { y: { min: 0, max: 100 } } }
    });
    
    const porSetor = {};
    dados.forEach(a => {
        if (!porSetor[a.setor]) porSetor[a.setor] = { prev: 0, enc: 0 };
        porSetor[a.setor].prev += a.previstos;
        porSetor[a.setor].enc += a.encontrados;
    });
    const setores = Object.keys(porSetor);
    
    charts['dashSetores'] = new Chart(document.getElementById('chartDashSetores'), {
        type: 'bar', data: {
            labels: setores,
            datasets: [{ label: '%', data: setores.map(s => ((porSetor[s].enc/porSetor[s].prev)*100).toFixed(1)), backgroundColor: '#174A7C' }]
        },
        options: { scales: { y: { min: 0, max: 100 } } }
    });
    
    const porDiv = {};
    dados.forEach(a => {
        if (!porDiv[a.divisao]) porDiv[a.divisao] = { prev: 0, enc: 0 };
        porDiv[a.divisao].prev += a.previstos;
        porDiv[a.divisao].enc += a.encontrados;
    });
    const divs = Object.keys(porDiv).slice(0, 10);
    
    charts['dashDivisoes'] = new Chart(document.getElementById('chartDashDivisoes'), {
        type: 'bar', data: {
            labels: divs,
            datasets: [{ label: '%', data: divs.map(d => ((porDiv[d].enc/porDiv[d].prev)*100).toFixed(1)), backgroundColor: '#2E75B6' }]
        },
        options: { indexAxis: 'y', scales: { x: { min: 0, max: 100 } } }
    });
    
    const porMes = {};
    dados.forEach(a => {
        const m = a.data.substring(0, 7);
        if (!porMes[m]) porMes[m] = { prev: 0, enc: 0 };
        porMes[m].prev += a.previstos;
        porMes[m].enc += a.encontrados;
    });
    const meses = Object.keys(porMes).sort();
    
    charts['dashMeses'] = new Chart(document.getElementById('chartDashMeses'), {
        type: 'bar', data: {
            labels: meses,
            datasets: [{ label: '%', data: meses.map(m => ((porMes[m].enc/porMes[m].prev)*100).toFixed(1)), backgroundColor: '#FD7E14' }]
        },
        options: { scales: { y: { min: 0, max: 100 } } }
    });
    
    const hoje = new Date();
    const dias30 = new Date(); dias30.setDate(hoje.getDate() - 30);
    const recentes = dados.filter(a => new Date(a.data + 'T00:00:00') >= dias30);
    const ag30 = {};
    recentes.forEach(a => {
        if (!ag30[a.data]) ag30[a.data] = { prev: 0, enc: 0 };
        ag30[a.data].prev += a.previstos;
        ag30[a.data].enc += a.encontrados;
    });
    const d30 = Object.keys(ag30).sort();
    
    charts['dashTendencia'] = new Chart(document.getElementById('chartDashTendencia'), {
        type: 'line', data: {
            labels: d30.map(d => d.split('-').reverse().slice(0,2).join('/')),
            datasets: [{ label: 'TendÃªncia', data: d30.map(d => ((ag30[d].enc/ag30[d].prev)*100).toFixed(1)), borderColor: '#174A7C', borderDash: [5,5] }]
        },
        options: { scales: { y: { min: 0, max: 100 } } }
    });

    let totalPicking = 0, totalDeposito = 0, totalAreaVendas = 0, totalNaoEnc = 0;
    dados.forEach(a => {
        totalPicking += a.picking || 0;
        totalDeposito += a.deposito || 0;
        totalAreaVendas += a.areaVendas || 0;
        totalNaoEnc += a.naoEncontrados || 0;
    });

    charts['dashLocalizacao'] = new Chart(document.getElementById('chartDashLocalizacao'), {
        type: 'doughnut',
        data: {
            labels: ['Picking', 'DepÃ³sito', 'Ãrea de Vendas', 'NÃ£o Encontrados'],
            datasets: [{
                data: [totalPicking, totalDeposito, totalAreaVendas, totalNaoEnc],
                backgroundColor: ['#174A7C', '#2E75B6', '#28A745', '#DC3545']
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const val = ctx.parsed;
                            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0.0';
                            return `${ctx.label}: ${val} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ====== ANÃLISES ======
function generateSmartAnalysis() {
    const listEl = document.getElementById('insights-list');
    if (!listEl) return;
    
    if (appData.audits.length === 0) {
        listEl.innerHTML = '<p class="text-muted">Nenhuma auditoria cadastrada.</p>';
        return;
    }
    
    const porSetor = {}, porDiv = {}, porDia = {};
    appData.audits.forEach(a => {
        if (!porSetor[a.setor]) porSetor[a.setor] = { prev: 0, enc: 0 };
        porSetor[a.setor].prev += a.previstos;
        porSetor[a.setor].enc += a.encontrados;
        
        if (!porDiv[a.divisao]) porDiv[a.divisao] = { prev: 0, enc: 0 };
        porDiv[a.divisao].prev += a.previstos;
        porDiv[a.divisao].enc += a.encontrados;
        
        if (!porDia[a.data]) porDia[a.data] = { prev: 0, enc: 0 };
        porDia[a.data].prev += a.previstos;
        porDia[a.data].enc += a.encontrados;
    });
    
    let melhorSetor = '', piorSetor = '', valMelhor = -1, valPior = 101;
    Object.keys(porSetor).forEach(s => {
        const c = (porSetor[s].enc/porSetor[s].prev)*100;
        if (c > valMelhor) { valMelhor = c; melhorSetor = s; }
        if (c < valPior) { valPior = c; piorSetor = s; }
    });
    
    let melhorDiv = '', piorDiv = '', vMelhor = -1, vPior = 101;
    Object.keys(porDiv).forEach(d => {
        const c = (porDiv[d].enc/porDiv[d].prev)*100;
        if (c > vMelhor) { vMelhor = c; melhorDiv = d; }
        if (c < vPior) { vPior = c; piorDiv = d; }
    });
    
    let diasAcima = 0, diasAbaixo = 0, soma = 0;
    const numDias = Object.keys(porDia).length;
    Object.keys(porDia).forEach(d => {
        const c = (porDia[d].enc/porDia[d].prev)*100;
        soma += c;
        c >= appData.config.metaLoja ? diasAcima++ : diasAbaixo++;
    });
    
    listEl.innerHTML = `
        <div class="insight-item positive">
            <span>${icon('target')} Melhor Setor: <strong>${sanitizeHTML(melhorSetor)}</strong></span>
            <span class="insight-val text-success">${valMelhor.toFixed(1)}%</span>
        </div>
        <div class="insight-item negative">
            <span>${icon('xCircle')} Pior Setor: <strong>${sanitizeHTML(piorSetor)}</strong></span>
            <span class="insight-val text-danger">${valPior.toFixed(1)}%</span>
        </div>
        <div class="insight-item positive">
            <span>${icon('award')} Melhor DivisÃ£o: <strong>${sanitizeHTML(melhorDiv)}</strong></span>
            <span class="insight-val text-success">${vMelhor.toFixed(1)}%</span>
        </div>
        <div class="insight-item negative">
            <span>${icon('alertTriangle')} Pior DivisÃ£o: <strong>${sanitizeHTML(piorDiv)}</strong></span>
            <span class="insight-val text-danger">${vPior.toFixed(1)}%</span>
        </div>
        <div class="insight-item neutral">
            <span>${icon('calendar')} Dias acima da meta:</span>
            <span class="insight-val">${diasAcima} dias</span>
        </div>
        <div class="insight-item negative">
            <span>${icon('trendingDown')} Dias abaixo da meta:</span>
            <span class="insight-val">${diasAbaixo} dias</span>
        </div>
        <div class="insight-item neutral">
            <span>${icon('barChart')} MÃ©dia diÃ¡ria:</span>
            <span class="insight-val">${numDias > 0 ? (soma/numDias).toFixed(1) : '0.0'}%</span>
        </div>
    `;
}

// ====== CALENDÃRIO ======
function changeCalendarMonth(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendar-days-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const ano = currentCalendarDate.getFullYear();
    const mes = currentCalendarDate.getMonth();
    
    const mesesNomes = ["Janeiro", "Fevereiro", "MarÃ§o", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    document.getElementById('calendar-month-year').innerText = `${mesesNomes[mes]} de ${ano}`;
    
    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();
    
    for (let i = 0; i < primeiroDia; i++) {
        container.innerHTML += '<div class="day-box empty"></div>';
    }
    
    const auditoriasMes = appData.audits.filter(a => {
        const d = new Date(a.data + 'T00:00:00');
        return d.getFullYear() === ano && d.getMonth() === mes;
    });
    
    const dadosDias = {};
    auditoriasMes.forEach(a => {
        const diaNum = parseInt(a.data.split('-')[2]);
        if (!dadosDias[diaNum]) dadosDias[diaNum] = { prev: 0, enc: 0 };
        dadosDias[diaNum].prev += a.previstos;
        dadosDias[diaNum].enc += a.encontrados;
    });
    
    for (let dia = 1; dia <= totalDias; dia++) {
        let statusClass = '';
        let infoTexto = '';
        
        if (dadosDias[dia]) {
            const taxa = (dadosDias[dia].enc / dadosDias[dia].prev) * 100;
            infoTexto = `${taxa.toFixed(1)}%`;
            
            if (taxa >= appData.config.metaLoja) statusClass = 'status-green';
            else if (taxa >= 96.0) statusClass = 'status-yellow';
            else statusClass = 'status-red';
        }
        
        const dataISO = `${ano}-${String(mes+1).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
        
        container.innerHTML += `
            <div class="day-box ${statusClass}" onclick="openCalendarDayDetails('${sanitizeAttr(dataISO)}')">
                <span class="day-number">${dia}</span>
                <span class="day-info">${sanitizeHTML(infoTexto)}</span>
            </div>
        `;
    }
}

function openCalendarDayDetails(dataStr) {
    const modal = document.getElementById('calendar-modal');
    const body = document.getElementById('calendar-modal-body');
    if (!modal || !body) return;
    
    const auditsDia = appData.audits.filter(a => a.data === dataStr);
    const dataFmt = dataStr.split('-').reverse().join('/');
    
    body.innerHTML = `<h5>Dia ${sanitizeHTML(dataFmt)}</h5><hr style="margin:10px 0">`;
    
    if (auditsDia.length === 0) {
        body.innerHTML += '<p class="text-muted">Nenhuma auditoria neste dia.</p>';
    } else {
        auditsDia.forEach(a => {
            body.innerHTML += `
                <div class="modal-item-detail">
                    <strong>${sanitizeHTML(a.setor)} - ${sanitizeHTML(a.divisao)}</strong><br>
                    Conformidade: ${sanitizeHTML(String(a.conformidade))}% | Auditor: ${sanitizeHTML(a.auditor)}<br>
                    Obs: ${sanitizeHTML(a.observacao || 'Nenhuma')}
                </div>
            `;
        });
    }
    
    modal.classList.remove('hidden');
}

function closeCalendarModal() {
    const modal = document.getElementById('calendar-modal');
    if (modal) modal.classList.add('hidden');
}

window.onclick = function(event) {
    const modal = document.getElementById('calendar-modal');
    if (event.target === modal) closeCalendarModal();
};

// ====== RELATÃ“RIO DE DIVISÃ•ES ======
function populateReportSetorOptions() {
    const sel = document.getElementById('rel-setor');
    if (!sel) return;
    const valorAtual = sel.value;
    sel.innerHTML = '<option value="">Todos os Setores</option>';
    appData.config.setores.forEach(s => sel.innerHTML += `<option value="${sanitizeAttr(s)}">${sanitizeHTML(s)}</option>`);
    sel.value = valorAtual;
}

function populateDivisaoFilterOptions() {
    const selSetor = document.getElementById('rel-setor');
    const selDivisao = document.getElementById('rel-divisao');
    if (!selSetor || !selDivisao) return;

    const setorEscolhido = selSetor.value;
    const valorAtual = selDivisao.value;

    const divisoes = [...new Set(
        appData.audits
            .filter(a => !setorEscolhido || a.setor === setorEscolhido)
            .map(a => a.divisao)
    )].sort((a, b) => a.localeCompare(b));

    selDivisao.innerHTML = '<option value="">Selecione uma DivisÃ£o</option>';
    divisoes.forEach(d => selDivisao.innerHTML += `<option value="${sanitizeAttr(d)}">${sanitizeHTML(d)}</option>`);

    if (divisoes.includes(valorAtual)) selDivisao.value = valorAtual;
}

function limparFiltrosRelatorio() {
    document.getElementById('rel-setor').value = '';
    document.getElementById('rel-divisao').value = '';
    document.getElementById('rel-data-inicio').value = '';
    document.getElementById('rel-data-fim').value = '';
    populateDivisaoFilterOptions();
    gerarRelatorioDivisao();
}

function gerarRelatorioDivisao() {
    const setor = document.getElementById('rel-setor')?.value || '';
    const divisao = document.getElementById('rel-divisao')?.value || '';
    const dataInicio = document.getElementById('rel-data-inicio')?.value || '';
    const dataFim = document.getElementById('rel-data-fim')?.value || '';

    const tbody = document.getElementById('relatorio-body');
    const subtitulo = document.getElementById('rel-subtitulo');
    if (!tbody) return;

    let dados = [...appData.audits];
    if (setor) dados = dados.filter(a => a.setor === setor);
    if (divisao) dados = dados.filter(a => a.divisao === divisao);
    if (dataInicio) dados = dados.filter(a => a.data >= dataInicio);
    if (dataFim) dados = dados.filter(a => a.data <= dataFim);

    dados.sort((a, b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora));

    if (subtitulo) {
        subtitulo.innerText = divisao
            ? `DivisÃ£o: ${divisao}${setor ? ' | Setor: ' + setor : ''} â€” gerado em ${new Date().toLocaleDateString('pt-BR')}`
            : `Todas as divisÃµes${setor ? ' â€” Setor: ' + setor : ''} â€” gerado em ${new Date().toLocaleDateString('pt-BR')}`;
    }

    if (dados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align:center;">Nenhum dado para exibir.</td></tr>';
        document.getElementById('rel-conformidade').innerText = '0%';
        document.getElementById('rel-ruptura').innerText = '0%';
        document.getElementById('rel-total').innerText = '0';
        document.getElementById('rel-nao-encontrados').innerText = '0';
        document.getElementById('rel-total-picking').innerText = '0';
        document.getElementById('rel-total-deposito').innerText = '0';
        document.getElementById('rel-total-areavendas').innerText = '0';
        return;
    }

    let tPrev = 0, tEnc = 0, tNaoEnc = 0, tPicking = 0, tDeposito = 0, tAreaVendas = 0;
    tbody.innerHTML = '';
    dados.forEach(a => {
        tPrev += a.previstos;
        tEnc += a.encontrados;
        tNaoEnc += a.naoEncontrados;
        tPicking += a.picking || 0;
        tDeposito += a.deposito || 0;
        tAreaVendas += a.areaVendas || 0;
        const dataFmt = formatarDataBR(a.data);
        const isAcima = a.conformidade >= appData.config.metaLoja;

        tbody.innerHTML += `
            <tr>
                <td><strong>${sanitizeHTML(dataFmt)}</strong></td>
                <td>${sanitizeHTML(a.setor)}</td>
                <td>${sanitizeHTML(a.divisao)}</td>
                <td>${sanitizeHTML(String(a.previstos))}</td>
                <td>${sanitizeHTML(String(a.picking ?? '-'))}</td>
                <td>${sanitizeHTML(String(a.deposito ?? '-'))}</td>
                <td>${sanitizeHTML(String(a.areaVendas ?? '-'))}</td>
                <td class="text-danger">${sanitizeHTML(String(a.naoEncontrados))}</td>
                <td class="${isAcima ? 'text-success' : 'text-danger'}" style="font-weight:700;">${sanitizeHTML(String(a.conformidade))}%</td>
                <td class="text-danger">${sanitizeHTML(String(a.ruptura))}%</td>
                <td>${sanitizeHTML(a.observacao || '-')}</td>
            </tr>
        `;
    });

    const confMedia = tPrev > 0 ? ((tEnc / tPrev) * 100).toFixed(1) : '0.0';
    const rupMedia = tPrev > 0 ? (100 - parseFloat(confMedia)).toFixed(1) : '0.0';

    document.getElementById('rel-conformidade').innerText = `${confMedia}%`;
    document.getElementById('rel-ruptura').innerText = `${rupMedia}%`;
    document.getElementById('rel-total').innerText = dados.length;
    document.getElementById('rel-nao-encontrados').innerText = tNaoEnc;
    document.getElementById('rel-total-picking').innerText = tPicking;
    document.getElementById('rel-total-deposito').innerText = tDeposito;
    document.getElementById('rel-total-areavendas').innerText = tAreaVendas;
}

// ====== EXPORTAÃ‡ÃƒO CSV ======
function exportToCSV() {
    if (appData.audits.length === 0) {
        showToast('Nenhum dado para exportar.', true);
        return;
    }
    
    let csv = '\uFEFFData;Hora;Setor;Divisao;Previstos;Picking;Deposito;AreaVendas;Encontrados;NaoEncontrados;Conformidade;Ruptura;Auditor;Observacao\n';
    
    appData.audits.forEach(a => {
        csv += `${a.data};${a.hora};${a.setor};${a.divisao};${a.previstos};${a.picking ?? ''};${a.deposito ?? ''};${a.areaVendas ?? ''};${a.encontrados};${a.naoEncontrados};${a.conformidade};${a.ruptura};${a.auditor};${a.observacao || ''}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AuditSort38_${new Date().toISOString().substring(0,10)}.csv`;
    link.click();
    showToast('Exportado com sucesso!');
}

// ====== BACKUP JSON ======
function downloadJSONBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData));
    const link = document.createElement('a');
    link.href = dataStr;
    link.download = `Backup_AuditSort38_${new Date().toISOString().substring(0,10)}.json`;
    link.click();
    showToast('Backup baixado!');
}

function triggerImportFile() {
    document.getElementById('file-import-json').click();
}

function importJSONBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (parsed.config && parsed.audits) {
                if (!Array.isArray(parsed.audits) || parsed.audits.length > 10000) {
                    showToast('Arquivo invÃ¡lido ou excessivamente grande!', true);
                    return;
                }
                appData = parsed;
                saveToLocalStorage();
                
                if (USAR_GOOGLE_SHEETS && parsed.audits.length > 0) {
                    await salvarNaPlanilha(parsed.audits);
                }
                
                populateSelectOptions();
                renderConfigLists();
                updateGlobalMetrics();
                showToast('Restaurado com sucesso!');
            } else {
                showToast('Arquivo invÃ¡lido!', true);
            }
        } catch (err) {
            showToast('Erro ao ler arquivo.', true);
        }
    };
    reader.readAsText(file);
}

function resetAllApplicationData() {
    const modalHTML = `
        <div id="confirm-modal" class="modal" style="display: flex;">
            <div class="modal-content" style="max-width: 420px; text-align: center;">
                <h4 style="margin-bottom: 15px;">${icon('alertTriangle')} AtenÃ§Ã£o: AÃ§Ã£o IrreversÃ­vel</h4>
                <p style="margin-bottom: 20px;">Isso apagarÃ¡ <strong>TODOS</strong> os dados de auditorias e configuraÃ§Ãµes. Essa aÃ§Ã£o nÃ£o pode ser desfeita.</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-secondary" onclick="fecharConfirmModal()">Cancelar</button>
                    <button class="btn-danger" id="btn-confirmar-reset">Sim, Apagar Tudo</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('btn-confirmar-reset').onclick = function() {
        fecharConfirmModal();
        localStorage.removeItem('auditsort38_v2_data');
        localStorage.removeItem('auditsort38_session');
        localStorage.removeItem('auditsort38_user');
        appData = {
            audits: [],
            config: {
                auditores: ['Auditor Principal', 'CoordenaÃ§Ã£o Loja 38', 'Auditor Setorial'],
                setores: ['Mercearia', 'Frios e LaticÃ­nios', 'Hortifruti', 'AÃ§ougue e Peixaria', 'Bazar e TÃªxtil', 'Padaria'],
                metaLoja: 98.0
            }
        };
        saveToLocalStorage();
        renderConfigLists();
        populateSelectOptions();
        updateGlobalMetrics();
        renderHomeChart();
        showToast('Todos os dados foram apagados!', true);
        setTimeout(() => {
            location.reload();
        }, 1500);
    };
}
