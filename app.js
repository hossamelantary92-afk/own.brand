const CATEGORY_OVERRIDES=Object.freeze({}); // SKU: {id:'skin',sub:'غسول البشرة'} for verified exceptions
const IMAGE_MAP=Object.freeze({}); // Verified official image URLs can be added here by SKU.
const CATEGORIES=[
{id:'skin',name:'العناية بالبشرة',en:'Skin Care',icon:'✦',color:'#0876bf'},
{id:'hair',name:'العناية بالشعر',en:'Hair Care',icon:'◈',color:'#0876bf'},
{id:'oral',name:'العناية بالفم والأسنان',en:'Oral Care',icon:'✳',color:'#0876bf'},
{id:'baby',name:'العناية بالطفل',en:'Baby Care',icon:'♡',color:'#0876bf'},
{id:'supplements',name:'المكملات والتغذية',en:'Supplements & Nutrition',icon:'✚',color:'#0876bf'},
{id:'medical',name:'الأجهزة والمستلزمات الطبية',en:'Medical Devices',icon:'⊞',color:'#0876bf'},
{id:'personal',name:'العناية الشخصية',en:'Personal Care',icon:'❋',color:'#0876bf'},
{id:'medicines',name:'الأدوية والمستحضرات العلاجية',en:'Medicines',icon:'✜',color:'#0876bf'},
{id:'other',name:'منتجات متنوعة',en:'Other Products',icon:'▦',color:'#0876bf'}];
const SUBCATEGORY_ORDER={
skin:['غسول البشرة','كريمات','سيروم','واقيات الشمس','عناية متخصصة'],
hair:['شامبو','بلسم','سيروم','عناية وعلاج الشعر','فرش وأمشاط'],
oral:['معجون الأسنان','غسول الفم','فرش الأسنان','خيط الأسنان'],
baby:['حليب الأطفال','حفاضات الأطفال','العناية ببشرة الطفل','مناديل الأطفال'],
medical:['أجهزة الحرارة','أجهزة الضغط','أجهزة السكر','إبر ومستلزمات الحقن','وسائل الحركة','مستلزمات طبية أخرى'],
personal:['الاستحمام','الحلاقة','غسول نسائي','العناية اليومية'],
medicines:['كريمات ومراهم علاجية','بخاخات وقطرات الأنف','مستحضرات علاجية أخرى'],
other:['عدسات تجميل','واقيات ذكرية','منتجات متنوعة أخرى']};
let activeCategory='',activeSubcategory='';
function classify(p){
 const n=normalize(p.name), ar=normalize(p.arabic), cl=String(p.itemClass||'').toUpperCase();
 const has=(...keys)=>keys.some(k=>n.includes(k));
 // Feminine wash and care are personal care, not facial cleansing.
 if(has('intimate wash','feminine wash','fem wash','vaginal wash','gyn-phy','gyn phy','feminine wipes','intimate deodorant','intimate deodrant'))return {id:'personal',sub:'غسول نسائي'};
 // SUABELLE hair serum: explicit brand-level priority before generic skin serum.
 if(n.startsWith('suabelle')&&has('serum'))return {id:'hair',sub:'سيروم'};

 // Priority rules prevent wheelchairs, glucose monitors and nasal sprays from landing in hair/skin care.
 if(has('clarity 6 months','clarity lenses','contact lens','colored lens','colour lens','color lens','cosmetic lens','lens solution'))return {id:'other',sub:'عدسات تجميل'};
 if(has('smart con ','smart condom','lgnd condom','condoms'))return {id:'other',sub:'واقيات ذكرية'};
 if(has('micellar water','makeup remover','make up remover','cleansing water'))return {id:'skin',sub:'غسول البشرة'};
 if(has('heat defence','heat protect','hair spray','hair oil','hair mask','hair tonic','hair treatment'))return {id:'hair',sub:'عناية وعلاج الشعر'};
 if(has('petroleum jelly','petr jelly','petr jell','vaseline'))return {id:'skin',sub:'كريمات'};
 if(has('eyelash','blush','lipstick','mascara','nail polish','makeup','make up','eyeliner','foundation','concealer'))return {id:'skin',sub:'عناية متخصصة'};
 if(has('clarity daily lenses','clarity monthly','clarity 6 months','clarity lenses'))return {id:'other',sub:'عدسات تجميل'};
 if(has('premi bpm','blood pressure monitor','bpm upper arm'))return {id:'medical',sub:'أجهزة الضغط'};
 if(has('minoxidil','dry sh ','h/mousse','h/fix spray','fix spray ex-strong'))return {id:'hair',sub:'عناية وعلاج الشعر'};
 if(has('sebi um','sebium mousant','se bium','mousant'))return {id:'skin',sub:'غسول البشرة'};
 if(has('cicalfate cream','hand cream'))return {id:'skin',sub:'كريمات'};
 if(has('slimming tea','anise tea','chamomile','hibiscus tea','green tea','ginger & lemon tea'))return {id:'supplements',sub:'المكملات الغذائية'};
 if(has('vaporub','ice spray','ear drops','horse balm','devil s claw','minoxidil'))return {id:'medicines',sub:'كريمات ومراهم علاجية'};
 if(has('roll on','deodorant'))return {id:'personal',sub:'العناية اليومية'};
 if(has('pouf','dispo towel'))return {id:'personal',sub:'الاستحمام'};
 if(has('lub gel','lgnd lub','delay-spray'))return {id:'personal',sub:'العناية اليومية'};
 if(has('sanitizer'))return {id:'personal',sub:'العناية اليومية'};
 if(has('wheelchair','walker','crutch','walking stick','commode','mobility','rollator','wheel chair'))return {id:'medical',sub:'وسائل الحركة'};
 if(has('thermometer','forehead thermometer','ear thermometer','digital thermometer'))return {id:'medical',sub:'أجهزة الحرارة'};
 if(has('blood pressure','bp monitor','sphygmomanometer'))return {id:'medical',sub:'أجهزة الضغط'};
 if(has('glucose','glucometer','blood sugar','lancet','test strip'))return {id:'medical',sub:'أجهزة السكر'};
 if(has('syringe','needle','insulin pen needle','injection'))return {id:'medical',sub:'إبر ومستلزمات الحقن'};
 if(has('contact lens','colored lens','colour lens','color lens','cosmetic lens'))return {id:'other',sub:'عدسات تجميل'};
 if(has('condom'))return {id:'other',sub:'واقيات ذكرية'};
 if(has('nasal spray','nasal drop','nose spray','nose drop'))return {id:'medicines',sub:'بخاخات وقطرات الأنف'};
 if(has('massage emulgel','massage gel','massage oil','massage spray','massage lotion','joint massage','hot massage','ice massage','muscle&joint'))return {id:'medicines',sub:'كريمات ومراهم علاجية'};
 if(cl==='MILK'||has('infant formula','growth formula','baby milk','milk powder','tummies'))return {id:'baby',sub:'حليب الأطفال'};
 if(cl==='DIPR'||has('diaper','nappy','nappies'))return {id:'baby',sub:has('rash','ointment','cream')?'العناية ببشرة الطفل':'حفاضات الأطفال'};
 if(has('baby wipes','toddies aqua wipes','kids wipes'))return {id:'baby',sub:'مناديل الأطفال'};
 if(has('baby','infant','toddies','kids','nipple','feeding'))return {id:'baby',sub:has('wipes')?'مناديل الأطفال':has('milk','formula')?'حليب الأطفال':'العناية ببشرة الطفل'};
 if(has('floss','dental floss'))return {id:'oral',sub:'خيط الأسنان'};
 if(has('mouthwash','mouth wash','oral rinse','m/w '))return {id:'oral',sub:'غسول الفم'};
 if(has('toothpaste','tooth paste','dental paste','t/p ','t/p','tp '))return {id:'oral',sub:'معجون الأسنان'};
 if(has('toothbrush','tooth brush','dental brush','interdental brush',' t/b ',' tb ','natrodent tb ','dental tb '))return {id:'oral',sub:'فرش الأسنان'};
 if(has('tooth','dental','dent','oral','tongue','natrodent'))return {id:'oral',sub:has('floss')?'خيط الأسنان':has('paste',' t/p')?'معجون الأسنان':has('wash','rinse','m/w')?'غسول الفم':has('brush',' tb ')||n.startsWith('natrodent tb')?'فرش الأسنان':'معجون الأسنان'};
 if(has('hairbrush','hair brush','hair comb','haircomb','comb','hair pick'))return {id:'hair',sub:'فرش وأمشاط'};
 if(has('shampoo'))return {id:'hair',sub:'شامبو'};
 if(has('conditioner'))return {id:'hair',sub:'بلسم'};
 if(has('hair serum','scalp serum','serum hair'))return {id:'hair',sub:'سيروم'};
 if(has('hair','scalp','ducray'))return {id:'hair',sub:has('serum')?'سيروم':'عناية وعلاج الشعر'};
 if(has('sunscreen','sun screen','spf','sunblock'))return {id:'skin',sub:'واقيات الشمس'};
 if(has('face wash','facial wash','face cleanser','facial cleanser','skin cleanser','cleansing gel','cleanser','facial cleansing','face foam'))return {id:'skin',sub:'غسول البشرة'};
 if(has('face serum','facial serum','skin serum','serum'))return {id:'skin',sub:'سيروم'};
 if(has('aciclovir','lidocaine','prilocaine','antiseptic','dexpanthenol','flamacure','cetahex','calamine','ointment','medicated cream'))return {id:'medicines',sub:'كريمات ومراهم علاجية'};
 if(has('face cream','facial cream','skin cream','moistur','pigment','brighten','acne','skin','facial','body lotion','body cream'))return {id:'skin',sub:has('cream','moistur','lotion')?'كريمات':'عناية متخصصة'};
 if(has('vitamin','mineral','supplement','melatonin','manuka','honey','probiotic','collagen','omega','zinc','magnesium','arginine','vitassentials','lozenge','gummies','protein','nutrition'))return {id:'supplements',sub:'المكملات الغذائية'};
 if(has('oximeter','nebulizer','bandage','gauze','glove','mask','first aid','medical','hollaid','foshan','dawa-aid'))return {id:'medical',sub:'مستلزمات طبية أخرى'};
 if(has('loofah','razor','deodorant','perfume','fragrance','soap','shower','body wash','sanitary','cotton','tissue','wipes','nail','lip balm','bath','brush'))return {id:'personal',sub:has('razor','shaving')?'الحلاقة':has('loofah','shower','soap','bath')?'الاستحمام':'العناية اليومية'};
 if(cl==='MDCN')return {id:'medicines',sub:'مستحضرات علاجية أخرى'};
 if(cl==='MILK')return {id:'baby',sub:'حليب الأطفال'};
 if(cl==='DIPR')return {id:'baby',sub:'حفاضات الأطفال'};
 return {id:'other',sub:'منتجات متنوعة أخرى'};
}
function sortKey(p){return normalize(p.name).replace(/\b(?:\d+(?:[.,]\d+)?\s*(?:ml|gm|g|kg|mg|pcs?|pc|tablets?|caps?|sachets?|strips?|liters?|l|cm))\b/gi,'').replace(/\s+/g,' ').trim()}
function productImage(p){
 const url=String(p.imageUrl||'');
 if(!url)return `<div class="product-image placeholder"><span class="placeholder-icon">✚</span><small>IMAGE PENDING</small></div>`;
 const safe=escapeHTML(url);
 return `<div class="product-image"><img src="${safe}" alt="${escapeHTML(p.name)}" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('placeholder');this.remove();this.parentElement.innerHTML='<span class=&quot;placeholder-icon&quot;>✚</span><small>IMAGE UNAVAILABLE</small>'"></div>`;
}
const collator=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
function productCompare(a,b){return collator.compare(sortKey(a),sortKey(b))||collator.compare(a.name,b.name)||collator.compare(a.code,b.code)}
function renderCategories(){const grid=$('categoryGrid');grid.replaceChildren();for(const c of CATEGORIES){const count=products.filter(p=>p.category===c.id).length;if(!count)continue;const b=document.createElement('button');b.type='button';b.className='category-tile'+(activeCategory===c.id?' selected':'');b.style.setProperty('--cat',c.color);b.innerHTML=`<span class="category-symbol">${c.icon}</span><span class="category-copy"><strong>${c.name}</strong><small>${c.en}</small></span><span class="category-number">${count}</span>`;b.onclick=()=>{activeCategory=activeCategory===c.id?'':c.id;activeSubcategory='';renderCategories();renderSubcategories();filter();if(activeCategory){$('subcategoryAnchor').scrollIntoView({behavior:'smooth',block:'start'})}else{$('categorySection').scrollIntoView({behavior:'smooth',block:'start'})}};grid.append(b)}}
function renderSubcategories(){const bar=$('subcategoryBar');bar.replaceChildren();bar.hidden=!activeCategory;const title=$('subcategoryTitle');title.hidden=!activeCategory;if(!activeCategory)return;title.textContent=CATEGORIES.find(c=>c.id===activeCategory)?.en+'  /  SUBCATEGORIES';const order=SUBCATEGORY_ORDER[activeCategory]||[];const subs=[...new Set(products.filter(p=>p.category===activeCategory).map(p=>p.subcategory))].sort((a,b)=>{const ia=order.indexOf(a),ib=order.indexOf(b);return (ia<0?999:ia)-(ib<0?999:ib)||a.localeCompare(b,'ar')});for(const sub of ['الكل',...subs]){const b=document.createElement('button');b.type='button';b.className='subchip'+((sub==='الكل'&&!activeSubcategory)||activeSubcategory===sub?' active':'');b.textContent=sub;b.onclick=()=>{activeSubcategory=sub==='الكل'?'':sub;renderSubcategories();filter()};bar.append(b)}}
const $=id=>document.getElementById(id);let products=[],filtered=[],visible=40,current=null;const normalize=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));function fillSelect(id,values){let el=$(id);for(const value of [...new Set(values.filter(Boolean))]){const o=document.createElement('option');o.value=value;o.textContent=id==='power'?({'GOLD':'Gold','SILVER':'Silver'}[value]||value):id==='itemClass'?({'MDCN':'Medicine','COSM':'Cosmetics','MILK':'Milk','DIPR':'Diaper','DMSC':'Dmsco'}[value]||value):value;el.append(o)}}function filter(){let q=normalize($('search').value.trim());filtered=products.filter(p=>(!q||normalize([p.code,p.name,p.arabic,p.brand].join(' ')).includes(q))&&(!$('brand').value||p.brand===$('brand').value)&&(!$('power').value||p.powerUp===$('power').value)&&(!$('itemClass').value||p.itemClass===$('itemClass').value)&&(!activeCategory||p.category===activeCategory)&&(!activeSubcategory||p.subcategory===activeSubcategory)).sort(productCompare);visible=40;render()}function render(){const root=$('products');root.replaceChildren();const fragment=document.createDocumentFragment();for(const p of filtered.slice(0,visible)){const card=document.createElement('article');card.className='product-card';card.innerHTML=`<div class="card-top"><span class="brand">${escapeHTML(p.brand)}</span><span class="pill">${escapeHTML(p.powerUp||'—')}</span></div>${productImage(p)}<div class="card-category">${escapeHTML(CATEGORIES.find(c=>c.id===p.category)?.name||'')} · ${escapeHTML(p.subcategory)}</div><div class="card-title">${escapeHTML(p.name)}</div><div class="card-ar">${escapeHTML(p.arabic)}</div><div class="card-bottom"><div class="sku"><small>SKU</small>${escapeHTML(p.code)}</div><button class="open-card" type="button">التفاصيل ←</button></div>`;card.querySelector('button').addEventListener('click',()=>show(p));fragment.append(card)}root.append(fragment);$('shownCount').textContent=`(${filtered.length.toLocaleString('en-US')})`;$('more').hidden=visible>=filtered.length;$('empty').hidden=filtered.length!==0;$('resultHint').textContent=filtered.length===products.length?'OWN BRAND · PRODUCT DIRECTORY':`تم العثور على ${filtered.length} منتج مطابق`;}function show(p){current=p;$('dName').textContent=p.name;$('dArabic').textContent=p.arabic;$('dCode').textContent=p.code;$('dBrand').textContent=p.brand;$('dClass').textContent=p.itemClass||'—';$('dCategory').textContent=CATEGORIES.find(c=>c.id===p.category)?.name||'—';$('dSubcategory').textContent=p.subcategory;$('dPower').textContent=p.powerUp||'—';$('dSource').textContent=p.source||'غير محدد';$('dStatus').textContent=p.websiteStatus==='Not reviewed'?'لم يتم تأكيد التوفر':p.websiteStatus||'لم يتم تأكيد التوفر';const a=$('siteLink');a.hidden=!/^https:\/\/www\.al-dawaa\.com\//.test(p.url);if(!a.hidden)a.href=p.url;$('details').showModal()}$('closeDialog').addEventListener('click',()=>$('details').close());$('details').addEventListener('click',e=>{if(e.target===$('details'))$('details').close()});$('copyCode').addEventListener('click',async()=>{if(!current)return;try{await navigator.clipboard.writeText(current.code);$('copyCode').textContent='تم النسخ ✓';setTimeout(()=>$('copyCode').textContent='نسخ الكود',1300)}catch{prompt('انسخ الكود:',current.code)}});$('more').addEventListener('click',()=>{visible+=40;render()});$('clear').addEventListener('click',()=>{$('search').value='';$('brand').value='';$('power').value='';$('itemClass').value='';activeCategory='';activeSubcategory='';renderCategories();renderSubcategories();filter()});for(const id of ['search','brand','power','itemClass'])$(id).addEventListener(id==='search'?'input':'change',filter);for(const [id,mode] of [['gridView',false],['listView',true]])$(id).addEventListener('click',()=>{$('products').classList.toggle('list',mode);$('gridView').classList.toggle('active',!mode);$('listView').classList.toggle('active',mode)});fetch('products.json').then(r=>{if(!r.ok)throw Error('Unable to load catalog');return r.json()}).then(data=>{products=data.map(p=>{const c=CATEGORY_OVERRIDES[p.code]||classify(p);return {...p,imageUrl:IMAGE_MAP[p.code]||'',category:c.id,subcategory:c.sub}});renderCategories();renderSubcategories();$('totalCount').textContent=products.length;fillSelect('brand',products.map(p=>p.brand));fillSelect('power',['Diamond','GOLD','SILVER','Med & Cosm']);fillSelect('itemClass',['MDCN','COSM','MILK','DIPR','DMSC']);filter()}).catch(()=>{$('resultHint').textContent='تعذر تحميل البيانات. افتح الموقع عبر خادم ويب أو استضافة مثل Vercel.'});

$('allCategories').addEventListener('click',()=>{activeCategory='';activeSubcategory='';renderCategories();renderSubcategories();filter()});
