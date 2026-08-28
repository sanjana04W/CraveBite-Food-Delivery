"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import ConsultationModal from "@/components/ConsultationModal";

type ConsultationContextValue = {
  openConsultation: () => void;
  openModal: () => void;
  closeConsultation: () => void;
  closeModal: () => void;
  isModalOpen: boolean;
};

const ConsultationContext = createContext<ConsultationContextValue>({
  openConsultation: () => {},
  openModal: () => {},
  closeConsultation: () => {},
  closeModal: () => {},
  isModalOpen: false,
});

export function useConsultation() {
  return useContext(ConsultationContext);
}

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openConsultation = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openConsultation,
      openModal: openConsultation,
      closeConsultation,
      closeModal: closeConsultation,
      isModalOpen: isOpen,
    }),
    [openConsultation, closeConsultation, isOpen]
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <ConsultationModal isOpen={isOpen} onClose={closeConsultation} />
    </ConsultationContext.Provider>
  );
}
