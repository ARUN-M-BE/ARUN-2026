/**
 * Route registry and dispatcher mapping for all backend operations.
 * Organizes routes by domain and access-level matching industry MVC/Layered standards.
 */

import {
  ProfileController,
  ProjectController,
  SkillController,
  ExperienceController,
  EducationController,
  CertificationController,
  ServiceController,
  TestimonialController,
  MessageController,
  SettingsController,
  LegalController,
  MediaController,
  AuditController,
} from "@/server/controllers";

export const ServerRoutes = {
  // Public Read Operations
  public: {
    getPortfolioData: () =>
      Promise.all([
        ProfileController.getPublicProfile(),
        ProjectController.getPublicProjects(),
        SkillController.getPublicSkills(),
        ExperienceController.getPublicExperience(),
        EducationController.getPublicEducation(),
        CertificationController.getPublicCertifications(),
        ServiceController.getPublicServices(),
        TestimonialController.getPublicTestimonials(),
        SettingsController.getSiteSettings(),
      ]),
    getProfile: ProfileController.getPublicProfile,
    getProjects: ProjectController.getPublicProjects,
    getSkills: SkillController.getPublicSkills,
    getExperiences: ExperienceController.getPublicExperience,
    getEducations: EducationController.getPublicEducation,
    getCertifications: CertificationController.getPublicCertifications,
    getServices: ServiceController.getPublicServices,
    getTestimonials: TestimonialController.getPublicTestimonials,
    getSettings: SettingsController.getSiteSettings,
    getLegalDocumentBySlug: LegalController.getLegalDocumentBySlug,
    submitContactMessage: MessageController.submitContactForm,
  },

  // Protected Admin Management Operations
  admin: {
    // Profile
    getProfile: ProfileController.getProfile,
    updateProfile: ProfileController.updateProfile,

    // Projects
    getProjects: ProjectController.getProjects,
    getProjectById: ProjectController.getProjectById,
    createProject: ProjectController.createProject,
    updateProject: ProjectController.updateProject,
    deleteProject: ProjectController.deleteProject,

    // Skills
    getSkills: SkillController.getSkills,
    createSkill: SkillController.createSkill,
    deleteSkill: SkillController.deleteSkill,
    getCategories: SkillController.getCategories,
    createCategory: SkillController.createCategory,
    deleteCategory: SkillController.deleteCategory,

    // Experience
    getExperiences: ExperienceController.getExperiences,
    createExperience: ExperienceController.createExperience,
    updateExperience: ExperienceController.updateExperience,
    deleteExperience: ExperienceController.deleteExperience,

    // Education
    getEducation: EducationController.getEducation,
    createEducation: EducationController.createEducation,
    updateEducation: EducationController.updateEducation,
    deleteEducation: EducationController.deleteEducation,

    // Certifications
    getCertifications: CertificationController.getCertifications,
    createCertification: CertificationController.createCertification,
    updateCertification: CertificationController.updateCertification,
    deleteCertification: CertificationController.deleteCertification,

    // Services
    getServices: ServiceController.getServices,
    createService: ServiceController.createService,
    updateService: ServiceController.updateService,
    deleteService: ServiceController.deleteService,

    // Testimonials
    getTestimonials: TestimonialController.getTestimonials,
    createTestimonial: TestimonialController.createTestimonial,
    updateTestimonial: TestimonialController.updateTestimonial,
    deleteTestimonial: TestimonialController.deleteTestimonial,

    // Messages
    getContactMessages: MessageController.getContactMessages,
    updateMessageStatus: MessageController.updateMessageStatus,
    deleteMessage: MessageController.deleteMessage,

    // Settings
    getSiteSettings: SettingsController.getSiteSettings,
    updateSiteSetting: SettingsController.updateSiteSetting,

    // Legal
    getLegalDocuments: LegalController.getLegalDocuments,
    updateLegalDocument: LegalController.updateLegalDocument,
    deleteLegalDocument: LegalController.deleteLegalDocument,

    // Media
    getMediaAssets: MediaController.getMediaAssets,
    createMediaAsset: MediaController.createMediaAsset,
    deleteMediaAsset: MediaController.deleteMediaAsset,

    // Audit Logs
    getAuditLogs: AuditController.getAuditLogs,
  },
} as const;
