import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
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

type Cart = Record<string, number>;
const productImages: Record<string, string> = {
  "nuve-5-em-1": serum5Client,
  "nuve-ghk-cu": serumGhk,
  "nuve-pdrn": serumPdrn,
};

const heroSlides = [
  { image: heroClient, eyebrow: "NUVE ADVANCED SKIN CARE", title: "Ciência, inovação e cuidado para realçar a sua melhor versão.", text: NUVE.intro, href: "#produtos", cta: "CONHEÇA NOSSOS PRODUTOS" },
  { image: serum5Client, eyebrow: "NUVE 5 EM 1", title: "Cinco ativos selecionados em uma única fórmula.", text: PRODUCTS[0].description, href: "#nuve-5-em-1", cta: "CONHECER 5 EM 1" },
  { image: serumGhk, eyebrow: "NUVE GHK-Cu", title: "O poder dos peptídeos em uma fórmula sofisticada.", text: PRODUCTS[1].description, href: "#nuve-ghk-cu", cta: "CONHECER GHK-Cu" },
  { image: serumPdrn, eyebrow: "NUVE PDRN + PEPTÍDEO DE COBRE", title: "Tecnologia avançada para uma rotina de skincare sofisticada.", text: PRODUCTS[2].description, href: "#nuve-pdrn", cta: "CONHECER PDRN" },
];

function ProductCard({ product, onAdd }: { product: NuveProduct; onAdd: (p: NuveProduct) => void }) {
  return <article className={`n2-card n2-${product.accent}`} id={product.id}>
    <a href={`#${product.id}`} className="n2-card-image"><img src={productImages[product.id]} alt={product.name} loading="lazy" /></a>
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
  return <div className="n2-cart-layer"><button className="n2-cart-bg" onClick={close}/><aside className="n2-cart">
    <div className="n2-cart-head"><div><span>SEU CARRINHO</span><strong>{qty} {qty===1?"item":"itens"}</strong></div><button onClick={close}><X/></button></div>
    <div className="n2-cart-items">{items.length===0 ? <div className="n2-empty"><ShoppingBag/><h3>Seu carrinho está vazio.</h3><button onClick={close}>VER PRODUTOS</button></div> : items.map(p=><div className="n2-cart-item" key={p.id}><img src={productImages[p.id]} alt=""/><div><strong>{p.name}</strong><span>{money(p.price)}</span><div className="n2-qty"><button onClick={()=>change(p.id,-1)}><Minus size={13}/></button><b>{cart[p.id]}</b><button onClick={()=>change(p.id,1)}><Plus size={13}/></button></div></div></div>)}</div>
    {items.length>0 && <div className="n2-cart-total"><p>{qty>=2?"10% OFF aplicado automaticamente":"Adicione 2 ou mais unidades e receba 10% OFF"}</p><div><span>Subtotal</span><b>{money(subtotal)}</b></div>{discount>0&&<div className="disc"><span>Desconto</span><b>- {money(discount)}</b></div>}<div className="total"><span>Total</span><b>{money(total)}</b></div><a href="/checkout">IR PARA O CHECKOUT</a></div>}
  </aside></div>;
}

export function NuveShop() {
  const [cart,setCart] = useState<Cart>({});
  const [cartOpen,setCartOpen] = useState(false);
  const [slide,setSlide] = useState(0);
  useEffect(()=>{ try { const s=localStorage.getItem("nuve-cart"); if(s) setCart(JSON.parse(s)); } catch{} },[]);
  useEffect(()=>{ try { localStorage.setItem("nuve-cart",JSON.stringify(cart)); } catch{} },[cart]);
  useEffect(()=>{ const id=setInterval(()=>setSlide(s=>(s+1)%heroSlides.length),5500); return()=>clearInterval(id); },[]);
  const count=useMemo(()=>Object.values(cart).reduce((a,b)=>a+b,0),[cart]);
  const add=(p:NuveProduct)=>{ setCart(c=>({...c,[p.id]:(c[p.id]||0)+1})); setCartOpen(true); };
  const s=heroSlides[slide];
  return <div className="n2-site">
    <Header cartCount={count} onCart={()=>setCartOpen(true)} />
    <main>
      <section className="n2-hero">
        <div className="n2-hero-media"><img src={s.image} alt={s.eyebrow} fetchPriority="high"/></div>
        <div className="n2-hero-overlay"/>
        <div className="n2-container n2-hero-copy"><p className="n2-kicker">{s.eyebrow}</p><h1>{s.title}</h1><p>{s.text}</p><div className="n2-hero-actions"><a href={s.href}>{s.cta}</a><a href="#sobre" className="ghost">CONHEÇA A NUVE</a></div></div>
        <div className="n2-hero-controls"><button onClick={()=>setSlide((slide-1+heroSlides.length)%heroSlides.length)}><ChevronLeft/></button><div>{heroSlides.map((_,i)=><button key={i} className={i===slide?"active":""} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}`}/>)}</div><button onClick={()=>setSlide((slide+1)%heroSlides.length)}><ChevronRight/></button></div>
      </section>

      <section className="n2-trust"><div className="n2-container"><span>FORMULAÇÕES DESENVOLVIDAS NO JAPÃO</span><i/> <span>ATIVOS SELECIONADOS</span><i/> <span>SKINCARE PARA A VIDA REAL</span></div></section>

      <section className="n2-products" id="produtos"><div className="n2-container"><header className="n2-heading"><p className="n2-kicker">A LINHA NUVE</p><h2>Três séruns. Três maneiras de elevar a rotina.</h2><p>Produto em primeiro plano, informação clara e compra simples.</p></header><div className="n2-grid">{PRODUCTS.map(p=><ProductCard key={p.id} product={p} onAdd={add}/>)}</div></div></section>

      <section className="n2-editorial"><div className="n2-container"><div className="n2-editorial-media"><img src={heroClient} alt="NUVE Advanced Skin Care" loading="lazy"/></div><div className="n2-editorial-copy"><p className="n2-kicker">NOSSO DIFERENCIAL</p><h2>{NUVE.differentiator}</h2><p>{NUVE.differentiatorText}</p><a href="#ativos">CONHEÇA OS ATIVOS</a></div></div></section>

      {PRODUCTS.map((p,i)=><section className={`n2-product-story n2-${p.accent}`} id={`${p.id}-detalhes`} key={p.id}><div className="n2-container"><div className="n2-story-media"><img src={productImages[p.id]} alt={p.name} loading="lazy"/></div><div className="n2-story-copy"><p className="n2-kicker">0{i+1} · {p.name}</p><h2>{p.eyebrow}</h2><p>{p.description}</p><div className="n2-story-columns"><div><span>ATIVOS</span>{p.actives.map(a=><p key={a}>{a}</p>)}</div><div><span>DESTAQUES</span>{p.benefits.map(b=><p key={b}>{b}</p>)}</div></div><div className="n2-story-buy"><strong>{money(p.price)}</strong><button onClick={()=>add(p)}>ADICIONAR AO CARRINHO</button></div></div></div></section>)}

      <section className="n2-chooser"><div className="n2-container"><header className="n2-heading center"><p className="n2-kicker">QUAL NUVE COMBINA COM SUA ROTINA?</p><h2>Compare de forma simples.</h2></header><div className="n2-compare"><article><b>5 EM 1</b><p>Praticidade e combinação de cinco ativos selecionados.</p><a href="#nuve-5-em-1">CONHECER</a></article><article className="blue"><b>GHK-Cu</b><p>Peptídeo de cobre em uma proposta cosmética sofisticada.</p><a href="#nuve-ghk-cu">CONHECER</a></article><article><b>PDRN</b><p>Ativos associados à nova geração do skincare.</p><a href="#nuve-pdrn">CONHECER</a></article></div></div></section>

      <section className="n2-actives" id="ativos"><div className="n2-container"><div><p className="n2-kicker">ATIVOS & TECNOLOGIA</p><h2>Ciência cosmética traduzida em cuidado.</h2><p>Conteúdo técnico apresentado apenas no contexto cosmético, sem promessas terapêuticas.</p></div><div className="n2-active-list"><p><b>Nano Colesterol</b><span>Cuidado e suporte à barreira da pele.</span></p><p><b>Nano Ácido Hialurônico</b><span>Hidratação e aparência mais preenchida e viçosa.</span></p><p><b>Nano Niacinamida</b><span>Barreira, uniformidade e aparência saudável.</span></p><p><b>Resveratrol</b><span>Ação antioxidante e cuidado contra os sinais do envelhecimento.</span></p><p><b>Óleo de Rosa Mosqueta</b><span>Nutrição, conforto e cuidado com a aparência da pele.</span></p></div></div></section>

      <section className="n2-kit"><div className="n2-container"><div><p className="n2-kicker">MONTE SUA ROTINA</p><h2>2 ou mais unidades = 10% OFF.</h2><p>Combine séruns diferentes. O desconto é aplicado automaticamente no carrinho.</p><a href="#produtos">ESCOLHER PRODUTOS</a></div><div className="n2-kit-images"><img src={serum5Client} alt="NUVE 5 EM 1"/><img src={serumGhk} alt="NUVE GHK-Cu"/></div></div></section>

      <section className="n2-about" id="sobre"><div className="n2-container"><p className="n2-kicker">A FILOSOFIA NUVE</p><h2>A beleza de cuidar de si.</h2><p>Menos complicação. Mais intenção.</p><blockquote>Essa é a Nuve. Skincare inteligente. Tecnologia. Cuidado. Beleza para a vida real.</blockquote></div></section>

      <section className="n2-faq" id="faq"><div className="n2-container"><header className="n2-heading"><p className="n2-kicker">FAQ</p><h2>Informação clara antes da compra.</h2></header><details><summary>Qual NUVE escolher?</summary><p>5 EM 1 prioriza praticidade; GHK-Cu destaca o peptídeo de cobre; PDRN + Peptídeo de Cobre segue uma proposta ligada às novas tendências de skincare.</p></details><details><summary>Existe desconto comprando mais de um?</summary><p>Sim. A condição inicial é 10% OFF na compra de 2 ou mais unidades.</p></details><details><summary>As formulações são desenvolvidas no Japão?</summary><p>Sim. Esse é o posicionamento oficial informado pela marca.</p></details></div></section>
    </main>
    <Footer />
    <CartDrawer cart={cart} setCart={setCart} open={cartOpen} close={()=>setCartOpen(false)}/>
  </div>;
}
