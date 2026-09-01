import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import heroClient from "@/assets/nuve-hero-client.jpg";
import serum5Client from "@/assets/nuve-5in1-client.jpg";
import serumGhk from "@/assets/nuve-product-ghk.jpg";
import serumPdrn from "@/assets/nuve-product-pdrn.jpg";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { NUVE, PRODUCTS, money, type NuveProduct } from "@/lib/nuve";
import "@/nuve-v2.css";
import "@/nuve-image-fix.css";
import "@/nuve-commerce.css";

type Cart = Record<string, number>;
const productImages: Record<string, string> = {
  "nuve-5-em-1": serum5Client,
  "nuve-ghk-cu": serumGhk,
  "nuve-pdrn": serumPdrn,
};

const heroSlides = [
  { image: heroClient, eyebrow: "NUVE ADVANCED SKIN CARE", title: "Tecnologia japonesa. Ativos selecionados. Skincare para a vida real.", text: NUVE.intro, href: "#mais-desejados", cta: "CONHEÇA OS PRODUTOS" },
  { image: serum5Client, eyebrow: "NUVE 5 EM 1", title: "Cinco ativos selecionados. Uma rotina prática.", text: PRODUCTS[0].description, href: "#nuve-5-em-1", cta: "CONHECER 5 EM 1" },
  { image: serumGhk, eyebrow: "NUVE GHK-Cu", title: "O poder dos peptídeos em uma fórmula sofisticada.", text: PRODUCTS[1].description, href: "#nuve-ghk-cu", cta: "CONHECER GHK-Cu" },
  { image: serumPdrn, eyebrow: "NUVE PDRN + PEPTÍDEO DE COBRE", title: "Uma combinação inspirada na nova geração do skincare.", text: PRODUCTS[2].description, href: "#nuve-pdrn", cta: "CONHECER PDRN" },
];

function ProductCard({ product, onAdd }: { product: NuveProduct; onAdd: (p: NuveProduct) => void }) {
  return <article className={`n2-card n2-${product.accent}`} id={product.id}>
    <a href={`#${product.id}-detalhes`} className="n2-card-image"><img src={productImages[product.id]} alt={product.name} loading="lazy" /></a>
    <div className="n2-card-body">
      <p className="n2-kicker">NUVE ADVANCED SKIN CARE</p>
      <h3>{product.name}</h3>
      <p className="n2-eyebrow">{product.eyebrow}</p>
      <p className="n2-description">{product.description}</p>
      <div className="n2-price"><strong>{money(product.price)}</strong><span>Preço inicial editável</span></div>
      <div className="n2-card-actions"><a href={`#${product.id}-detalhes`} className="n2-link">VER DETALHES</a><button onClick={() => onAdd(product)}>COMPRAR <ShoppingBag size={16}/></button></div>
    </div>
  </article>;
}

function CartDrawer({ cart, setCart, open, close }: { cart: Cart; setCart: React.Dispatch<React.SetStateAction<Cart>>; open: boolean; close: () => void }) {
  if (!open) return null;
  const items = PRODUCTS.filter(p => (cart[p.id] || 0) > 0);
  const qty = items.reduce((s,p)=>s+(cart[p.id]||0),0);
  const subtotal = items.reduce((s,p)=>s+p.price*(cart[p.id]||0),0);
  const discount = qty >= 2 ? subtotal * .1 : 0;
  const total = subtotal - discount;
  const change = (id:string, d:number) => setCart(c => { const n={...c}; n[id]=Math.max(0,(n[id]||0)+d); if(!n[id]) delete n[id]; return n; });
  const progress = qty === 0 ? "Escolha seus séruns NUVE" : qty === 1 ? "Adicione mais 1 unidade e ganhe 10% OFF" : "Seu desconto de 10% foi aplicado.";
  return <div className="n2-cart-layer"><button className="n2-cart-bg" onClick={close}/><aside className="n2-cart">
    <div className="n2-cart-head"><div><span>SEU CARRINHO</span><strong>{qty} {qty===1?"item":"itens"}</strong></div><button onClick={close} aria-label="Fechar carrinho"><X/></button></div>
    <div className="n3-promo-progress"><div className={qty>=2?"done":""} style={{width:`${Math.min(100,qty*50)}%`}}/><p>{progress}</p></div>
    <div className="n2-cart-items">{items.length===0 ? <div className="n2-empty"><ShoppingBag/><h3>Seu carrinho está vazio.</h3><button onClick={close}>VER PRODUTOS</button></div> : items.map(p=><div className="n2-cart-item" key={p.id}><img src={productImages[p.id]} alt={p.name}/><div><strong>{p.name}</strong><span>{money(p.price)}</span><div className="n2-qty"><button onClick={()=>change(p.id,-1)} aria-label="Diminuir quantidade"><Minus size={13}/></button><b>{cart[p.id]}</b><button onClick={()=>change(p.id,1)} aria-label="Aumentar quantidade"><Plus size={13}/></button></div></div></div>)}</div>
    {items.length>0 && <div className="n2-cart-total"><div><span>Subtotal</span><b>{money(subtotal)}</b></div>{discount>0&&<div className="disc"><span>Desconto 10%</span><b>- {money(discount)}</b></div>}<div className="total"><span>Total</span><b>{money(total)}</b></div><a href="/checkout">IR PARA O CHECKOUT</a></div>}
  </aside></div>;
}

export function NuveShop() {
  const [cart,setCart] = useState<Cart>({});
  const [cartOpen,setCartOpen] = useState(false);
  const [slide,setSlide] = useState(0);
  const [featured,setFeatured] = useState(0);
  useEffect(()=>{ try { const s=localStorage.getItem("nuve-cart"); if(s) setCart(JSON.parse(s)); } catch{} },[]);
  useEffect(()=>{ try { localStorage.setItem("nuve-cart",JSON.stringify(cart)); } catch{} },[cart]);
  useEffect(()=>{ const id=setInterval(()=>setSlide(s=>(s+1)%heroSlides.length),5500); return()=>clearInterval(id); },[]);
  const count=useMemo(()=>Object.values(cart).reduce((a,b)=>a+b,0),[cart]);
  const add=(p:NuveProduct)=>{ setCart(c=>({...c,[p.id]:(c[p.id]||0)+1})); setCartOpen(true); };
  const addCombo=(ids:string[])=>{ setCart(c=>{ const next={...c}; ids.forEach(id=>next[id]=(next[id]||0)+1); return next; }); setCartOpen(true); };
  const s=heroSlides[slide];
  const fp=PRODUCTS[featured];
  const duoSubtotal=PRODUCTS[0].price+PRODUCTS[1].price;
  const trioSubtotal=PRODUCTS.reduce((sum,p)=>sum+p.price,0);

  return <div className="n2-site">
    <Header cartCount={count} onCart={()=>setCartOpen(true)} />
    <main>
      <section className="n2-hero">
        <div className="n2-hero-media"><img src={s.image} alt={s.eyebrow} fetchPriority="high"/></div>
        <div className="n2-hero-overlay"/>
        <div className="n2-container n2-hero-copy"><p className="n2-kicker">{s.eyebrow}</p><h1>{s.title}</h1><p>{s.text}</p><div className="n2-hero-actions"><a href={s.href}>{s.cta}</a><a href="#sobre" className="ghost">CONHEÇA A NUVE</a></div></div>
        <div className="n2-hero-controls"><button onClick={()=>setSlide((slide-1+heroSlides.length)%heroSlides.length)} aria-label="Slide anterior"><ChevronLeft/></button><div>{heroSlides.map((_,i)=><button key={i} className={i===slide?"active":""} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}`}/>)}</div><button onClick={()=>setSlide((slide+1)%heroSlides.length)} aria-label="Próximo slide"><ChevronRight/></button></div>
      </section>

      <section className="n2-trust"><div className="n2-container"><span>FORMULAÇÕES DESENVOLVIDAS NO JAPÃO</span><i/> <span>ATIVOS SELECIONADOS</span><i/> <span>SKINCARE PARA A VIDA REAL</span></div></section>

      <section className="n3-wanted" id="mais-desejados"><div className="n2-container"><header className="n2-heading center"><p className="n2-kicker">MAIS DESEJADOS</p><h2>Encontre o seu NUVE.</h2><p>Três propostas de cuidado, apresentadas de forma simples para facilitar sua escolha.</p></header>
        <div className="n3-tabs">{PRODUCTS.map((p,i)=><button key={p.id} className={featured===i?"active":""} onClick={()=>setFeatured(i)}>{p.name.replace("NUVE ","")}</button>)}</div>
        <div className={`n3-feature n3-${fp.accent}`}><div className="n3-feature-media"><img src={productImages[fp.id]} alt={fp.name}/></div><div className="n3-feature-copy"><p className="n2-kicker">DESTAQUE NUVE</p><h2>{fp.name}</h2><h3>{fp.eyebrow}</h3><p>{fp.description}</p><div className="n3-feature-benefits">{fp.benefits.slice(0,3).map(b=><span key={b}><Sparkles size={15}/>{b}</span>)}</div><div className="n3-feature-buy"><strong>{money(fp.price)}</strong><button onClick={()=>add(fp)}>ADICIONAR AO CARRINHO</button></div></div></div>
      </div></section>

      <section className="n2-products" id="produtos"><div className="n2-container"><header className="n2-heading"><p className="n2-kicker">A LINHA NUVE</p><h2>Três séruns. Três maneiras de elevar a rotina.</h2><p>Fotografia em primeiro plano, informação clara e compra simples.</p></header><div className="n2-grid">{PRODUCTS.map(p=><ProductCard key={p.id} product={p} onAdd={add}/>)}</div></div></section>

      <section className="n3-tech"><div className="n2-container"><header className="n2-heading center"><p className="n2-kicker">TECNOLOGIAS NUVE</p><h2>Ciência + produto, sem complicação.</h2><p>Headline forte, leitura curta e detalhes quando você quiser aprofundar.</p></header><div className="n3-tech-grid">
        {PRODUCTS.map((p,i)=><article key={p.id} className={`n3-tech-card n3-${p.accent}`}><img src={productImages[p.id]} alt={p.name} loading="lazy"/><div><span>0{i+1}</span><h3>{p.name}</h3><p>{p.description}</p><details><summary>Ver ativos e destaques</summary><div className="n3-detail-list">{p.actives.map(a=><small key={a}>{a}</small>)}</div></details><a href={`#${p.id}-detalhes`}>CONHECER</a></div></article>)}
      </div></div></section>

      <section className="n2-editorial"><div className="n2-container"><div className="n2-editorial-media"><img src={heroClient} alt="NUVE Advanced Skin Care" loading="lazy"/></div><div className="n2-editorial-copy"><p className="n2-kicker">NOSSO DIFERENCIAL</p><h2>{NUVE.differentiator}</h2><p>{NUVE.differentiatorText}</p><a href="#ativos">CONHEÇA OS ATIVOS</a></div></div></section>

      <section className="n3-experience" id="monte-seu-kit"><div className="n2-container"><header className="n2-heading"><p className="n2-kicker">CRIE SUA EXPERIÊNCIA NUVE</p><h2>Combine. Descubra. Economize.</h2><p>Escolha dois ou três séruns e transforme a compra em uma rotina NUVE. A condição inicial é 10% OFF a partir de 2 unidades.</p></header><div className="n3-combos">
        <article><div className="n3-combo-images"><img src={serum5Client} alt="NUVE 5 EM 1"/><img src={serumGhk} alt="NUVE GHK-Cu"/></div><p className="n2-kicker">DUO NUVE</p><h3>Praticidade + peptídeo de cobre</h3><p>5 EM 1 + GHK-Cu</p><div className="n3-combo-price"><s>{money(duoSubtotal)}</s><strong>{money(duoSubtotal*.9)}</strong><span>10% OFF</span></div><button onClick={()=>addCombo([PRODUCTS[0].id,PRODUCTS[1].id])}>ADICIONAR DUO</button></article>
        <article className="featured"><div className="n3-combo-images trio"><img src={serumGhk} alt="NUVE GHK-Cu"/><img src={serum5Client} alt="NUVE 5 EM 1"/><img src={serumPdrn} alt="NUVE PDRN"/></div><p className="n2-kicker">TRIO NUVE</p><h3>A experiência completa</h3><p>GHK-Cu + 5 EM 1 + PDRN</p><div className="n3-combo-price"><s>{money(trioSubtotal)}</s><strong>{money(trioSubtotal*.9)}</strong><span>10% OFF</span></div><button onClick={()=>addCombo(PRODUCTS.map(p=>p.id))}>ADICIONAR TRIO</button></article>
      </div></div></section>

      {PRODUCTS.map((p,i)=><section className={`n2-product-story n2-${p.accent}`} id={`${p.id}-detalhes`} key={p.id}><div className="n2-container"><div className="n2-story-media"><img src={productImages[p.id]} alt={p.name} loading="lazy"/></div><div className="n2-story-copy"><p className="n2-kicker">0{i+1} · {p.name}</p><h2>{p.eyebrow}</h2><p>{p.description}</p><div className="n2-story-columns"><div><span>ATIVOS</span>{p.actives.map(a=><p key={a}>{a}</p>)}</div><div><span>DESTAQUES</span>{p.benefits.map(b=><p key={b}>{b}</p>)}</div></div><div className="n2-story-buy"><strong>{money(p.price)}</strong><button onClick={()=>add(p)}>ADICIONAR AO CARRINHO</button></div></div></div></section>)}

      <section className="n2-chooser"><div className="n2-container"><header className="n2-heading center"><p className="n2-kicker">QUAL NUVE COMBINA COM SUA ROTINA?</p><h2>Compare de forma simples.</h2></header><div className="n2-compare"><article><b>5 EM 1</b><p>Praticidade e combinação de ativos selecionados.</p><a href="#nuve-5-em-1">CONHECER</a></article><article className="blue"><b>GHK-Cu</b><p>Peptídeo de cobre em uma proposta cosmética sofisticada.</p><a href="#nuve-ghk-cu">CONHECER</a></article><article><b>PDRN</b><p>Ativos associados às novas tendências de skincare.</p><a href="#nuve-pdrn">CONHECER</a></article></div></div></section>

      <section className="n2-actives" id="ativos"><div className="n2-container"><div><p className="n2-kicker">ATIVOS & TECNOLOGIA</p><h2>Ciência cosmética traduzida em cuidado.</h2><p>Conteúdo apresentado no contexto cosmético, com linguagem clara e sem promessas terapêuticas.</p></div><div className="n2-active-list"><p><b>Nano Colesterol</b><span>Cuidado e suporte à barreira da pele.</span></p><p><b>Nano Ácido Hialurônico</b><span>Hidratação e aparência mais preenchida e viçosa.</span></p><p><b>Nano Niacinamida</b><span>Barreira, uniformidade e aparência saudável.</span></p><p><b>Resveratrol</b><span>Ação antioxidante e cuidado contra os sinais do envelhecimento.</span></p><p><b>Óleo de Rosa Mosqueta</b><span>Nutrição, conforto e cuidado com a aparência da pele.</span></p></div></div></section>

      <section className="n2-about" id="sobre"><div className="n2-container"><p className="n2-kicker">A FILOSOFIA NUVE</p><h2>A beleza de cuidar de si.</h2><p>Menos complicação. Mais intenção.</p><blockquote>Essa é a Nuve. Skincare inteligente. Tecnologia. Cuidado. Beleza para a vida real.</blockquote></div></section>

      <section className="n2-faq" id="faq"><div className="n2-container"><header className="n2-heading"><p className="n2-kicker">FAQ</p><h2>Informação clara antes da compra.</h2></header><details><summary>Qual NUVE escolher?</summary><p>5 EM 1 prioriza praticidade; GHK-Cu destaca o peptídeo de cobre; PDRN + Peptídeo de Cobre segue uma proposta ligada às novas tendências de skincare.</p></details><details><summary>Existe desconto comprando mais de um?</summary><p>Sim. A condição inicial é 10% OFF na compra de 2 ou mais unidades.</p></details><details><summary>As formulações são desenvolvidas no Japão?</summary><p>Sim. Esse é o posicionamento oficial informado pela marca.</p></details></div></section>
    </main>
    <Footer />
    <CartDrawer cart={cart} setCart={setCart} open={cartOpen} close={()=>setCartOpen(false)}/>
  </div>;
}
