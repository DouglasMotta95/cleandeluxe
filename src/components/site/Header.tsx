import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "@/components/site/Logo";

const NAV = [
  ["HOME", "/"],
  ["LOJA", "/#produtos"],
  ["5 EM 1", "/#nuve-5-em-1"],
  ["GHK-Cu", "/#nuve-ghk-cu"],
  ["PDRN", "/#nuve-pdrn"],
  ["ATIVOS", "/#ativos"],
  ["KITS", "/#monte-seu-kit"],
  ["SOBRE", "/#sobre"],
  ["FAQ", "/#faq"],
] as const;

export function Header({ cartCount = 0, onCart }: { cartCount?: number; onCart?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="nuve-promo">2 OU MAIS UNIDADES = 10% OFF · MONTE SUA EXPERIÊNCIA NUVE</div>
      <header className="nuve-header">
        <div className="nuve-container nuve-header-inner">
          <button className="nuve-icon-button nuve-mobile-menu" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu size={21} />
          </button>

          <a href="/" className="nuve-logo-link"><Logo /></a>

          <nav className="nuve-desktop-nav" aria-label="Navegação principal">
            {NAV.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          </nav>

          <div className="nuve-header-actions">
            <a className="nuve-icon-button" href="/#produtos" aria-label="Buscar produtos"><Search size={19} /></a>
            <a className="nuve-icon-button nuve-account" href="/auth" aria-label="Minha conta"><User size={19} /></a>
            <button className="nuve-icon-button nuve-cart-button" onClick={onCart} aria-label="Abrir carrinho">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="nuve-mobile-drawer" role="dialog" aria-modal="true">
          <div className="nuve-mobile-panel">
            <div className="nuve-mobile-top"><Logo /><button className="nuve-icon-button" onClick={() => setOpen(false)} aria-label="Fechar menu"><X /></button></div>
            <nav>
              {NAV.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
            </nav>
            <a href="/#monte-seu-kit" onClick={() => setOpen(false)} className="nuve-dark-button">MONTAR MEU KIT</a>
            <div className="nuve-mobile-social">Skincare inteligente. Tecnologia. Cuidado.</div>
          </div>
          <button className="nuve-mobile-backdrop" onClick={() => setOpen(false)} aria-label="Fechar menu" />
        </div>
      )}
    </>
  );
}
