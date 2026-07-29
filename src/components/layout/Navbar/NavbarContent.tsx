"use client";

import { useState, useCallback, useEffect } from "react";
import { Session, User } from "@/lib/auth";
import { useResetPasswordToken } from "@/hooks/useResetPasswordToken";
import { Menu } from "@/components/ui/icons/Menu";
import { NavbarLogo } from "./NavbarLogo";
import { NavLinks } from "./NavLinks";
import { CartIcon } from "./CartIcon";
import { DrawerMenu } from "./DrawerMenu";
import { AnnouncementBar } from "./AnnouncementBar";
import { usePathname } from "next/navigation";

interface Props {
  session: { session: Session; user: User } | null;
}

export const NavbarContent = ({ session }: Props) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [drawer, setDrawer] = useState(false);
  const [active, setActive] = useState("الرئيسية");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useResetPasswordToken();

  const handleLink = useCallback((name: string) => setActive(name), []);

  useEffect(() => {
    let ticking = false;
    let lastY = window.scrollY;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled(y > 50);
          // Hide when scrolling down past the header, show when scrolling up
          if (y > lastY && y > 120) {
            setHidden(true);
          } else if (y < lastY) {
            setHidden(false);
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <AnnouncementBar />
      <div className="bg-brand-deep transition-all duration-300">
      <div className="container flex items-center h-20">

        {/* LOGO */}
        <div className="flex-1 flex justify-center order-2 md:order-1 md:flex-none md:justify-start">
          <NavbarLogo />
        </div>

        {/* LEFT (links + menu) */}
        <div className="flex-1 flex items-center order-1 md:order-2">
          <button
            onClick={() => setDrawer(true)}
            aria-label="فتح القائمة"
            className="md:hidden cursor-pointer"
          >
            <Menu className="text-bg" />
          </button>

          <ul className="hidden md:flex gap-2 lg:ml-12">
            <NavLinks activeLink={active} onLinkClick={handleLink} />
          </ul>
        </div>

        {/* RIGHT (cart) */}
        <div className="flex-1 flex items-center gap-1 md:gap-2 justify-end order-3 md:order-3 md:flex-none md:ml-auto">
          <CartIcon />
        </div>

      </div>
      </div>

      <DrawerMenu
        isOpen={drawer}
        onClose={() => setDrawer(false)}
        activeLink={active}
        onSelect={handleLink}
      />
    </nav>
  );
};