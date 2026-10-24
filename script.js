// Static data transcribed from the infographic supplied with this project.
const countries = [
  {name:'Costa Rica',flag:'🇨🇷',rate:-0.4},{name:'Switzerland',flag:'🇨🇭',rate:0.6},
  {name:'Liechtenstein',flag:'🇱🇮',rate:0.6},{name:'China',flag:'🇨🇳',rate:0.7},
  {name:'Thailand',flag:'🇹🇭',rate:0.7},{name:'Panama',flag:'🇵🇦',rate:1.0},
  {name:'Aruba',flag:'🇦🇼',rate:1.1},{name:'Belize',flag:'🇧🇿',rate:1.2},
  {name:'Grenada',flag:'🇬🇩',rate:1.2},{name:'Saint Vincent',flag:'🇻🇨',rate:1.3},
  {name:'Bahamas',flag:'🇧🇸',rate:1.3},{name:'Brunei',flag:'🇧🇳',rate:1.3},
  {name:'Bahrain',flag:'🇧🇭',rate:1.4},{name:'Oman',flag:'🇴🇲',rate:1.5},
  {name:'Fiji',flag:'🇫🇯',rate:1.5},{name:'Saudi Arabia',flag:'🇸🇦',rate:1.6},
  {name:'Vanuatu',flag:'🇻🇺',rate:1.6},{name:'Cabo Verde',flag:'🇨🇻',rate:1.7},
  {name:'Morocco',flag:'🇲🇦',rate:1.8},{name:'Kuwait',flag:'🇰🇼',rate:1.8}
];
const colors=['#d9aa55','#4299d3','#25a99a','#da9159','#8175cb','#ba609c','#31aaa8','#d97874','#7491d9','#b5a46c'];
const chart=document.querySelector('#chart');
const search=document.querySelector('#search');
const sort=document.querySelector('#sort');
const empty=document.querySelector('#empty');
const filter=document.querySelector('#filter');
const theme=document.querySelector('#theme');
const resultCount=document.querySelector('#result-count');
let visibleCountries=[];
const savedTheme=localStorage.getItem('inflation-theme');
if(savedTheme==='light') document.body.classList.add('light');
function updateThemeLabel(){theme.textContent=document.body.classList.contains('light')?'☾ Dark mode':'☀ Light mode';}
updateThemeLabel();
theme.addEventListener('click',()=>{
 document.body.classList.toggle('light');
 localStorage.setItem('inflation-theme',document.body.classList.contains('light')?'light':'dark');
 updateThemeLabel();
});

const rates=countries.map(item=>item.rate);
document.querySelector('#count').textContent=countries.length;
document.querySelector('#lowest').textContent=`${Math.min(...rates)}%`;
document.querySelector('#highest').textContent=`${Math.max(...rates)}%`;
document.querySelector('#average').textContent=`${(rates.reduce((sum,value)=>sum+value,0)/rates.length).toFixed(2)}%`;
function render(){
 const query=search.value.trim().toLocaleLowerCase();
 const filtered=countries.filter(item=>{
  const matchesName=item.name.toLocaleLowerCase().includes(query);
  const matchesRate=filter.value==='all'||(filter.value==='negative'&&item.rate<0)||
   (filter.value==='low'&&item.rate>=0&&item.rate<=1)||
   (filter.value==='high'&&item.rate>1);
  return matchesName&&matchesRate;
 });
 const mode=sort.value;
 filtered.sort((a,b)=>mode==='name'?a.name.localeCompare(b.name):mode==='desc'?b.rate-a.rate:a.rate-b.rate);
 visibleCountries=filtered;
 resultCount.textContent=`Showing ${filtered.length} of ${countries.length} countries`;
 chart.replaceChildren();
 filtered.forEach(item=>{
  const row=document.createElement('div');row.className=`row${item.rate<0?' negative':''}`;row.setAttribute('role','listitem');
  row.setAttribute('aria-label',`${item.name}: ${item.rate}% inflation`);
  const label=document.createElement('div');label.className='country';
  const flag=document.createElement('span');flag.className='flag';flag.textContent=item.flag;flag.setAttribute('aria-hidden','true');
  const name=document.createElement('span');name.textContent=item.name;label.append(flag,name);
  const track=document.createElement('div');track.className='track';
  const bar=document.createElement('div');bar.className='bar';bar.style.width=`${Math.abs(item.rate)/2*100}%`;
  bar.style.setProperty('--bar',colors[countries.indexOf(item)%colors.length]);track.append(bar);
  const value=document.createElement('span');value.className='value';value.textContent=`${item.rate}%`;
  row.title=`${item.name}: ${item.rate}%`;
  row.append(label,track,value);chart.append(row);
 });
 empty.hidden=filtered.length!==0;
}
search.addEventListener('input',render);
sort.addEventListener('change',render);
filter.addEventListener('change',render);
document.querySelector('#download').addEventListener('click',()=>{
 const rows=[['Country','Inflation rate (%)'],...visibleCountries.map(({name,rate})=>[name,rate])];
 const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
 const link=document.createElement('a');link.href=url;link.download='inflation-2026-filtered.csv';
 document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
render();
