/* Prototype JS: gestion produits, panier, modals, dashboard */
const PRODUCTS = [
  {id:1,name:"Moteur d'occasion",price:45000,seller:"Atelier Tana",phone:"+261 34 12 345 67",desc:"Moteur en bon état, testé.",images: ['#a8e6ff','#ffd6a8']},
  {id:2,name:"Téléphone reconditionné",price:22000,seller:"Friperie Mobile",phone:"+261 33 98 765 43",desc:"Écran intact, batterie 80%.",images: ['#cfefff','#dfffe0']},
  {id:3,name:"Veste vintage",price:12000,seller:"Boutik Retro",phone:"+261 20 22 333 44",desc:"Taille M, très bon état.",images: ['#e6f7ff','#e0ffe9']},
  {id:4,name:"Pompe à eau",price:32000,seller:"Matériel Usagé",phone:"+261 34 55 667 88",desc:"Fonctionnelle, garantie 7 jours.",images: ['#dff','#cfe']},
];

let cart = [];
let sellerStats = {sales:0,purchases:0,commissions:0,posts:0};

const SHIPPING_THRESHOLD = 30000;
const SHIPPING_FEE = 3000;
const COMMISSION_RATE = 0.15;

function formatAr(n){ return n.toLocaleString('fr-FR') + ' Ar'; }

function createProductCard(p){
  const card = document.createElement('div'); card.className='card';
  const car = document.createElement('div'); car.className='carousel';
  const img = document.createElement('div');
  img.style.width='100%'; img.style.height='100%'; img.style.display='flex'; img.style.alignItems='center'; img.style.justifyContent='center';
  img.style.fontWeight='700'; img.style.color='#034';
  img.style.background = `linear-gradient(135deg, ${p.images[0] || '#eef'}, ${p.images[1] || '#cfe'})`;
  img.textContent = p.name;
  car.appendChild(img);
  card.appendChild(car);

  const title = document.createElement('div'); title.innerHTML = `<div style="font-weight:700">${p.name}</div>`;
  const price = document.createElement('div'); price.className='price'; price.textContent = formatAr(p.price);
  const seller = document.createElement('div'); seller.className='seller'; seller.textContent = p.seller + ' • ' + p.phone;
  const desc = document.createElement('div'); desc.className='desc'; desc.textContent = p.desc;

  const actions = document.createElement('div'); actions.className='actions';
  const view = document.createElement('button'); view.className='btn-ghost'; view.textContent='Voir'; view.onclick = ()=>openProduct(p.id);
  const add = document.createElement('button'); add.className='btn-primary'; add.textContent='Ajouter'; add.onclick = ()=>addToCart(p.id);
  actions.appendChild(view); actions.appendChild(add);

  card.appendChild(title); card.appendChild(price); card.appendChild(seller); card.appendChild(desc); card.appendChild(actions);
  return card;
}

function renderProducts(){
  const list = document.getElementById('product-list'); list.innerHTML='';
  PRODUCTS.forEach(p=>list.appendChild(createProductCard(p)));
}

function openModal(el){ el.style.display='flex'; document.body.style.overflow='hidden'; }
function closeModal(el){ el.style.display='none'; document.body.style.overflow='auto'; }

function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const container = document.getElementById('product-content'); container.innerHTML='';
  const grid = document.createElement('div'); grid.className='grid-2';
  const left = document.createElement('div');
  const car = document.createElement('div'); car.className='carousel';
  const img = document.createElement('div'); img.style.height='100%'; img.style.display='flex'; img.style.alignItems='center'; img.style.justifyContent='center';
  img.style.background = `linear-gradient(135deg, ${p.images[0] || '#eef'}, ${p.images[1] || '#cfe'})`;
  img.style.fontWeight='700'; img.textContent = p.name;
  car.appendChild(img);
  left.appendChild(car);

  const right = document.createElement('div');
  right.innerHTML = `<h2>${p.name}</h2>
    <div class="price">${formatAr(p.price)}</div>
    <div class="small seller">Vendeur: ${p.seller} • ${p.phone}</div>
    <p>${p.desc}</p>
    <div class="small">Frais de livraison: ${formatAr(SHIPPING_FEE)} (gratuit si ≥ ${formatAr(SHIPPING_THRESHOLD)})</div>
    <div style="margin-top:12px">
      <button id="modal-add" class="btn-primary">Ajouter au panier</button>
    </div>
  `;
  grid.appendChild(left); grid.appendChild(right);
  container.appendChild(grid);
  document.getElementById('modal-product').style.display='flex';
  document.getElementById('modal-add').onclick = ()=>{ addToCart(p.id); closeModal(document.getElementById('modal-product')); };
  openModal(document.getElementById('modal-product'));
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({id:p.id,name:p.name,price:p.price,qty:1});
  renderCart();
}

function renderCart(){
  document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
  const container = document.getElementById('cart-items'); container.innerHTML='';
  cart.forEach(item=>{
    const div = document.createElement('div'); div.className='cart-item';
    const thumb = document.createElement('div'); thumb.className='small-thumb'; thumb.textContent = item.name.split(' ')[0];
    const info = document.createElement('div'); info.style.flex='1';
    info.innerHTML = `<div style="font-weight:700">${item.name}</div><div class="small">${formatAr(item.price)} x ${item.qty}</div>`;
    const remove = document.createElement('button'); remove.className='link'; remove.textContent='Suppr'; remove.onclick=()=>{
      item.qty--; if(item.qty<=0) cart = cart.filter(c=>c.id!==item.id); renderCart();
    };
    div.appendChild(thumb); div.appendChild(info); div.appendChild(remove);
    container.appendChild(div);
  });
  const subtotal = cart.reduce((s,i)=>s + i.price * i.qty,0);
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal===0 ? 0 : SHIPPING_FEE;
  const commission = Math.round(subtotal * COMMISSION_RATE);
  const total = subtotal + shipping;
  document.getElementById('subtotal').textContent = formatAr(subtotal);
  document.getElementById('shipping').textContent = formatAr(shipping);
  document.getElementById('commission').textContent = formatAr(commission);
  document.getElementById('total').textContent = formatAr(total);
  document.getElementById('cart-count').textContent = cart.reduce((s,i)=>s+i.qty,0);
}

document.getElementById('view-cart').onclick = ()=>{ window.scrollTo({top:0,behavior:'smooth'}); };
document.getElementById('checkout').onclick = ()=>{
  if(cart.length===0){ alert('Votre panier est vide.'); return; }
  const subtotal = cart.reduce((s,i)=>s + i.price * i.qty,0);
  const commission = Math.round(subtotal * COMMISSION_RATE);
  sellerStats.sales += cart.reduce((s,i)=>s + i.qty,0);
  sellerStats.commissions += commission;
  sellerStats.purchases += 1;
  cart = [];
  renderCart();
  updateDashboard();
  alert('Commande simulée. Merci ! (Prototype)');
};

document.getElementById('open-dashboard').onclick = ()=>openModal(document.getElementById('modal-dashboard'));
document.getElementById('close-dashboard').onclick = ()=>closeModal(document.getElementById('modal-dashboard'));
document.getElementById('open-legal').onclick = ()=>openModal(document.getElementById('modal-legal'));
document.getElementById('close-legal').onclick = ()=>closeModal(document.getElementById('modal-legal'));
document.getElementById('close-product').onclick = ()=>closeModal(document.getElementById('modal-product'));

document.getElementById('publish').onclick = ()=>{
  const name = document.getElementById('p-name').value.trim();
  const price = Number(document.getElementById('p-price').value);
  const seller = document.getElementById('p-seller').value.trim() || 'Vendeur';
  const desc = document.getElementById('p-desc').value.trim() || '';
  if(!name || !price){ alert('Nom et prix requis'); return; }
  sellerStats.posts++;
  const paid = sellerStats.posts > 10;
  const id = PRODUCTS.length ? Math.max(...PRODUCTS.map(p=>p.id))+1 : 1;
  PRODUCTS.push({id,name,price,seller,phone:'N/A',desc,images:['#dfffe0','#cfefff']});
  renderProducts();
  updateDashboard();
  document.getElementById('p-name').value=''; document.getElementById('p-price').value=''; document.getElementById('p-seller').value=''; document.getElementById('p-desc').value='';
  alert('Annonce publiée' + (paid ? ' (publication payante)' : ' (gratuite)'));
};

function updateDashboard(){
  document.getElementById('stat-sales').textContent = sellerStats.sales;
  document.getElementById('stat-purchases').textContent = sellerStats.purchases;
  document.getElementById('stat-comm').textContent = formatAr(sellerStats.commissions);
  document.getElementById('post-counter').textContent = sellerStats.posts;
  const hist = document.getElementById('seller-history');
  hist.textContent = `Publications: ${sellerStats.posts}. Ventes: ${sellerStats.sales}. Achats: ${sellerStats.purchases}. Commissions: ${formatAr(sellerStats.commissions)}.`;
}

/* initial render */
renderProducts();
renderCart();
updateDashboard();
