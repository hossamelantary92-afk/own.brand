/* Catalog taxonomy: specific product purpose takes priority over generic words. */
(function(root){
'use strict';
const categories=[
{id:'skin',name:'العناية بالبشرة',en:'Skin Care',icon:'drop',color:'#1673ee',subs:['غسول وتنظيف البشرة','مرطبات الوجه والجسم','واقيات الشمس','تفتيح وعناية متخصصة','العناية بالشفاه','العناية بالقدم','مزيلات المكياج','المكياج وأدواته']},
{id:'hair',name:'العناية بالشعر',en:'Hair Care',icon:'hair',color:'#172b65',subs:['شامبو','بلسم','كريمات وماسكات الشعر','سيروم وأمبولات','تصفيف وحماية الشعر','علاجات تساقط الشعر','فرش وأمشاط','أجهزة تصفيف الشعر','إكسسوارات الشعر']},
{id:'oral',name:'العناية بالفم والأسنان',en:'Oral Care',icon:'tooth',color:'#009fba',subs:['معجون الأسنان','غسول الفم','فرش الأسنان','فرش كهربائية وملحقاتها','أجهزة تنظيف الفم وملحقاتها','خيط الأسنان','فرش بين الأسنان','عناية الفم المتخصصة']},
{id:'supplements',name:'المكملات والتغذية',en:'Vitamins & Nutrition',icon:'pill',color:'#e7a100',subs:['فيتامينات ومكملات','مشروبات المكملات','عسل المانوكا','العسل والتغذية','المشروبات العشبية','مياه الشرب']},
{id:'personal',name:'العناية الشخصية',en:'Personal Care',icon:'heart',color:'#ed507d',subs:['الاستحمام وغسول اليدين','ليفة وإكسسوارات الحمام','مزيلات العرق','العطور وبخاخات الجسم','الحلاقة وإزالة الشعر','العناية النسائية','العناية الحميمة','قطن ومناديل','الأظافر وأدوات العناية','الحماية من الحشرات','حقائب ومجموعات السفر']},
{id:'baby',name:'الأم والطفل',en:'Mother & Baby',icon:'baby',color:'#a45dea',subs:['حليب الأطفال','حفاضات الأطفال','مناديل الأطفال','استحمام وشعر الأطفال','العناية ببشرة الطفل','مستلزمات الطفل','العناية بالأم']},
{id:'medical',name:'الأجهزة والمستلزمات',en:'Medical Devices',icon:'medical',color:'#397bfa',subs:['أجهزة قياس السكر وشرائطه','أجهزة قياس الضغط','أجهزة الحرارة والأكسجين','أجهزة التنفس','إبر ومحاقن ومستلزمات السكر','العناية بالجروح والضمادات','الدعامات والمشدات','وسائل الحركة وكراسي الحمام','رعاية كبار السن','كمادات ولصقات حرارية','قفازات وكمامات وتعقيم','مستلزمات الأذن والنوم','مستلزمات طبية أخرى']},
{id:'optical',name:'العدسات والعناية بالعين',en:'Lenses & Eye Care',icon:'eye',color:'#6d68cf',subs:['عدسات يومية','عدسات شهرية','عدسات نصف سنوية','عدسات تجميل','محاليل العدسات']},
{id:'medicines',name:'المستحضرات العلاجية',en:'Medicines & Treatments',icon:'cross',color:'#10a693',subs:['مستحضرات الجلد الموضعية','بخاخات وقطرات الأنف','العناية بالحلق','كريمات وبخاخات المساج','مستحضرات علاجية أخرى']},
{id:'other',name:'منتجات أخرى',en:'Other Products',icon:'grid',color:'#7083a0',subs:['حقائب ومجموعات','منتجات متنوعة']}
];
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u064b-\u065f\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
function brand(p){let b=String(p.brand||'').replace(/,+$/,'').trim().toUpperCase();if(/DAWAA\s+HEALTH/i.test(p.name))return 'DAWAA HEALTH';return b;}
function classify(p){
 const n=norm(p.name),b=brand(p),h=(...keys)=>keys.some(k=>n.includes(k)),c=(id,sub)=>({id,sub});
 // Dental products remain dental even when labelled kids or containing brushes/masks.
 if(['DENTU','NATRODENT'].includes(b)||h('toothpaste','toothbrush','dental floss','interdental')){
  if(h('t/p','toothpaste','tooth paste'))return c('oral','معجون الأسنان');
  if(h('m/w','mouthwash','mouth wash'))return c('oral','غسول الفم');
  if(h('water floss','w flos','charging cable'))return c('oral','أجهزة تنظيف الفم وملحقاتها');
  if(h('elect','repl head','repl twist'))return c('oral','فرش كهربائية وملحقاتها');
  if(h('floss','flosser'))return c('oral','خيط الأسنان');
  if(h('interdent','interdental','tb interdent'))return c('oral','فرش بين الأسنان');
  if(h('teething','ulcer','wax'))return c('oral','عناية الفم المتخصصة');
  return c('oral','فرش الأسنان');
 }
 if(b==='CLARITY'||h('contact lens','lens solution'))return c('optical',h('solution')?'محاليل العدسات':h('daily')?'عدسات يومية':h('monthly')?'عدسات شهرية':h('6 months')?'عدسات نصف سنوية':'عدسات تجميل');
 if(h('intimate','feminine','fem wipes','fem napkin','pantyliner','panty','napkins','gyn-phy','reusable pant','disposable pant'))return c('personal','العناية النسائية');
 if(h('condom','smart con ','lub gel','lgnd lub','delay','hercules','champ '))return c('personal','العناية الحميمة');
 if(h('adult pants','underbed pad'))return c('medical','رعاية كبار السن');
 if(h('wheelchair','wheel chair','wh chair','whel chair','walker','crutch','commode','stick ','prayer chair'))return c('medical','وسائل الحركة وكراسي الحمام');
 if(b==='HOLFLEX'||h('kinesio','support ankle','support wrist'))return c('medical','الدعامات والمشدات');
 if(h('blood glucose','blood sugar','glucose monitor','glucose bs','glucometer'))return c('medical','أجهزة قياس السكر وشرائطه');
 if(h('bpm ','blood pressure'))return c('medical','أجهزة قياس الضغط');
 if(h('thermometer','oximeter'))return c('medical','أجهزة الحرارة والأكسجين');
 if(h('nebulizer','cpap'))return c('medical','أجهزة التنفس');
 if(h('lancet','needle','syringe','insulin bag'))return c('medical','إبر ومحاقن ومستلزمات السكر');
 if(h('corn ','wart ','f care blister','foot patch'))return c('skin','العناية بالقدم');
 if(h('anti-scar','cold sore','pharmacoll'))return c('medical','العناية بالجروح والضمادات');
 if(h('plaster','dressing','bandage','gauze','cotton tape','tape cotton','transparent tape','eye patches','first aid','cotton-pack','cotton-roll'))return c('medical','العناية بالجروح والضمادات');
 if(h('hot water bag','hot & cold','compress ','fever-patch','cool fvr','heating pad','heating patch'))return c('medical','كمادات ولصقات حرارية');
 if(h('gloves','face mask','swab','sanitizer dispenser','sanitizing personal','sanitizing refill'))return c('medical','قفازات وكمامات وتعقيم');
 if(h('ear plug','anti-snoring'))return c('medical','مستلزمات الأذن والنوم');
 if(b==='FOSHAN')return c('medical','وسائل الحركة وكراسي الحمام');
 if(h('nasal','nose drop')||b==='NOZY'||(b==='DAWAA HEALTH'&&h('ns 120')))return c('medicines','بخاخات وقطرات الأنف');
 if(b==='THROWELL'||h('throat lozenge'))return c('medicines','العناية بالحلق');
 if(b==='JAVELINE'||h('emulgel','massage','horse balm','devil s claw','vaporub'))return c('medicines','كريمات وبخاخات المساج');
 if(h('manuka','mgo'))return c('supplements','عسل المانوكا');
 if(b.startsWith('VITASSENTIALS'))return c('supplements',h('shot','water 75')?'مشروبات المكملات':'فيتامينات ومكملات');
 if(b==='ACTIWATER')return c('supplements','مشروبات المكملات');
 if(h('honey'))return c('supplements','العسل والتغذية');
 if(b==='AQUASPRING'||h('water 330','water 500'))return c('supplements','مياه الشرب');
 if(h(' tea ','tea 30'))return c('supplements','المشروبات العشبية');
 if(b==='GENIUS'||h('gummy','gummies','supplement','30 caps'))return c('supplements','فيتامينات ومكملات');
 // Hair has priority over baby and cosmetics; treatments stay with their intended use.
 if(h('minoxidil'))return c('hair','علاجات تساقط الشعر');
 if(b==='RONIX'||h('flat iron','hair dryer','hair curler'))return c('hair','أجهزة تصفيف الشعر');
 if(h('hairbrush','hair brush','haircomb','hair comb','scalp massager'))return c('hair','فرش وأمشاط');
 if(h('hairtie','scrunch','hair clips','hair claw','h.snap','h.pins','elastics'))return c('hair','إكسسوارات الشعر');
 if((b==='TODDIES'||b==='GORNER')&&h('baby shampoo','baby bath','baby shower','baby oil','baby lotion'))return c('baby',h('shampoo','bath','shower')?'استحمام وشعر الأطفال':'العناية ببشرة الطفل');
 if(b==='SUABELLE'||b==='DANDRU'||/\bhair\b/.test(n)||h('scalp','shampoo',' dry sh ','h/mousse','h/fix','fix spray',' h/relax','goldcaviar')||/\bcond\b/.test(n)){
  if(h('shampoo',' sh ','h/relax sh','dry sh '))return c('hair','شامبو');
  if(h('conditioner',' cond','h/relax cond'))return c('hair','بلسم');
  if(h('serum','amp','goldcaviar'))return c('hair','سيروم وأمبولات');
  if(h('cream','hair cr','treatment','mask','h/relax cream'))return c('hair','كريمات وماسكات الشعر');
  return c('hair','تصفيف وحماية الشعر');
 }
 if(h('nipple'))return c('baby','العناية بالأم');
 if(p.itemClass==='MILK'||b==='TUMMIES')return c('baby','حليب الأطفال');
 if(p.itemClass==='DIPR'||(b==='TODDIES'&&h('pants',' mp ','pome',' box ',' jp ')))return c('baby','حفاضات الأطفال');
 if(b==='KOKON'||b==='TODDIES'||h('baby','diaper rash')){
  if(h('wipes'))return c('baby','مناديل الأطفال');
  if(h('bath','shampoo','shower'))return c('baby','استحمام وشعر الأطفال');
  if(h('cream','oil','lotion','powder','ointment','rash'))return c('baby','العناية ببشرة الطفل');
  return c('baby','مستلزمات الطفل');
 }
 if(h('hydroquinone','tretinoin'))return c('medicines','مستحضرات الجلد الموضعية');
 if(h('anti-mosq','mosquito repellant'))return c('personal','الحماية من الحشرات');
 if(h(' vt '))return c('personal','العطور وبخاخات الجسم');
 if(h('lip balm','lip pomegranate','lip cherry'))return c('skin','العناية بالشفاه');
 if(h('micellar','makeup remover','mu wipes','cleansing water'))return c('skin','مزيلات المكياج');
 if(h('sunblock','sun screen','sunscreen','spf'))return c('skin','واقيات الشمس');
 if(h('lip balm','lip pomegranate','lip cherry'))return c('skin','العناية بالشفاه');
 if(h('cleanser','mousant','facial wash','se bium'))return c('skin','غسول وتنظيف البشرة');
 if(h('brightening','pigmentbio','oily skin','hydroquinone','tretinoin'))return c('skin','تفتيح وعناية متخصصة');
 if(h('eyelash','mu brush','beauty blender','blush','makeup bud'))return c('skin','المكياج وأدواته');
 if(h('moisturis','body cream','body cr','body lotion',' lotion ','hand cream','hand care','petr jelly','vaseline','aloevera gel','aloe vera gel','cicalfate')||b==='GLYSO'||(b.startsWith('DEXPANTHENOL')&&!h('hair','nipple','baby')))return c('skin','مرطبات الوجه والجسم');
 if(h('roll on','deodorant'))return c('personal','مزيلات العرق');
 if(h('splash','perfume','fragrance'))return c('personal','العطور وبخاخات الجسم');
 if(h('razor','rzrs','shaving'))return c('personal','الحلاقة وإزالة الشعر');
 if(b==='LOUFA'||b==='BALMY'||h('loofah','pouf','dispo towel'))return c('personal','ليفة وإكسسوارات الحمام');
 if(h('nail','tweez','foot file','pumice'))return c('personal','الأظافر وأدوات العناية');
 if(h('cotton','wipes','tissue'))return c('personal','قطن ومناديل');
 if(h('soft & gentle','soap','shower','body wash','hand wash','h/w','hand sanitizer','h/s ','h/s spray'))return c('personal','الاستحمام وغسول اليدين');
 if(b==='FLAMACURE'||b==='CETAHEX'||h('aciclovir','calamine','antiseptic','lidocaine','prilocaine','ear drops','mometazone','mometasone'))return c('medicines','مستحضرات الجلد الموضعية');
 if(p.itemClass==='MDCN'||b==='DAWAA HEALTH'||b==='LOVERA')return c('medicines','مستحضرات علاجية أخرى');
 if(['DAWA-AID','HOLLAID','PREMI','FOSHAN'].includes(b))return c('medical','مستلزمات طبية أخرى');
 if(h('hajj','kit','pack'))return c('personal','حقائب ومجموعات السفر');
 return c('other','منتجات متنوعة');
}
const collator=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
const family=p=>norm(p.name).replace(/\b\d+(?:[.,]\d+)?\s*(?:ml|gm|kg|gr|g|mg|pcs?|tabs?|caps?|tablets?|cm|l|m|wipes?|bags?)\b/g,'').replace(/\b\d+\b/g,'').replace(/\s+/g,' ').trim();
const size=p=>{const m=norm(p.name).match(/(\d+(?:\.\d+)?)\s*(ml|gm|kg|gr|g|cm|l)\b/);return m?Number(m[1])*(m[2]==='kg'||m[2]==='l'?1000:1):0;};
function compare(a,b){const ai=categories.findIndex(c=>c.id===a.category),bi=categories.findIndex(c=>c.id===b.category);const subs=categories[ai]?.subs||[];return ai-bi||subs.indexOf(a.subcategory)-subs.indexOf(b.subcategory)||collator.compare(a.brand,b.brand)||collator.compare(family(a),family(b))||size(a)-size(b)||collator.compare(a.name,b.name)||collator.compare(a.code,b.code);}
root.CatalogTaxonomy={categories,norm,brand,classify,compare,collator};
if(typeof module!=='undefined')module.exports=root.CatalogTaxonomy;
})(globalThis);
