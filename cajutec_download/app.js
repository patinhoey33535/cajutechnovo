// ══════════════ DATA ══════════════
const VIDEOS=[
  {id:1,cat:'Plantio',catColor:'#dcfce7',catTextColor:'#16a34a',title:'Como Plantar o Cajueiro do Zero',desc:'Aprenda o passo a passo completo do plantio do cajueiro: da escolha do local ao cuidado com as mudas nos primeiros meses.',videoId:'Vc_o1vG6ueY',dur:'4 min'},
  {id:2,cat:'Pragas',catColor:'#fee2e2',catTextColor:'#dc2626',title:'Mosca-da-fruta: Identificação e Controle',desc:'A mosca-da-fruta é uma das pragas mais prejudiciais ao cajueiro. Aprenda a identificar e controlar com eficiência.',videoId:'TPQA3uCecvU',dur:'13 min'},
  {id:3,cat:'Pragas',catColor:'#fee2e2',catTextColor:'#dc2626',title:'Pragas do Cajueiro: Guia Completo',desc:'Conheça todas as principais pragas que atacam o cajueiro no Nordeste brasileiro e as melhores estratégias de controle.',videoId:'hJpOhm_Wjn8',dur:'11 min'},
  {id:4,cat:'Pragas',catColor:'#fee2e2',catTextColor:'#dc2626',title:'Manejo Integrado de Pragas (MIP)',desc:'O MIP é a abordagem mais moderna e sustentável para proteger seu cajueiral com menor uso de defensivos.',videoId:'u_ZS58PH6uo',dur:'9 min'},
  {id:5,cat:'Colheita',catColor:'#fef3c7',catTextColor:'#d97706',title:'Colheita do Caju: Momento Certo e Técnicas',desc:'Saber o momento ideal de colher é fundamental para garantir a qualidade e reduzir perdas.',videoId:'c6YWjB1_cAM',dur:'8 min'},
  {id:6,cat:'Processamento',catColor:'#fed7aa',catTextColor:'#ea580c',title:'Processamento da Castanha de Caju',desc:'Do campo à amêndoa de qualidade: aprenda todo o processo de beneficiamento da castanha.',videoId:'2N5maJrDMdc',dur:'1 min'},
  {id:7,cat:'Irrigação',catColor:'#dbeafe',catTextColor:'#2563eb',title:'Irrigação do Cajueiro: Quando e Quanto',desc:'A irrigação suplementar pode aumentar a produtividade do cajueiro em até 40% em regiões semiáridas.',videoId:'dAO3bhovIuk',dur:'5 min'},
  {id:8,cat:'Negócios',catColor:'#f3e8ff',catTextColor:'#7c3aed',title:'Como Vender Caju e Aumentar seu Lucro',desc:'Estratégias de comercialização, acesso a mercados e como agregar valor ao caju.',videoId:'eXLY8d538xE',dur:'6 min'},
];

const COURSES=[...VIDEOS];

// ══════════════ CLIMA REAL (Open-Meteo) ══════════════
async function fetchWeather(){
  const WX_CODES={0:'☀️ Céu limpo',1:'🌤️ Principalmente limpo',2:'⛅ Parcialmente nublado',3:'☁️ Nublado',45:'🌫️ Névoa',48:'🌫️ Névoa com gelo',51:'🌦️ Garoa leve',53:'🌦️ Garoa moderada',55:'🌧️ Garoa forte',61:'🌧️ Chuva leve',63:'🌧️ Chuva moderada',65:'🌧️ Chuva forte',71:'🌨️ Neve leve',80:'🌦️ Pancadas leves',81:'🌧️ Pancadas moderadas',82:'⛈️ Pancadas fortes',95:'⛈️ Trovoada',99:'⛈️ Trovoada com granizo'};
  try{
    const url='https://api.open-meteo.com/v1/forecast?latitude=-4.27&longitude=-41.78&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=precipitation_sum&timezone=America%2FFortaleza&forecast_days=1';
    const r=await fetch(url);
    const d=await r.json();
    const c=d.current;
    const temp=Math.round(c.temperature_2m);
    const hum=c.relative_humidity_2m;
    const wind=Math.round(c.wind_speed_10m);
    const rain=c.precipitation??0;
    const cond=WX_CODES[c.weather_code]??'🌡️ Clima variável';
    document.getElementById('wx-temp').textContent=temp+'°C';
    document.getElementById('wx-cond').textContent=cond;
    document.getElementById('wx-hum').textContent='💧 '+hum+'% Umidade';
    document.getElementById('wx-wind').textContent='💨 '+wind+' km/h';
    document.getElementById('wx-rain').textContent='🌧️ '+rain.toFixed(1)+' mm chuva hoje';
  }catch(e){
    document.getElementById('wx-cond').textContent='⚠️ Clima indisponível';
  }
}
fetchWeather();
setInterval(fetchWeather,10*60*1000);

// ══════════════ NAVEGAÇÃO ══════════════
function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const idx={'dashboard':0,'variedades':1,'plantacoes':2,'diagnostico':3,'marketplace':4,'financeiro':5,'rastreabilidade':6,'estoque':7,'alertas':8,'mensagens':9,'academia':10,'informacao':11};
  const links=document.querySelectorAll('nav a');
  if(idx[page]!==undefined)links[idx[page]].classList.add('active');
  if(page==='financeiro')initCharts();
  if(page==='academia')renderVideos('Todos');
  if(page==='mensagens'){document.getElementById('page-mensagens').style.display='flex';loadContacts();}else{const pm=document.getElementById('page-mensagens');if(pm)pm.style.display='none';}
  window.scrollTo?window.scrollTo(0,0):null;
  document.getElementById('content').scrollTop=0;
}

// ══════════════ TABS ══════════════
function switchTab(btn,pane){
  btn.closest('.tabs').querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
  document.getElementById(pane).classList.add('active');
}

// ══════════════ GRÁFICOS ══════════════
let chartsInitialized=false;
function initCharts(){
  if(chartsInitialized)return;chartsInitialized=true;
  const months=['Jan','Fev','Mar','Abr','Mai','Jun'];
  const income=[32000,28000,45000,38000,52000,60000];
  const expenses=[18000,15000,22000,19000,25000,28000];
  const profit=income.map((v,i)=>v-expenses[i]);

  new Chart(document.getElementById('chartFinancial'),{type:'line',data:{labels:months,datasets:[
    {label:'Receitas',data:income,borderColor:'#16a34a',backgroundColor:'rgba(22,163,74,.1)',fill:true,tension:.4,borderWidth:2.5,pointRadius:0},
    {label:'Custos',data:expenses,borderColor:'#dc2626',backgroundColor:'rgba(220,38,38,.08)',fill:true,tension:.4,borderWidth:2.5,pointRadius:0}
  ]},options:{responsive:true,plugins:{legend:{position:'top'}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{callback:v=>'R$'+(v/1000)+'k'}}}}});

  new Chart(document.getElementById('chartProfit'),{type:'bar',data:{labels:months,datasets:[{label:'Lucro',data:profit,backgroundColor:profit.map(v=>v>=0?'#16a34a':'#dc2626'),borderRadius:6}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{grid:{color:'rgba(0,0,0,.05)'},ticks:{callback:v=>'R$'+(v/1000)+'k'}}}}});

  new Chart(document.getElementById('chartExpense'),{type:'doughnut',data:{labels:['Insumos','Mão de Obra','Equipamentos','Irrigação','Outros'],datasets:[{data:[35,30,15,12,8],backgroundColor:['#dc2626','#f97316','#eab308','#3b82f6','#8b5cf6'],borderWidth:0}]},options:{responsive:true,plugins:{legend:{position:'bottom'}}}});
}

// ══════════════ VÍDEOS ══════════════
function renderVideos(cat){
  const filtered=cat==='Todos'?VIDEOS:VIDEOS.filter(v=>v.cat===cat);
  document.getElementById('video-grid').innerHTML=filtered.map(v=>`
    <div class="video-card">
      <div class="vc-thumb" onclick="openVideo('${v.videoId}','${v.title.replace(/'/g,"\\'")}','${v.desc.replace(/'/g,"\\'")}')">
        <img src="https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg" alt="${v.title}" loading="lazy"/>
        <div class="vc-play"><div class="vc-play-btn">▶</div></div>
        <div class="vc-cat"><span style="background:${v.catColor};color:${v.catTextColor};padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700">${v.cat}</span></div>
        <div class="vc-dur">${v.dur}</div>
      </div>
      <div class="vc-body">
        <div class="vc-title">${v.title}</div>
        <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="vc-yt">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.6V8.4L15.8 12l-6.3 3.6z"/></svg>
          youtube.com/watch?v=${v.videoId}
        </a>
        <div class="vc-desc">${v.desc}</div>
        <div class="vc-actions">
          <button class="vc-watch" onclick="openVideo('${v.videoId}','${v.title.replace(/'/g,"\\'")}','${v.desc.replace(/'/g,"\\'")}')">▶ Assistir</button>
          <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="btn" style="font-size:12px;padding:9px 14px">↗ YouTube</a>
        </div>
      </div>
    </div>`).join('');
}

function renderCourses(cat){
  const filtered=cat==='Todos'?COURSES:COURSES.filter(v=>v.cat===cat);
  const levels={1:'Iniciante',2:'Iniciante',3:'Intermediário',4:'Avançado',5:'Iniciante',6:'Intermediário',7:'Intermediário',8:'Iniciante'};
  const levelColors={'Iniciante':'badge-green','Intermediário':'badge-blue','Avançado':'badge-purple'};
  document.getElementById('course-grid').innerHTML=filtered.map(v=>{
    const lv=levels[v.id]||'Iniciante';
    return`<div class="video-card">
      <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="vc-thumb" style="display:block">
        <img src="https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg" alt="${v.title}" loading="lazy"/>
        <div class="vc-play"><div class="vc-play-btn">▶</div></div>
        <div class="vc-cat"><span class="badge badge-green" style="font-size:11px">GRATUITO</span></div>
        <div class="vc-dur">${v.dur}</div>
      </a>
      <div class="vc-body">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <span class="badge ${levelColors[lv]}">${lv}</span>
          <span style="font-size:12px;color:var(--muted)">${v.cat}</span>
        </div>
        <div class="vc-title">${v.title}</div>
        <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="vc-yt">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.6V8.4L15.8 12l-6.3 3.6z"/></svg>
          youtube.com/watch?v=${v.videoId}
        </a>
        <div class="vc-desc">${v.desc}</div>
        <div class="vc-actions">
          <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="vc-watch">▶ Assistir</a>
          <a href="https://www.youtube.com/watch?v=${v.videoId}" target="_blank" class="btn" style="font-size:12px;padding:9px 14px">↗ YouTube</a>
        </div>
      </div>
    </div>`;}).join('');
}

function filterVideos(btn,cat){
  document.querySelectorAll('#vid-pills .pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');renderVideos(cat);
}
function filterCourses(btn,cat){
  btn.closest('.pills').querySelectorAll('.pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');renderCourses(cat);
}

// ══════════════ MODAL DE VÍDEO ══════════════
function openVideo(id,title,desc){
  document.getElementById('vid-modal-frame').src=`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  document.getElementById('vid-modal-title').textContent=title;
  document.getElementById('vid-modal-desc').textContent=desc;
  document.getElementById('vid-modal-yt').href=`https://www.youtube.com/watch?v=${id}`;
  document.getElementById('vid-modal').classList.add('open');
}
function closeVidModal(){
  document.getElementById('vid-modal').classList.remove('open');
  document.getElementById('vid-modal-frame').src='';
}

// ══════════════ DIAGNÓSTICO — BASE EMBRAPA ══════════════
const EMBRAPA_DISEASES = [
  {
    id:'antracnose',
    name:'Antracnose',
    sci:'Colletotrichum spp.',
    emoji:'🟤',
    severity:'Alta',
    color:'#dc2626', bg:'#fff1f2', border:'#fecdd3',
    desc:'Historicamente a doença mais importante do cajueiro no Brasil. Causada por um complexo de várias espécies do fungo Colletotrichum. Ocorre nas folhas, ramos, pedúnculos, maturis e frutos.',
    symptoms:['mancha_marrom','mancha_escura_castanha','queda_flor','folhas_doentes','alta_umidade'],
    symptomWeights:{mancha_marrom:40,mancha_escura_castanha:35,queda_flor:15,folhas_doentes:20,alta_umidade:10},
    partsAffected:['folha','fruto','tronco','flor'],
    controls:[
      {type:'fungicida',icon:'🧪',text:'Azoxistrobina — aplicar no início da floração'},
      {type:'fungicida',icon:'🧪',text:'Difeconazol — eficaz em condições de alta umidade'},
      {type:'fungicida',icon:'🧪',text:'Oxicloreto de cobre — uso preventivo'},
      {type:'cultural',icon:'🌿',text:'Aplicar somente quando houver umidade alta + lançamento foliar simultâneos'},
      {type:'cultural',icon:'✂️',text:'Remoção e queima de partes afetadas'},
    ],
    resistantClones:{
      'CCP 06':'R','CCP 09':'S','CCP 76':'R','CCP 1001':'R',
      'EMBRAPA 50':'S','EMBRAPA 51':'R','BRS 189':'R','BRS 226':'R',
      'BRS 253':'R','BRS 265':'S','BRS 274':'S','BRS 275':'R',
      'FAGA 1':'S','FAGA 11':'S'
    },
    recommended:['CCP 06','CCP 76','CCP 1001','EMBRAPA 51','BRS 189','BRS 226','BRS 253','BRS 275'],
    urgency:'alta',
    source:'Cardoso, J.E. — Embrapa Agroindústria Tropical, Abr/2019'
  },
  {
    id:'oidio',
    name:'Oídio',
    sci:'Erysiphe quercicola (sin. Oidium anacardii)',
    emoji:'⚪',
    severity:'Muito Alta',
    color:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe',
    desc:'A doença mais importante do cajueiro no Brasil. Parasita obrigatório que ataca todas as regiões produtoras. Os danos à produção de castanha e à qualidade do pedúnculo são inestimáveis.',
    symptoms:['po_branco','queda_flor','folhas_doentes','mancha_marrom'],
    symptomWeights:{po_branco:60,queda_flor:25,folhas_doentes:20,mancha_marrom:5},
    partsAffected:['folha','fruto','flor'],
    controls:[
      {type:'fungicida',icon:'🧪',text:'Enxofre elementar — principal controle, quase exclusivo'},
      {type:'fungicida',icon:'🧪',text:'Kumulus® (enxofre formulado) — 300g/100L de água (800 L/ha)'},
      {type:'cultural',icon:'📅',text:'Iniciar pulverizações no começo da floração'},
      {type:'cultural',icon:'🔍',text:'Monitoramento semanal para ajustar frequência de aplicações'},
    ],
    resistantClones:{
      'CCP 06':'S','CCP 09':'I','CCP 76':'S','CCP 1001':'R',
      'EMBRAPA 50':'I','EMBRAPA 51':'S','BRS 189':'S','BRS 226':'I',
      'BRS 253':'R','BRS 265':'S','BRS 274':'R','BRS 275':'R',
      'FAGA 1':'S','FAGA 11':'I'
    },
    recommended:['CCP 1001','BRS 253','BRS 274','BRS 275'],
    urgency:'alta',
    source:'Cardoso, J.E. — Embrapa Agroindústria Tropical, Abr/2019'
  },
  {
    id:'mofo_preto',
    name:'Mofo-preto',
    sci:'Pilgeriella anacardii',
    emoji:'⚫',
    severity:'Média-Alta',
    color:'#374151', bg:'#f9fafb', border:'#d1d5db',
    desc:'Causada pelo fungo biotrófico Pilgeriella anacardii, sendo o cajueiro o único hospedeiro conhecido. Vem aumentando sua ocorrência no litoral nordestino com a expansão do cajueiro-anão.',
    symptoms:['mancha_preta_inferior','alta_umidade'],
    symptomWeights:{mancha_preta_inferior:70,alta_umidade:15},
    partsAffected:['folha'],
    controls:[
      {type:'fungicida',icon:'🧪',text:'Fungicidas cúpricos (oxicloreto de cobre ou hidróxido de cobre)'},
      {type:'cultural',icon:'🌿',text:'Pulverizações preventivas na face inferior das folhas'},
      {type:'cultural',icon:'🌱',text:'Preferir clones resistentes em novas áreas de plantio'},
    ],
    resistantClones:{
      'CCP 06':'R','CCP 09':'S','CCP 76':'S','CCP 1001':'S',
      'EMBRAPA 50':'MR','EMBRAPA 51':'MR','BRS 189':'S','BRS 226':'MR',
      'BRS 253':'R','BRS 265':'R','BRS 274':'S','BRS 275':'R',
      'FAGA 1':'R','FAGA 11':'R'
    },
    recommended:['CCP 06','BRS 253','BRS 265','BRS 275','FAGA 1','FAGA 11'],
    urgency:'media',
    source:'Cardoso, J.E. — Embrapa Agroindústria Tropical, Abr/2019'
  },
  {
    id:'resinose',
    name:'Resinose / PPH',
    sci:'Família Botryosphaeriaceae',
    emoji:'🟡',
    severity:'Alta',
    color:'#d97706', bg:'#fffbeb', border:'#fde68a',
    desc:'Complexo de doenças causadas por várias espécies de fungos da família Botryosphaeriaceae. O fungo permanece em fase de dormência (endofitismo) e ataca quando a planta sofre estresse. Controle muito difícil.',
    symptoms:['resina_goma','cancro_tronco','necrose_ramos'],
    symptomWeights:{resina_goma:50,cancro_tronco:45,necrose_ramos:40},
    partsAffected:['tronco'],
    controls:[
      {type:'preventivo',icon:'🌱',text:'Plantar clones resistentes — BRS 226 ou EMBRAPA 51 em áreas vulneráveis'},
      {type:'preventivo',icon:'⚠️',text:'Vulnerabilidade alta em altitudes >600m e amplitude térmica >10°C/dia'},
      {type:'cultural',icon:'✂️',text:'Poda e remoção dos ramos afetados com desinfecção dos equipamentos'},
      {type:'cultural',icon:'🔍',text:'Diagnóstico difícil — percepção tardia quando doença já é severa'},
    ],
    resistantClones:{
      'CCP 06':'R','CCP 09':'S','CCP 76':'S','CCP 1001':'S',
      'EMBRAPA 50':'-','EMBRAPA 51':'MR','BRS 189':'S','BRS 226':'R',
      'BRS 253':'-','BRS 265':'S','BRS 274':'MR','BRS 275':'S',
      'FAGA 1':'S','FAGA 11':'S'
    },
    recommended:['CCP 06','EMBRAPA 51','BRS 226'],
    urgency:'alta',
    source:'Cardoso, J.E. — Embrapa Agroindústria Tropical, Abr/2019'
  }
];

const KEYWORD_MAP = {
  po_branco:['pó','po','branco','branca','cinza','acinzentado','pulverulento','oídio','oidio','farinha','empoado'],
  mancha_marrom:['mancha','marrom','marrum','necros','pardo','avermelhad','escura','ramos','lesão'],
  mancha_preta_inferior:['preto','preta','inferior','debaixo','face','folha','embaixo','negra'],
  mancha_escura_castanha:['castanha','fruto','pedúnculo','rachadura','escura','castanho'],
  resina_goma:['resina','goma','exsud','borracha','viscoso','líquido','exsudação'],
  cancro_tronco:['cancro','tronco','caule','lenhos','haste','morte','corte'],
  necrose_ramos:['necrose','galho','seco','mort','descend','murcho','murcha','colapso'],
  queda_flor:['flor','flores','queda','cair','caindo','frutificação','baixa'],
  folhas_doentes:['folha nova','lançamento','jovem','brotação','broto'],
  alta_umidade:['chuva','umidade','úmido','molhado','molhada','estação chuvosa'],
};

let selectedPart = 'folha';

function setPart(btn, part){
  document.querySelectorAll('#part-pills .pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  selectedPart = part;
  autoAnalyze();
}

function autoAnalyze(){
  const checked = Array.from(document.querySelectorAll('.diag-cb:checked')).map(c=>c.value);
  if(checked.length === 0) return;
  if(checked.length >= 1) runDiagnosis();
}

function getSymptomScores(checkedSymptoms, textKeywords=[]){
  return EMBRAPA_DISEASES.map(disease => {
    let score = 0;
    let matched = [];
    checkedSymptoms.forEach(sym => {
      if(disease.symptomWeights[sym]){
        score += disease.symptomWeights[sym];
        matched.push(sym);
      }
    });
    textKeywords.forEach(kw => {
      Object.entries(KEYWORD_MAP).forEach(([sym, words]) => {
        if(words.some(w => kw.includes(w) || w.includes(kw))){
          if(disease.symptomWeights[sym] && !matched.includes(sym)){
            score += disease.symptomWeights[sym] * 0.7;
            matched.push(sym+'_text');
          }
        }
      });
    });
    if(disease.partsAffected.includes(selectedPart) || selectedPart==='todos') score *= 1.15;
    const clone = document.getElementById('clone-select').value;
    if(clone && disease.resistantClones[clone]==='S') score *= 1.2;
    if(clone && disease.resistantClones[clone]==='R') score *= 0.6;
    return {disease, score: Math.round(score), matched};
  }).sort((a,b)=>b.score-a.score);
}

function renderResults(scored, chatMode=false){
  const box = document.getElementById('diag-result-box');
  const max = scored[0]?.score || 1;
  if(max === 0){
    box.innerHTML=`<div style="text-align:center;padding:32px;color:var(--muted)"><div style="font-size:40px;opacity:.3;margin-bottom:12px">🤔</div><p style="font-size:14px;font-weight:600">Sintomas não identificados</p><p style="font-size:13px;margin-top:6px">Tente selecionar sintomas mais específicos ou consultar um técnico agrícola.</p></div>`;
    return;
  }

  const clone = document.getElementById('clone-select').value;
  const cloneNote = clone ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#92400e"><strong>🌱 Clone: ${clone}</strong> — resistência considerada na análise</div>` : '';

  box.innerHTML = `
    <div style="padding:4px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border)">
        <div style="width:40px;height:40px;border-radius:12px;background:rgba(61,107,47,.1);display:flex;align-items:center;justify-content:center;font-size:20px">🤖</div>
        <div>
          <strong style="font-size:14px;display:block">Análise Concluída</strong>
          <span style="font-size:12px;color:var(--muted)">${chatMode?'Busca por texto':'Sintomas selecionados'} · Fonte: Embrapa 2019</span>
        </div>
        <div style="margin-left:auto"><span class="badge badge-green">IA Ativa</span></div>
      </div>
      ${cloneNote}
      <p style="font-size:12px;color:var(--muted);margin-bottom:16px;text-transform:uppercase;letter-spacing:.05em;font-weight:700">Probabilidade por Doença</p>
      ${scored.map((s,i)=>{
        const pct = Math.min(100, Math.round((s.score/max)*100));
        if(pct < 5 && i > 0) return '';
        const d = s.disease;
        const cloneReact = clone ? d.resistantClones[clone] : null;
        const cloneBadge = cloneReact && cloneReact!=='-' ? `<span class="clone-tag ${cloneReact}" style="margin-left:8px">Seu clone: ${cloneReact==='R'?'Resistente':cloneReact==='S'?'Susceptível':cloneReact==='MR'?'Mod. Resistente':'Intermediário'}</span>` : '';
        return `
        <div class="diag-disease-card" style="background:${d.bg};border-color:${d.border};${i===0?'box-shadow:0 4px 20px rgba(0,0,0,.1)':'opacity:.85'}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
            <div>
              <div style="font-size:22px;margin-bottom:4px">${d.emoji}</div>
              <strong style="font-size:16px;color:${d.color}">${d.name}</strong>
              ${i===0?'<span class="badge" style="background:'+d.color+';color:#fff;margin-left:8px;font-size:10px">MAIS PROVÁVEL</span>':''}
              ${cloneBadge}
              <div style="font-size:11px;color:var(--muted);font-style:italic;margin-top:2px">${d.sci}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:26px;font-weight:900;color:${d.color}">${pct}%</div>
              <div style="font-size:10px;color:var(--muted)">probabilidade</div>
            </div>
          </div>
          <div class="disease-bar"><div class="disease-bar-fill" style="width:${pct}%;background:${d.color}"></div></div>
          ${i===0?`
          <p style="font-size:13px;color:var(--muted);line-height:1.6;margin:14px 0">${d.desc}</p>
          <div style="margin-bottom:14px">
            <strong style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">🧪 Controle Recomendado</strong>
            <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px">
              ${d.controls.map(c=>`<div style="display:flex;align-items:flex-start;gap:10px;background:rgba(255,255,255,.7);padding:10px 12px;border-radius:10px"><span style="font-size:16px">${c.icon}</span><span style="font-size:13px;line-height:1.4">${c.text}</span></div>`).join('')}
            </div>
          </div>
          <div>
            <strong style="font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)">🌱 Clones Resistentes Recomendados</strong>
            <div style="margin-top:8px;display:flex;flex-wrap:wrap">
              ${d.recommended.map(c=>`<span class="clone-tag R">${c}</span>`).join('')}
            </div>
          </div>
          <div style="margin-top:14px;padding-top:12px;border-top:1px solid ${d.border};font-size:11px;color:var(--muted)">📚 ${d.source}</div>
          <div style="display:flex;gap:8px;margin-top:14px">
            <button onclick="go('alertas')" class="btn" style="flex:1;justify-content:center;background:${d.color}">🔔 Criar Alerta</button>
            <button onclick="showCloneTable()" class="btn btn-outline" style="flex:1;justify-content:center;font-size:13px">🌱 Ver Tabela Clones</button>
          </div>
          `:''}
        </div>`;
      }).join('')}
    </div>`;
}

function runDiagnosis(){
  const checked = Array.from(document.querySelectorAll('.diag-cb:checked')).map(c=>c.value);
  if(!checked.length){ alert('Selecione pelo menos um sintoma.'); return; }
  const scored = getSymptomScores(checked);
  renderResults(scored, false);
}

function chatDiagnose(){
  const input = document.getElementById('diag-chat-input');
  const text = input.value.trim().toLowerCase();
  if(!text){ alert('Digite uma descrição dos sintomas.'); return; }
  const words = text.split(/[\s,\.]+/).filter(w=>w.length>2);
  const scored = getSymptomScores([], words);
  Object.entries(KEYWORD_MAP).forEach(([sym, kws])=>{
    if(words.some(w=> kws.some(k=>k.includes(w)||w.includes(k)))){
      const cb = document.querySelector(`.diag-cb[value="${sym}"]`);
      if(cb) cb.checked = true;
    }
  });
  renderResults(scored, true);
}

function quickSearch(term){
  document.getElementById('diag-chat-input').value = term;
  chatDiagnose();
}

function showCloneTable(){
  const rows = [
    ['CCP 06','R','R','R','S'],
    ['CCP 09','S','S','S','I'],
    ['CCP 76','R','S','S','S'],
    ['CCP 1001','R','S','S','R'],
    ['EMBRAPA 50','S','MR','—','I'],
    ['EMBRAPA 51','R','MR','MR','S'],
    ['BRS 189','R','S','S','S'],
    ['BRS 226','R','MR','R','I'],
    ['BRS 253','R','R','—','R'],
    ['BRS 265','S','R','S','S'],
    ['BRS 274','S','S','MR','R'],
    ['BRS 275','R','R','S','R'],
    ['FAGA 1','S','R','S','S'],
    ['FAGA 11','S','R','S','I'],
  ];
  const tagColors={R:'background:#dcfce7;color:#16a34a',S:'background:#fee2e2;color:#dc2626',MR:'background:#fef3c7;color:#d97706',I:'background:#dbeafe;color:#2563eb','—':'background:#f3f4f6;color:#9ca3af'};
  document.getElementById('clone-table-body').innerHTML = rows.map(r=>`<tr>
    <td style="font-weight:700">${r[0]}</td>
    ${r.slice(1).map(v=>`<td><span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;${tagColors[v]||''}">${v}</span></td>`).join('')}
  </tr>`).join('');
  document.getElementById('clone-modal').classList.add('open');
}

function closeCloneModal(){
  document.getElementById('clone-modal').classList.remove('open');
}

// ══════════════ MENSAGENS ══════════════
const API='/api';
let authToken=null;
let authUser=null;
let allContacts=[];
let activeContact=null;
let msgPollingInterval=null;

function apiHeaders(){return{Authorization:'Bearer '+authToken,'Content-Type':'application/json'};}

async function loadContacts(){
  if(!authToken)return;
  try{
    const r=await fetch(API+'/messages/users',{headers:apiHeaders()});
    const d=await r.json();
    allContacts=d.users||[];
    renderContacts(allContacts);
  }catch{}
}

function renderContacts(list){
  const el=document.getElementById('contacts-list');
  if(!list.length){el.innerHTML='<p style="padding:16px;color:var(--muted);font-size:13px;text-align:center">Nenhum agricultor cadastrado ainda.</p>';return;}
  el.innerHTML=list.map(u=>`
    <div onclick="openChat(${u.id},'${escHtml(u.name)}','${escHtml(u.role||'agricultor')}')"
      style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;cursor:pointer;transition:.15s;${activeContact?.id===u.id?'background:rgba(61,107,47,.1);':''}"
      onmouseover="this.style.background='rgba(61,107,47,.07)'" onmouseout="this.style.background='${activeContact?.id===u.id?'rgba(61,107,47,.1)':''}'"
      id="contact-${u.id}">
      <div style="width:38px;height:38px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0">${initials(u.name)}</div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escHtml(u.name)}</div>
        <div style="font-size:12px;color:var(--muted)">${escHtml(u.role||'Agricultor')}</div>
      </div>
      <span id="unread-${u.id}" style="display:none;background:#dc2626;color:#fff;border-radius:999px;font-size:10px;font-weight:700;padding:2px 7px"></span>
    </div>`).join('');
  fetchUnread();
}

function filterContacts(){
  const q=document.getElementById('msg-search').value.toLowerCase();
  renderContacts(q?allContacts.filter(u=>u.name.toLowerCase().includes(q)||u.email.toLowerCase().includes(q)):allContacts);
}

function initials(name){return(name||'?').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();}
function escHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

async function openChat(userId,name,role){
  activeContact={id:userId,name,role};
  document.getElementById('chat-placeholder').style.display='none';
  const ca=document.getElementById('chat-area');ca.style.display='flex';ca.style.flexDirection='column';
  document.getElementById('chat-avatar').textContent=initials(name);
  document.getElementById('chat-name').textContent=name;
  document.getElementById('chat-role').textContent='🌿 '+role;
  await loadMessages();
  document.getElementById('msg-input').focus();
}

async function loadMessages(){
  if(!activeContact||!authToken)return;
  try{
    const r=await fetch(API+'/messages/conversation/'+activeContact.id,{headers:apiHeaders()});
    const d=await r.json();
    renderMessages(d.messages||[]);
    fetchUnread();
  }catch{}
}

function renderMessages(msgs){
  const el=document.getElementById('chat-messages');
  if(!msgs.length){el.innerHTML='<div style="text-align:center;color:var(--muted);font-size:13px;padding:24px">Nenhuma mensagem ainda.<br>Diga olá! 👋</div>';return;}
  const myId=authUser.id;
  el.innerHTML=msgs.map(m=>{
    const mine=m.senderId===myId;
    const time=new Date(m.createdAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return`<div style="display:flex;justify-content:${mine?'flex-end':'flex-start'};margin:2px 0">
      <div style="max-width:72%;padding:10px 14px;border-radius:${mine?'18px 18px 4px 18px':'18px 18px 18px 4px'};background:${mine?'var(--primary)':'#fff'};color:${mine?'#fff':'var(--text)'};box-shadow:0 1px 4px rgba(0,0,0,.08);font-size:14px;line-height:1.5">
        ${escHtml(m.content)}
        <div style="font-size:10px;opacity:.6;margin-top:4px;text-align:right">${time}${mine&&m.read?' ✓✓':mine?' ✓':''}</div>
      </div></div>`;
  }).join('');
  el.scrollTop=el.scrollHeight;
}

async function sendMsg(){
  const input=document.getElementById('msg-input');
  const text=input.value.trim();
  if(!text||!activeContact||!authToken)return;
  input.value='';
  try{
    await fetch(API+'/messages/send/'+activeContact.id,{method:'POST',headers:apiHeaders(),body:JSON.stringify({content:text})});
    await loadMessages();
  }catch{}
}

function msgKeydown(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg();}}

async function fetchUnread(){
  if(!authToken){document.getElementById('msg-badge').style.display='none';return;}
  try{
    const r=await fetch(API+'/messages/unread',{headers:apiHeaders()});
    const d=await r.json();
    let total=0;
    (d.unread||[]).forEach(row=>{
      const el=document.getElementById('unread-'+row.senderId);
      if(el){el.style.display='inline';el.textContent=row.count;total+=row.count;}
    });
    const badge=document.getElementById('msg-badge');
    if(total>0){badge.style.display='inline';badge.textContent=total;}else{badge.style.display='none';}
  }catch{}
}

function startMsgPolling(){
  if(msgPollingInterval)clearInterval(msgPollingInterval);
  msgPollingInterval=setInterval(()=>{
    fetchUnread();
    if(activeContact)loadMessages();
  },8000);
  fetchUnread();
}

startMsgPolling();

// ══════════════ MAPA ══════════════
let myLat=null,myLon=null;
function showMap(lat,lon,label){
  const delta=0.05;
  const bbox=`${lon-delta},${lat-delta},${lon+delta},${lat+delta}`;
  document.getElementById('map-modal-frame').src=`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  document.getElementById('map-label').textContent=label;
  document.getElementById('map-coords').textContent=`${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  document.getElementById('gmaps-link').href=`https://www.google.com/maps?q=${lat},${lon}`;
  document.getElementById('directions-link').href=`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  document.getElementById('map-modal').classList.add('open');
}
function closeMapModal(){document.getElementById('map-modal').classList.remove('open');document.getElementById('map-modal-frame').src='';}
async function showListingMap(location){
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location+', Brasil')}&format=json&limit=1`);
    const d=await r.json();
    if(d.length)showMap(parseFloat(d[0].lat),parseFloat(d[0].lon),location);
    else window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`,'_blank');
  }catch{window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`,'_blank');}
}
function showMyMap(){if(myLat&&myLon)showMap(myLat,myLon,'Minha localização');}
function getLocation(){
  if(!navigator.geolocation){alert('Geolocalização não suportada.');return;}
  const btn=event.target;btn.textContent='📡 Obtendo...';btn.disabled=true;
  navigator.geolocation.getCurrentPosition(async pos=>{
    myLat=pos.coords.latitude;myLon=pos.coords.longitude;
    try{
      const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${myLat}&lon=${myLon}&format=json&accept-language=pt-BR`);
      const d=await r.json();
      const city=d.address?.city||d.address?.town||d.address?.village||`${myLat.toFixed(4)}, ${myLon.toFixed(4)}`;
      const state=d.address?.state_district||d.address?.state||'';
      const label=state?`${city}, ${state}`:city;
      document.getElementById('loc-text').textContent=`📍 ${label}`;
    }catch{document.getElementById('loc-text').textContent=`📍 ${myLat.toFixed(4)}, ${myLon.toFixed(4)}`;}
    document.getElementById('view-loc-btn').style.display='flex';
    btn.textContent='🔄 Atualizar';btn.disabled=false;
    showMyMap();
  },err=>{
    alert(err.code===1?'Permissão negada. Permita a localização no navegador.':'Erro ao obter localização.');
    btn.textContent='📡 Usar minha localização';btn.disabled=false;
  },{timeout:10000,enableHighAccuracy:true});
}
