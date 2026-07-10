# Google Apps Script - Autenticação e API

Cole este código no seu Google Apps Script (extensões > Apps Script) para suportar a autenticação via backend.

```javascript
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify(getAllData()))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  
  if (body.action === 'login') {
    return handleLogin(body.usuario, body.senha);
  }
  
  if (Array.isArray(body)) {
    return handleSaveAudits(body);
  }
  
  return ContentService.createTextOutput(JSON.stringify({error: 'Ação inválida'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (e.parameter.action === 'delete') {
    return handleDelete(e.parameter.id);
  }
  return ContentService.createTextOutput(JSON.stringify(getAllData()))
    .setMimeType(ContentService.MimeType.JSON);
}

// ====== AUTENTICAÇÃO ======
// IMPORTANTE: Adicione os usuários e senhas aqui
const USERS = {
  'GERENCIA38': '123456',
  'AUDITOR1': 'senha123',
  // Adicione mais usuários conforme necessário
};

function handleLogin(usuario, senha) {
  const sessionToken = Utilities.getUuid();
  
  if (USERS[usuario] && USERS[usuario] === senha) {
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      sessionToken: sessionToken,
      user: usuario
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Credenciais inválidas'
  })).setMimeType(ContentService.MimeType.JSON);
}

// ====== DADOS ======
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // <-- Troque pelo ID da sua planilha
const AUDITS_SHEET = 'Auditorias';

function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getAllData() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(AUDITS_SHEET);
    if (!sheet) return [];
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const audits = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) { // Skip empty rows
        audits.push({
          id: data[i][0],
          data: data[i][1],
          hora: data[i][2],
          auditor: data[i][3],
          setor: data[i][4],
          divisao: data[i][5],
          previstos: Number(data[i][6]),
          picking: Number(data[i][7]),
          deposito: Number(data[i][8]),
          areaVendas: Number(data[i][9]),
          encontrados: Number(data[i][10]),
          naoEncontrados: Number(data[i][11]),
          conformidade: Number(data[i][12]),
          ruptura: Number(data[i][13]),
          observacao: data[i][14]
        });
      }
    }
    return audits;
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    return [];
  }
}

function handleSaveAudits(auditsArray) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(AUDITS_SHEET);
    
    if (!sheet) {
      sheet = ss.insertSheet(AUDITS_SHEET);
      sheet.appendRow([
        'ID', 'Data', 'Hora', 'Auditor', 'Setor', 'Divisao',
        'Previstos', 'Picking', 'Deposito', 'AreaVendas',
        'Encontrados', 'NaoEncontrados', 'Conformidade', 'Ruptura', 'Observacao'
      ]);
    }
    
    if (!Array.isArray(auditsArray)) {
      auditsArray = [auditsArray];
    }
    
    auditsArray.forEach(audit => {
      // Verificar se já existe (update) ou inserir novo
      const existingRow = findRowById(sheet, audit.id);
      const rowData = [
        audit.id, audit.data, audit.hora, audit.auditor, audit.setor,
        audit.divisao, audit.previstos, audit.picking, audit.deposito,
        audit.areaVendas, audit.encontrados, audit.naoEncontrados,
        audit.conformidade, audit.ruptura, audit.observacao
      ];
      
      if (existingRow > 0) {
        sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
      } else {
        sheet.appendRow(rowData);
      }
    });
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleDelete(id) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName(AUDITS_SHEET);
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({error: 'Planilha não encontrada'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const row = findRowById(sheet, id);
    if (row > 0) {
      sheet.deleteRow(row);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error('Erro ao deletar:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === id) return i + 1;
  }
  return -1;
}
```

## Instruções de Configuração

1. Acesse https://script.google.com
2. Crie um novo projeto
3. Cole o código acima
4. Substitua `YOUR_SPREADSHEET_ID_HERE` pelo ID da sua planilha Google Sheets
5. Substitua as credenciais no objeto `USERS` conforme necessário
6. Implemente o projeto como API Web (Implantar > Nova implantação > Aplicativo da Web)
7. Copie a URL gerada e cole no `GOOGLE_SHEETS_API_URL` do `script.js`
8. Configure as permissões para "Qualquer pessoa" pode acessar (ou use autenticação)

### Segurança Recomendada

- Use senhas fortes (mínimo 8 caracteres, misture letras e números)
- Limite o acesso à planilha apenas para contas específicas
- Use HTTPS (já padrão no Google Apps Script)
- Considere adicionar rate limiting para prevenir brute force
