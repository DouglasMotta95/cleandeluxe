import { Check, ChevronRight, Minus, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { NUVE, PRODUCTS, money, type NuveProduct } from "@/lib/nuve";

type CartState = Record<string, number>;

function BottleArt({ product, hero = false }: { product: NuveProduct; hero?: boolean }) {
  return (
    <div className={`nuve-bottle-art ${product.accent} ${hero ? "hero" : ""}`} aria-hidden="true">
      <div className="nuve-bottle-shadow" />
      <div className="nuve-dropper"><span /></div>
      <div className="nuve-bottle-body">
        <div className="nuve-bottle-logo">NUVE</div>
        <div className="nuve-bottle-name">{product.shortName}</div>
        <div className="nuve-bottle-line" />
        <small>ADVANCED SKIN CARE</small>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: NuveProduct; onAdd: (product: NuveProduct) => void }) {
  return (
    <article className="nuve-product-card" id={product.id}>
      <div className={`nuve-product-visual ${product.accent}`}>
        <span className="nuve-product-badge">NOVO</span>
        <BottleArt product={product} />
      </div>
      <div className="nuve-product-content">
        <p className="nuve-kicker">NUVE ADVANCED SKIN CARE</p>
        <h3>{product.name}</h3>
        <p className="nuve-product-eyebrow">{product.eyebrow}</p>
        <p className="nuve-product-copy">{product.description}</p>
        <div className="nuve-product-meta">
          <strong>{money(product.price)}</strong>
          <span>ou em parcelas no checkout</span>
        </div>
        <button className="nuve-dark-button" onClick={() => onAdd(product)}>
          ADICIONAR AO CARRINHO <ShoppingBag size={17} />
        </button>
      </div>
    </article>
  );
}

function CartDrawer({ cart, setCart, open, setOpen }: {
  cart: CartState;
  setCart: React.Dispatch<React.SetStateAction<CartState>>;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const items = PRODUCTS.filter((p) => (cart[p.id] ?? 0) > 0);
  const quantity = items.reduce((sum, p) => sum + (cart[p.id] ?? 0), 0);
  const subtotal = items.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0);
  const discount = quantity >= 2 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const change = (id: string, delta: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] ?? 0) + delta);
      const updated = { ...current, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };

  if (!open) return null;

  return (
    <div className="nuve-cart-layer" role="dialog" aria-modal="true" aria-label="Carrinho">
      <button className="nuve-cart-backdrop" onClick={() => setOpen(false)} aria-label="Fechar carrinho" />
      <aside className="nuve-cart-panel">
        <div className="nuve-cart-head">
          <div><span>SEU CARRINHO</span><strong>{quantity} {quantity === 1 ? "item" : "itens"}</strong></div>
          <button className="nuve-icon-button" onClick={() => setOpen(false)}><X /></button>
        </div>

        {items.length === 0 ? (
          <div className="nuve-cart-empty">
            <ShoppingBag size={34} />
            <h3>Seu carrinho está vazio</h3>
            <p>Descubra a linha NUVE e escolha o sérum que combina com a sua rotina.</p>
            <button className="nuve-dark-button" onClick={() => setOpen(false)}>VER PRODUTOS</button>
          </div>
        ) : (
          <>
            <div className="nuve-cart-items">
              {items.map((product) => (
                <div className="nuve-cart-item" key={product.id}>
                  <div className={`nuve-cart-mini ${product.accent}`}><BottleArt product={product} /></div>
                  <div className="nuve-cart-info">
                    <h4>{product.name}</h4>
                    <span>{money(product.price)}</span>
                    <div className="nuve-qty">
                      <button onClick={() => change(product.id, -1)} aria-label="Diminuir"><Minus size={14} /></button>
                      <strong>{cart[product.id]}</strong>
                      <button onClick={() => change(product.id, 1)} aria-label="Aumentar"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="nuve-cart-promo">
              {quantity >= 2 ? <><Check size={16} /> Desconto de 10% aplicado automaticamente</> : <>Adicione mais 1 unidade e ganhe 10% OFF</>}
            </div>
            <div className="nuve-cart-totals">
              <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              {discount > 0 && <div className="discount"><span>Desconto</span><strong>- {money(discount)}</strong></div>}
              <div className="total"><span>Total</span><strong>{money(total)}</strong></div>
            </div>
            <a href="/checkout" className="nuve-dark-button nuve-checkout-button">IR PARA O CHECKOUT <ChevronRight size={17} /></a>
            <small className="nuve-cart-note">Frete e pagamento são calculados na etapa seguinte.</small>
          </>
        )}
      </aside>
    </div>
  );
}

export function NuveShop() {
  const [cart, setCart] = useState<CartState>({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nuve-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("nuve-cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  const count = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);

  const add = (product: NuveProduct) => {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setCartOpen(true);
  };

  return (
    <div className="nuve-site">
      <Header cartCount={count} onCart={() => setCartOpen(true)} />

      <main>
        <section className="nuve-hero">
          <div className="nuve-hero-orb orb-one" /><div className="nuve-hero-orb orb-two" />
          <div className="nuve-container nuve-hero-grid">
            <div className="nuve-hero-copy">
              <p className="nuve-kicker">ADVANCED SKIN CARE · JAPANESE TECHNOLOGY</p>
              <h1>{NUVE.headline}</h1>
              <p>{NUVE.intro}</p>
              <div className="nuve-hero-actions">
                <a href="#sobre" className="nuve-light-button">CONHEÇA A NUVE</a>
                <a href="#produtos" className="nuve-dark-button">CONHEÇA OS PRODUTOS <ChevronRight size={17} /></a>
              </div>
              <div className="nuve-hero-proof">
                <span>FORMULAÇÕES DESENVOLVIDAS NO JAPÃO</span>
                <span>ATIVOS SELECIONADOS</span>
                <span>ROTINA INTELIGENTE</span>
              </div>
            </div>

            <div className="nuve-hero-art">
              <div className="nuve-hero-ring ring-a" /><div className="nuve-hero-ring ring-b" />
              <BottleArt product={PRODUCTS[0]} hero />
              <div className="nuve-hero-caption"><span>01</span><strong>SKINCARE<br />PARA A VIDA REAL</strong></div>
            </div>
          </div>
          <div className="nuve-scroll-hint">DESCUBRA A NUVE <span /></div>
        </section>

        <section className="nuve-editorial-strip">
          <div className="nuve-container">
            <p>TECNOLOGIA</p><span>✦</span><p>CUIDADO</p><span>✦</span><p>BELEZA</p><span>✦</span><p>INTENÇÃO</p>
          </div>
        </section>

        <section className="nuve-products-section" id="produtos">
          <div className="nuve-container">
            <header className="nuve-section-heading">
              <div><p className="nuve-kicker">A LINHA NUVE</p><h2>Três fórmulas. Uma nova forma de cuidar da pele.</h2></div>
              <p>Ativos selecionados e uma experiência de skincare pensada para uma rotina moderna, prática e especial.</p>
            </header>
            <div className="nuve-products-grid">
              {PRODUCTS.map((product) => <ProductCard key={product.id} product={product} onAdd={add} />)}
            </div>
          </div>
        </section>

        <section className="nuve-japan-section">
          <div className="nuve-container nuve-japan-grid">
            <div className="nuve-japan-mark"><span>NUVE</span><small>JAPAN FORMULATION</small></div>
            <div>
              <p className="nuve-kicker">NOSSO DIFERENCIAL</p>
              <h2>{NUVE.differentiator}</h2>
              <p>{NUVE.differentiatorText}</p>
              <div className="nuve-japan-points">
                <span><Check /> Tecnologia em skincare</span>
                <span><Check /> Seleção cuidadosa de ativos</span>
                <span><Check /> Rotina moderna e prática</span>
              </div>
            </div>
          </div>
        </section>

        <section className="nuve-chooser-section">
          <div className="nuve-container">
            <header className="nuve-centered-heading"><p className="nuve-kicker">QUAL NUVE COMBINA COM A SUA ROTINA?</p><h2>Escolha pelo que você busca incorporar ao seu cuidado.</h2></header>
            <div className="nuve-chooser-grid">
              {PRODUCTS.map((p, i) => (
                <a key={p.id} href={`#${p.id}`} className={`nuve-choice ${p.accent}`}>
                  <span>0{i + 1}</span><h3>{p.shortName}</h3><p>{p.eyebrow}</p><strong>CONHECER <ChevronRight size={15} /></strong>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="nuve-actives-section" id="ativos">
          <div className="nuve-container nuve-actives-grid">
            <div className="nuve-actives-copy">
              <p className="nuve-kicker">ATIVOS & TECNOLOGIA</p>
              <h2>Ciência cosmética traduzida em cuidado.</h2>
              <p>A NUVE apresenta ativos selecionados dentro de um contexto cosmético responsável, sem promessas terapêuticas ou resultados garantidos.</p>
              <a href="#produtos" className="nuve-light-button">EXPLORAR A LINHA</a>
            </div>
            <div className="nuve-active-list">
              <article><span>01</span><div><h3>Niacinamida</h3><p>Barreira, uniformidade e aparência saudável.</p></div></article>
              <article><span>02</span><div><h3>Ácido Hialurônico</h3><p>Hidratação e aparência mais preenchida e viçosa.</p></div></article>
              <article><span>03</span><div><h3>GHK-Cu</h3><p>Peptídeo conhecido na cosmética avançada para cuidado da aparência da pele.</p></div></article>
              <article><span>04</span><div><h3>PDRN</h3><p>Ativo associado às novas tendências de skincare em contexto cosmético.</p></div></article>
            </div>
          </div>
        </section>

        <section className="nuve-selfcare" id="sobre">
          <div className="nuve-container nuve-selfcare-grid">
            <div className="nuve-selfcare-art"><div className="nuve-face-line" /><Sparkles /></div>
            <div>
              <p className="nuve-kicker">A FILOSOFIA NUVE</p>
              <h2>A beleza de cuidar de si.</h2>
              <p>Menos complicação. Mais intenção. A rotina de skincare como um momento simples, sofisticado e possível dentro da vida real.</p>
              <blockquote>“Essa é a Nuve. Skincare inteligente. Tecnologia. Cuidado. Beleza para a vida real.”</blockquote>
            </div>
          </div>
        </section>

        <section className="nuve-kit-section">
          <div className="nuve-container nuve-kit-grid">
            <div><p className="nuve-kicker">MONTE SUA ROTINA</p><h2>Escolha 2 ou mais e receba 10% OFF.</h2><p>Combine fórmulas diferentes e o desconto é aplicado automaticamente no carrinho.</p><a href="#produtos" className="nuve-dark-button">MONTAR MEU KIT</a></div>
            <div className="nuve-kit-bottles"><BottleArt product={PRODUCTS[1]} /><BottleArt product={PRODUCTS[2]} /></div>
          </div>
        </section>

        <section className="nuve-faq-section" id="faq">
          <div className="nuve-container nuve-faq-grid">
            <div><p className="nuve-kicker">DÚVIDAS FREQUENTES</p><h2>O essencial, sem complicação.</h2><p>Informações técnicas específicas, modo de uso e políticas comerciais finais serão mantidos editáveis e publicados apenas quando oficialmente aprovados pela marca.</p></div>
            <div className="nuve-faq-list">
              <details open><summary>Qual NUVE escolher?</summary><p>O 5 EM 1 prioriza praticidade e combinação de ativos; o GHK-Cu destaca o peptídeo de cobre; o PDRN + Peptídeo de Cobre segue a proposta de ativos associados às novas tendências de skincare.</p></details>
              <details><summary>Existe desconto comprando mais de um?</summary><p>Sim. A condição inicial da loja é 10% OFF na compra de 2 ou mais unidades, aplicada automaticamente no carrinho.</p></details>
              <details><summary>As formulações são desenvolvidas no Japão?</summary><p>Sim. O posicionamento oficial da marca é “Formulações desenvolvidas no Japão”.</p></details>
              <details><summary>Como usar cada sérum?</summary><p>A orientação oficial de uso será exibida conforme o conteúdo aprovado da marca e da embalagem, sem inventar instruções técnicas.</p></details>
            </div>
          </div>
        </section>

        <section className="nuve-contact-band" id="contato">
          <div className="nuve-container"><div><p className="nuve-kicker">SIGA A NUVE</p><h2>Skincare, tecnologia e beleza para a vida real.</h2></div><div className="nuve-contact-actions"><a href={NUVE.instagram} target="_blank" rel="noreferrer">INSTAGRAM</a><a href={NUVE.tiktok} target="_blank" rel="noreferrer">TIKTOK</a></div></div>
        </section>
      </main>

      <Footer />
      <CartDrawer cart={cart} setCart={setCart} open={cartOpen} setOpen={setCartOpen} />
    </div>
  );
}
