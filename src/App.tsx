import React, { useState, useEffect, useMemo } from 'react';
import { 
  Contact, ProjectSettings, ActiveStep, MainView, DuplicateMatch, MissingInfoReport 
} from './types';
import { 
  loadSavedContacts, saveContacts, loadSavedProjects, saveProjects, 
  loadActiveProjectId, saveActiveProjectId, loadSeniorMode, saveSeniorMode, 
  clearAllLocalData, DEFAULT_PROJECT_SETTINGS 
} from './utils/storage';
import { DEMO_CONTACTS } from './utils/demoData';
import { findDuplicates, auditMissingInfo } from './utils/audit';
import { generateDirectoryPdf } from './utils/pdfGenerator';

import { Header } from './components/Header';
import { StepBar } from './components/StepBar';
import { LandingHero } from './components/LandingHero';
import { ImportCenter } from './components/ImportCenter';
import { ContactWorkspace } from './components/ContactWorkspace';
import { OrganizeCenter } from './components/OrganizeCenter';
import { DesignStudio } from './components/DesignStudio';
import { LivePreview } from './components/LivePreview';
import { ExportPrintCenter } from './components/ExportPrintCenter';
import { DuplicateReview } from './components/DuplicateReview';
import { MissingInfoReportView } from './components/MissingInfoReportView';
import { PrivacyCenter } from './components/PrivacyCenter';
import { HelpCenter } from './components/HelpCenter';
import { EditContactModal } from './components/EditContactModal';
import { ProjectManager } from './components/ProjectManager';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(loadSavedContacts);
  const [projects, setProjects] = useState<ProjectSettings[]>(loadSavedProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(loadActiveProjectId);
  const [seniorMode, setSeniorMode] = useState<boolean>(loadSeniorMode);

  const [currentView, setCurrentView] = useState<MainView>('workflow');
  const [activeStep, setActiveStep] = useState<ActiveStep>('import');
  const [showLanding, setShowLanding] = useState<boolean>(false);

  // Edit/Add modal
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Save contacts on change
  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  // Save projects on change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  // Save active project id
  useEffect(() => {
    saveActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  // Save senior mode
  useEffect(() => {
    saveSeniorMode(seniorMode);
  }, [seniorMode]);

  // Current project settings
  const currentProject = useMemo(() => {
    const found = projects.find(p => p.id === activeProjectId);
    return found || projects[0] || DEFAULT_PROJECT_SETTINGS;
  }, [projects, activeProjectId]);

  const updateProjectSettings = (updated: ProjectSettings) => {
    setProjects(projects.map(p => (p.id === updated.id ? updated : p)));
  };

  // Duplicates & Missing info audits
  const duplicates = useMemo(() => findDuplicates(contacts), [contacts]);
  const missingInfo = useMemo(() => auditMissingInfo(contacts), [contacts]);

  // Check if current contacts are the demo contacts
  const isDemoData = useMemo(() => {
    return contacts.some(c => c.source === 'demo');
  }, [contacts]);

  // Contact Handlers
  const handleUpdateContact = (updated: Contact) => {
    setContacts(contacts.map(c => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSelectAll = () => {
    setContacts(contacts.map(c => ({ ...c, isIncluded: true })));
  };

  const handleDeselectAll = () => {
    setContacts(contacts.map(c => ({ ...c, isIncluded: false })));
  };

  const handleInvertSelection = () => {
    setContacts(contacts.map(c => ({ ...c, isIncluded: !c.isIncluded })));
  };

  const handleBatchToggle = (ids: string[], include: boolean) => {
    setContacts(contacts.map(c => (ids.includes(c.id) ? { ...c, isIncluded: include } : c)));
  };

  const handleSaveContactFromModal = (saved: Contact) => {
    const exists = contacts.some(c => c.id === saved.id);
    if (exists) {
      setContacts(contacts.map(c => (c.id === saved.id ? saved : c)));
    } else {
      setContacts([saved, ...contacts]);
    }
  };

  const handleContactsImported = (newContacts: Contact[], sourceLabel: string) => {
    // Append or replace depending on user data
    setContacts(prev => {
      // If previous was pure demo data, replace with new imported data
      const isPureDemo = prev.length > 0 && prev.every(c => c.source === 'demo');
      if (isPureDemo) {
        return newContacts;
      }
      // Otherwise merge avoiding duplicate IDs
      const existingIds = new Set(prev.map(c => c.id));
      const fresh = newContacts.filter(c => !existingIds.has(c.id));
      return [...fresh, ...prev];
    });
  };

  const handleMergeDuplicate = (merged: Contact, keepId: string, removeId: string) => {
    setContacts(prev => prev.filter(c => c.id !== removeId).map(c => (c.id === keepId ? merged : c)));
  };

  // Projects management
  const handleCreateProject = (name: string) => {
    const newProj: ProjectSettings = {
      ...DEFAULT_PROJECT_SETTINGS,
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects([...projects, newProj]);
    setActiveProjectId(newProj.id);
  };

  const handleDuplicateProject = (orig: ProjectSettings) => {
    const dup: ProjectSettings = {
      ...orig,
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: `${orig.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setProjects([...projects, dup]);
    setActiveProjectId(dup.id);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeProjectId === id) {
      setActiveProjectId(remaining[0].id);
    }
  };

  const handleClearAllLocalData = () => {
    clearAllLocalData();
    setContacts([]);
    setProjects([DEFAULT_PROJECT_SETTINGS]);
    setActiveProjectId(DEFAULT_PROJECT_SETTINGS.id);
    setShowLanding(true);
  };

  const handleClearContactsOnly = () => {
    setContacts([]);
    localStorage.removeItem('pocket_dir_contacts_v1');
    setShowLanding(true);
  };

  const handleStartWorkflow = () => {
    setShowLanding(false);
    setCurrentView('workflow');
    setActiveStep('import');
  };

  const handleTryDemo = () => {
    setContacts(DEMO_CONTACTS);
    setShowLanding(false);
    setCurrentView('workflow');
    setActiveStep('select');
  };

  const activeContactsList = contacts.filter(c => c.isIncluded);

  return (
    <div className={`min-h-screen flex flex-col ${seniorMode ? 'text-base font-medium' : 'text-sm'}`}>
      {/* 1. Header (Hidden during native print) */}
      <div className="no-print">
        <Header
          currentView={currentView}
          setCurrentView={(v) => {
            setCurrentView(v);
            if (v === 'workflow') setShowLanding(false);
          }}
          seniorMode={seniorMode}
          setSeniorMode={setSeniorMode}
          contactCount={contacts.length}
          isDemoData={isDemoData}
          onClearData={handleClearContactsOnly}
        />

        {/* 2. Step Bar Navigation (when in main workflow and not landing) */}
        {!showLanding && currentView === 'workflow' && (
          <StepBar
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            contactCount={contacts.length}
            selectedCount={activeContactsList.length}
            seniorMode={seniorMode}
          />
        )}
      </div>

      {/* 3. Main Workspace Area (Hidden during native print) */}
      <main className="flex-1 pb-16 no-print">
        {/* Landing Page */}
        {showLanding ? (
          <LandingHero
            onStartWorkflow={handleStartWorkflow}
            onImportClick={() => {
              setShowLanding(false);
              setCurrentView('workflow');
              setActiveStep('import');
            }}
            onTryDemo={handleTryDemo}
            onOpenHelp={() => {
              setShowLanding(false);
              setCurrentView('help');
            }}
            seniorMode={seniorMode}
          />
        ) : (
          <>
            {/* View: Projects Manager */}
            {currentView === 'projects' && (
              <ProjectManager
                projects={projects}
                activeProjectId={activeProjectId}
                onSelectProject={(id) => setActiveProjectId(id)}
                onCreateProject={handleCreateProject}
                onDuplicateProject={handleDuplicateProject}
                onDeleteProject={handleDeleteProject}
                onImportProjectJson={(proj) => {
                  setProjects([...projects, proj]);
                  setActiveProjectId(proj.id);
                }}
                onBack={() => setCurrentView('workflow')}
                seniorMode={seniorMode}
              />
            )}

            {/* View: Privacy Center */}
            {currentView === 'privacy' && (
              <PrivacyCenter
                contacts={contacts}
                projects={projects}
                onClearContacts={handleClearContactsOnly}
                onClearAllData={handleClearAllLocalData}
                onBack={() => setCurrentView('workflow')}
                seniorMode={seniorMode}
              />
            )}

            {/* View: Help Center */}
            {currentView === 'help' && (
              <HelpCenter
                onBack={() => setCurrentView('workflow')}
                seniorMode={seniorMode}
              />
            )}

            {/* View: Duplicates Review */}
            {currentView === 'duplicates' && (
              <DuplicateReview
                duplicates={duplicates}
                onMerge={handleMergeDuplicate}
                onIgnore={() => {}}
                onBack={() => setCurrentView('workflow')}
                seniorMode={seniorMode}
              />
            )}

            {/* View: Missing Info Audit */}
            {currentView === 'missing' && (
              <MissingInfoReportView
                reports={missingInfo}
                contacts={contacts}
                onExcludeContact={(id) => handleBatchToggle([id], false)}
                onExcludeAllIncomplete={() => {
                  const badIds = missingInfo.map(m => m.contactId);
                  handleBatchToggle(badIds, false);
                }}
                onEditContact={(c) => {
                  setEditContact(c);
                  setIsEditModalOpen(true);
                }}
                onBack={() => setCurrentView('workflow')}
                seniorMode={seniorMode}
              />
            )}

            {/* View: Primary Guided Workflow Steps */}
            {currentView === 'workflow' && (
              <>
                {/* Step 1: Import */}
                {activeStep === 'import' && (
                  <ImportCenter
                    onContactsImported={handleContactsImported}
                    onProceedToSelection={() => setActiveStep('select')}
                    existingCount={contacts.length}
                    onAddNewManual={() => {
                      setEditContact(null);
                      setIsEditModalOpen(true);
                    }}
                    seniorMode={seniorMode}
                  />
                )}

                {/* Step 2: Select Contacts */}
                {activeStep === 'select' && (
                  <ContactWorkspace
                    contacts={contacts}
                    onUpdateContact={handleUpdateContact}
                    onDeleteContact={handleDeleteContact}
                    onBatchToggleIncluded={handleBatchToggle}
                    onSelectAll={handleSelectAll}
                    onDeselectAll={handleDeselectAll}
                    onInvertSelection={handleInvertSelection}
                    onEditContact={(c) => {
                      setEditContact(c);
                      setIsEditModalOpen(true);
                    }}
                    onAddNewContact={() => {
                      setEditContact(null);
                      setIsEditModalOpen(true);
                    }}
                    onOpenDuplicates={() => setCurrentView('duplicates')}
                    onOpenMissingInfo={() => setCurrentView('missing')}
                    duplicateCount={duplicates.length}
                    missingInfoCount={missingInfo.length}
                    seniorMode={seniorMode}
                  />
                )}

                {/* Step 3: Organize */}
                {activeStep === 'organize' && (
                  <OrganizeCenter
                    contacts={contacts}
                    settings={currentProject}
                    onUpdateSettings={updateProjectSettings}
                    onUpdateContact={handleUpdateContact}
                    onProceedToDesign={() => setActiveStep('design')}
                    seniorMode={seniorMode}
                  />
                )}

                {/* Step 4: Design & Templates */}
                {activeStep === 'design' && (
                  <DesignStudio
                    settings={currentProject}
                    onUpdateSettings={updateProjectSettings}
                    onProceedToPreview={() => setActiveStep('preview')}
                    hasSensitiveNotes={contacts.some(c => c.isIncluded && c.notes)}
                    seniorMode={seniorMode}
                  />
                )}

                {/* Step 5: Live Preview */}
                {activeStep === 'preview' && (
                  <LivePreview
                    contacts={contacts}
                    settings={currentProject}
                    onUpdateSettings={updateProjectSettings}
                    onPrintNow={() => setActiveStep('print')}
                    onDownloadPdf={() => {
                      const doc = generateDirectoryPdf({ contacts, settings: currentProject });
                      doc.save(`${currentProject.name.replace(/\s+/g, '_')}.pdf`);
                    }}
                    onBackToDesign={() => setActiveStep('design')}
                    seniorMode={seniorMode}
                  />
                )}

                {/* Step 6: Print & Export */}
                {activeStep === 'print' && (
                  <ExportPrintCenter
                    contacts={contacts}
                    settings={currentProject}
                    onStartNewDirectory={() => {
                      setActiveStep('import');
                    }}
                    onClearAllData={handleClearAllLocalData}
                    seniorMode={seniorMode}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Edit/Add Contact Modal */}
      <EditContactModal
        contact={editContact}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditContact(null);
        }}
        onSave={handleSaveContactFromModal}
        seniorMode={seniorMode}
      />

      {/* Native Browser Print Document (Visible ONLY when printing) */}
      <div id="printable-directory-document" className="hidden print-only p-8 text-black bg-white">
        {/* Print Cover Page if enabled */}
        {currentProject.includeCover && (
          <div className="page-break flex flex-col justify-between h-[9.5in] border-2 border-black p-10 text-center">
            <div className="flex flex-col items-center">
              {currentProject.customLogoUrl ? (
                <img
                  src={currentProject.customLogoUrl}
                  alt="Logo"
                  className="w-20 h-20 object-contain mb-3"
                />
              ) : (
                <div className="text-xs uppercase tracking-widest font-bold">Pocket Directory</div>
              )}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold font-serif">{currentProject.coverTitle || 'Pocket Directory'}</h1>
              <p className="text-base text-gray-700">{currentProject.coverSubtitle || 'Local Business & Essential Contacts'}</p>
              {currentProject.ownerName && (
                <p className="text-sm italic font-serif text-gray-800">{currentProject.ownerName}</p>
              )}
            </div>
            <div className="border-t border-gray-400 pt-4 text-xs text-gray-600">
              Compiled on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} • {activeContactsList.length} Contacts
            </div>
          </div>
        )}

        {/* Directory Content Columns */}
        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-400 pb-2 mb-4 font-mono">
            <div className="flex items-center gap-2">
              {currentProject.customLogoUrl && (
                <img src={currentProject.customLogoUrl} alt="Logo" className="w-5 h-5 object-contain" />
              )}
              <span className="font-bold">{currentProject.customHeaderTitle || currentProject.name || 'Pocket Directory'}</span>
            </div>
            <span>{new Date().toLocaleDateString()}</span>
          </div>

          <div
            className={`grid gap-4 ${
              currentProject.columns === 3
                ? 'grid-cols-3'
                : currentProject.columns === 2
                ? 'grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {activeContactsList.map((contact) => (
              <div key={contact.id} className="avoid-break border-b border-gray-300 pb-2 text-xs">
                <div className="flex items-center gap-2">
                  {currentProject.fieldVisibility.photos && (
                    contact.photoUrl ? (
                      <img src={contact.photoUrl} alt="" className="w-7 h-7 rounded object-cover border border-gray-300" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-[10px]">
                        {(contact.displayName || 'C').slice(0, 2).toUpperCase()}
                      </div>
                    )
                  )}
                  <div>
                    <div className="font-bold text-sm text-black">{contact.displayName}</div>
                    {currentProject.fieldVisibility.tags && (contact.tags || contact.groups || []).length > 0 && (
                      <div className="text-[9px] font-semibold text-gray-600">
                        {(contact.tags || contact.groups || []).map(t => `[${t}]`).join(' ')}
                      </div>
                    )}
                  </div>
                </div>
                {currentProject.fieldVisibility.company && contact.company && (
                  <div className="font-semibold text-gray-800 mt-0.5">{contact.company}</div>
                )}
                {currentProject.fieldVisibility.jobTitle && contact.jobTitle && (
                  <div className="italic text-gray-600">{contact.jobTitle}</div>
                )}
                {currentProject.fieldVisibility.phones && contact.phones.length > 0 && (
                  <div className="font-mono pt-1 text-black">
                    {contact.phones.map(p => (
                      <div key={p.id}>{p.label ? `${p.label}: ` : ''}{p.number}</div>
                    ))}
                  </div>
                )}
                {currentProject.fieldVisibility.emails && contact.emails.length > 0 && (
                  <div className="text-gray-700 pt-0.5">
                    {contact.emails.map(e => (
                      <div key={e.id}>{e.email}</div>
                    ))}
                  </div>
                )}
                {currentProject.fieldVisibility.addresses && contact.addresses.length > 0 && (
                  <div className="text-gray-700 pt-0.5">
                    {contact.addresses.map(a => (
                      <div key={a.id}>
                        <div>{a.street}</div>
                        <div>{[a.city, a.state, a.postalCode].filter(Boolean).join(', ')}</div>
                      </div>
                    ))}
                  </div>
                )}
                {currentProject.fieldVisibility.notes && contact.notes && (
                  <div className="italic text-gray-600 text-[10px] pt-1">
                    Note: {contact.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
