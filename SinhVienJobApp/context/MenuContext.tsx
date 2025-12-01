import { createContext, useContext } from "react";

export const MenuContext = createContext({
  openMenu: () => {},
  closeMenu: () => {},
});

export const useMenu = () => useContext(MenuContext);
