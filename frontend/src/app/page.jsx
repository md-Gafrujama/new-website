"use client";

import { useState, useEffect } from "react";
import HeroSection from "../components/home/HeroSection";
import AboutSection from "../components/home/AboutSection";
import AiTechStackSection from "../components/home/AiTechStackSection";

import ServicesSection from "../components/home/ServicesSection";
import SolutionsSection from "../components/home/SolutionsSection";
import WhyChooseUsSection from "../components/home/WhyChooseUsSection";
import Modal from "../components/Modal";
import WebsiteRequestForm from "../components/form/WebsiteRequestForm";
import CloudHostingRequestForm from "../components/form/CloudHostingRequestForm";
import CrmSolutionRequestForm from "../components/form/CrmSolutionRequestForm";
import HrmsSolutionRequestForm from "../components/form/HrmsSolutionRequestForm";
import MobileAppRequestForm from "../components/form/MobileAppRequestForm";
import DigitalMarketingForm from "../components/form/DigitalMarketingForm";
import HealthcareRequestForm from "../components/form/HealthcareRequestForm";
import EcommerceRequestForm from "../components/form/EcommerceRequestForm";
import LmsRequestsForm from "../components/form/LmsRequestsForm";
import BrandingDesignForm from "../components/form/BrandingDesignForm";
import SaasProductForm from "../components/form/SaasProductForm";
import VideoEditingRequestForm from "../components/form/VideoEditingRequestForm";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isCrmModalOpen, setIsCrmModalOpen] = useState(false);
  const [isHrmsModalOpen, setIsHrmsModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isDigitalMarketingModalOpen, setIsDigitalMarketingModalOpen] = useState(false);
  const [isHealthcareModalOpen, setIsHealthcareModalOpen] = useState(false);
  const [isEcommerceModalOpen, setIsEcommerceModalOpen] = useState(false);
  const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isSaasModalOpen, setIsSaasModalOpen] = useState(false);
  const [isVideoEditingModalOpen, setIsVideoEditingModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleWebsiteQuoteClick = () => {
    setIsModalOpen(true);
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

  const handleEcommerceQuoteClick = () => {
    setIsEcommerceModalOpen(true);
  };

  const handleLmsQuoteClick = () => {
    setIsLmsModalOpen(true);
  };

  const handleBrandingQuoteClick = () => {
    setIsBrandingModalOpen(true);
  };

  const handleSaasQuoteClick = () => {
    setIsSaasModalOpen(true);
  };

  const handleVideoEditingQuoteClick = () => {
    setIsVideoEditingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const handleCloseEcommerceModal = () => {
    setIsEcommerceModalOpen(false);
  };

  const handleCloseLmsModal = () => {
    setIsLmsModalOpen(false);
  };

  const handleCloseBrandingModal = () => {
    setIsBrandingModalOpen(false);
  };

  const handleCloseSaasModal = () => {
    setIsSaasModalOpen(false);
  };

  const handleCloseVideoEditingModal = () => {
    setIsVideoEditingModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-[#F5F7FA] overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <AiTechStackSection />

      <ServicesSection onWebsiteQuoteClick={handleWebsiteQuoteClick} onVideoEditingQuoteClick={handleVideoEditingQuoteClick} onMobileQuoteClick={handleMobileQuoteClick} onDigitalMarketingQuoteClick={handleDigitalMarketingQuoteClick} onBrandingQuoteClick={handleBrandingQuoteClick} onSaasQuoteClick={handleSaasQuoteClick} />
      <SolutionsSection onCrmQuoteClick={handleCrmQuoteClick} onHrmsQuoteClick={handleHrmsQuoteClick} onHealthcareQuoteClick={handleHealthcareQuoteClick} onEcommerceQuoteClick={handleEcommerceQuoteClick} onLmsQuoteClick={handleLmsQuoteClick} onCloudHostingQuoteClick={handleCloudQuoteClick} />
      <WhyChooseUsSection />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <WebsiteRequestForm onClose={handleCloseModal} />
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
      <Modal isOpen={isEcommerceModalOpen} onClose={handleCloseEcommerceModal}>
        <EcommerceRequestForm onClose={handleCloseEcommerceModal} />
      </Modal>
      <Modal isOpen={isLmsModalOpen} onClose={handleCloseLmsModal}>
        <LmsRequestsForm onClose={handleCloseLmsModal} />
      </Modal>
      <Modal isOpen={isBrandingModalOpen} onClose={handleCloseBrandingModal}>
        <BrandingDesignForm onClose={handleCloseBrandingModal} />
      </Modal>
      <Modal isOpen={isSaasModalOpen} onClose={handleCloseSaasModal}>
        <SaasProductForm onClose={handleCloseSaasModal} />
      </Modal>
      <Modal isOpen={isVideoEditingModalOpen} onClose={handleCloseVideoEditingModal}>
        <VideoEditingRequestForm onClose={handleCloseVideoEditingModal} />
      </Modal>
    </div>
  );
}
