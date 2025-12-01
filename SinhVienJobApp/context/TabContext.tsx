import { createContext, useContext } from "react";

interface TabContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabContext = createContext<TabContextType>({
  activeTab: "home",
  setActiveTab: () => {},
});

export const useTab = () => useContext(TabContext);
