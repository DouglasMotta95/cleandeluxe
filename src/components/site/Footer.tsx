import { Instagram } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { NUVE } from "@/lib/nuve";

export function Footer() {
  return (
    <footer className="nuve-footer">
      <div className="nuve-container nuve-footer-grid">
        <div className="nuve-footer-brand">
          <Logo inverted />
          <p>Skincare inteligente. Tecnologia. Cuidado. Beleza para a vida real.</p>
          <div className="nuve-social-row">
            <a href={NUVE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram NUVE"><Instagram size={18} /></a>
            <a href={NUVE.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok NUVE" className="nuve-tiktok">t</a>
          </div>
        </div>

        <div>
          <h3>Descubra</h3>
          <a href="/#produtos">Loja</a>
          <a href="/#ativos">Ativos & Tecnologia</a>
          <a href="/#sobre">Sobre a Nuve</a>
          <a href="/#faq">FAQ</a>
        </div>
        <div>
          <h3>Atendimento</h3>
          <a href="/#contato">Contato</a>
          <a href="/privacidade">Privacidade</a>
          <a href="/termos">Termos de uso</a>
          <span>Trocas e devoluções — em definição</span>
        </div>
        <div>
          <h3>Newsletter</h3>
          <p>Receba novidades, lançamentos e conteúdos da NUVE.</p>
          <form className="nuve-newsletter" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Seu melhor e-mail" aria-label="E-mail" required />
            <button type="submit">QUERO RECEBER</button>
          </form>
        </div>
      </div>
      <div className="nuve-container nuve-footer-bottom">
        <span>© {new Date().getFullYear()} NUVE Advanced Skin Care.</span>
        <span>Menos complicação. Mais intenção.</span>
      </div>
    </footer>
  );
}
