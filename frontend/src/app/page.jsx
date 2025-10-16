"use client";

import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import StatsSection from "../components/home/StatsSection";
import ServicesSection from "../components/home/ServicesSection";
import SolutionsSection from "../components/home/SolutionsSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";
import Modal from "../components/Modal";
import WebsiteRequestForm from "../components/form/WebsiteRequestForm";
import AiContentRequestForm from "../components/form/AiContentRequestForm";
import CloudHostingRequestForm from "../components/form/CloudHostingRequestForm";
import CrmSolutionRequestForm from "../components/form/CrmSolutionRequestForm";
import HrmsSolutionRequestForm from "../components/form/HrmsSolutionRequestForm";
import MobileAppRequestForm from "../components/form/MobileAppRequestForm";
import DigitalMarketingForm from "../components/form/DigitalMarketingForm";
import HealthcareRequestForm from "../components/form/HealthcareRequestForm";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [isHrmsModalOpen, setIsHrmsModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isDigitalMarketingModalOpen, setIsDigitalMarketingModalOpen] = useState(false);
  const [isHealthcareModalOpen, setIsHealthcareModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleWebsiteQuoteClick = () => {
    setIsModalOpen(true);
  };

  const handleAiQuoteClick = () => {
    setIsAiModalOpen(true);
  };

  const handleCloudQuoteClick = () => {
    setIsCloudModalOpen(true);
  };

  const handleCrmQuoteClick = () => {
    setIsCrmModalOpen(true);
  };

  const handleHrmsQuoteClick = () => {
    setIsHrmsModalOpen(true);
  };

  const handleMobileQuoteClick = () => {
    setIsMobileModalOpen(true);
  };

  const handleDigitalMarketingQuoteClick = () => {
    setIsDigitalMarketingModalOpen(true);
  };

  const handleHealthcareQuoteClick = () => {
    setIsHealthcareModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAiModal = () => {
    setIsAiModalOpen(false);
  };

  const handleCloseCloudModal = () => {
    setIsCloudModalOpen(false);
  };

  const handleCloseCrmModal = () => {
    setIsCrmModalOpen(false);
  };

  const handleCloseHrmsModal = () => {
    setIsHrmsModalOpen(false);
  };

  
  const handleCloseMobileModal = () => {
    setIsMobileModalOpen(false);
  };

  const handleCloseDigitalMarketingModal = () => {
    setIsDigitalMarketingModalOpen(false);
  };

  const handleCloseHealthcareModal = () => {
    setIsHealthcareModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-[#F5F7FA] overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <ServicesSection onWebsiteQuoteClick={handleWebsiteQuoteClick} onCloudHostingQuoteClick={handleCloudQuoteClick} onMobileQuoteClick={handleMobileQuoteClick} onDigitalMarketingQuoteClick={handleDigitalMarketingQuoteClick} />
      <SolutionsSection onAiQuoteClick={handleAiQuoteClick} onCrmQuoteClick={handleCrmQuoteClick} onHrmsQuoteClick={handleHrmsQuoteClick} onHealthcareQuoteClick={handleHealthcareQuoteClick} />
      <WhyChooseUsSection />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <WebsiteRequestForm onClose={handleCloseModal} />
      </Modal>
      <Modal isOpen={isAiModalOpen} onClose={handleCloseAiModal}>
        <AiContentRequestForm onClose={handleCloseAiModal} />
      </Modal>
      <Modal isOpen={isCloudModalOpen} onClose={handleCloseCloudModal}>
        <CloudHostingRequestForm onClose={handleCloseCloudModal} />
      </Modal>
      <Modal isOpen={isCrmModalOpen} onClose={handleCloseCrmModal}>
        <CrmSolutionRequestForm onClose={handleCloseCrmModal} />
      </Modal>
      <Modal isOpen={isHrmsModalOpen} onClose={handleCloseHrmsModal}>
        <HrmsSolutionRequestForm onClose={handleCloseHrmsModal} />
      </Modal>
      <Modal isOpen={isMobileModalOpen} onClose={handleCloseMobileModal}>
        <MobileAppRequestForm onClose={handleCloseMobileModal} />
      </Modal>
      <Modal isOpen={isDigitalMarketingModalOpen} onClose={handleCloseDigitalMarketingModal}>
        <DigitalMarketingForm onClose={handleCloseDigitalMarketingModal} />
      </Modal>
      <Modal isOpen={isHealthcareModalOpen} onClose={handleCloseHealthcareModal}>
        <HealthcareRequestForm onClose={handleCloseHealthcareModal} />
      </Modal>
    </div>
  );
}
