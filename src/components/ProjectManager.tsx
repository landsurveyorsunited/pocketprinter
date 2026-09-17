import React, { useState } from 'react';
import { FolderKanban, Plus, Copy, Trash2, Check, FileDown, Upload, ArrowLeft } from 'lucide-react';
import { ProjectSettings } from '../types';
import { generateId } from '../utils/parsers';

interface ProjectManagerProps {
  projects: ProjectSettings[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string) => void;
  onDuplicateProject: (project: ProjectSettings) => void;
  onDeleteProject: (id: string) => void;
  onImportProjectJson: (project: ProjectSettings) => void;
  onBack: () => void;
  seniorMode: boolean;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onImportProjectJson,
  onBack,
  seniorMode,
}) => {
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    onCreateProject(newProjectName.trim());
    setNewProjectName('');
  };

  const handleExportJson = (project: ProjectSettings) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_project.json`);
    dlAnchor.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.name && parsed.templateId) {
            onImportProjectJson({
              ...parsed,
              id: 'proj_' + generateId(),
              name: `${parsed.name} (Restored)`,
              updatedAt: Date.now(),
            });
            alert('Project restored successfully!');
          } else {
            alert('Invalid project configuration file.');
          }
        } catch {
          alert('Could not parse project JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-xs text-[#087F8C] font-bold hover:underline mb-1 flex items-center gap-1"
        >
          ← Back to Directory
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#17212B] font-['Newsreader',serif]">
          Saved Directory Projects
        </h2>
        <p className="text-xs sm:text-sm text-[#55697D] mt-1">
          Manage different directory books (e.g. Family Address Book, Emergency Binder, Business Contacts).
        </p>
      </div>

      {/* Create new project card */}
      <div className="p-5 rounded-3xl neu-raised border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <label className="font-bold text-xs text-[#17212B] block mb-1">Create New Directory Project</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="e.g. Neighborhood Emergency Contacts"
              className="flex-1 px-3.5 py-2 rounded-xl neu-inset text-xs text-[#17212B] focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button
              onClick={handleCreate}
              className="neu-btn-teal px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Restore from JSON */}
        <div className="sm:border-l sm:border-[#D8E1E8] sm:pl-4">
          <label className="neu-btn px-3.5 py-2 rounded-xl text-xs font-semibold text-[#55697D] flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#087F8C]" />
            <span>Restore Project File</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((proj) => {
          const isActive = proj.id === activeProjectId;

          return (
            <div
              key={proj.id}
              className={`p-4 sm:p-5 rounded-2xl transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isActive
                  ? 'neu-raised border-[#087F8C]/40 ring-2 ring-[#087F8C]/30 bg-[#DDF3F2]/10'
                  : 'neu-btn border-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-[#087F8C] text-white shadow-sm' : 'neu-inset text-[#55697D]'}`}>
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-[#17212B]">{proj.name}</h4>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#087F8C] text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#55697D] mt-0.5">
                    Template: <span className="capitalize font-semibold">{proj.templateId}</span> • Format: <span className="uppercase font-semibold">{proj.pageSize}</span> • {proj.columns} Col
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {!isActive && (
                  <button
                    onClick={() => { onSelectProject(proj.id); onBack(); }}
                    className="neu-btn px-3 py-1.5 rounded-xl text-xs font-bold text-[#087F8C]"
                  >
                    Open
                  </button>
                )}

                <button
                  onClick={() => onDuplicateProject(proj)}
                  className="p-2 rounded-xl neu-btn text-xs text-[#55697D]"
                  title="Duplicate project"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleExportJson(proj)}
                  className="p-2 rounded-xl neu-btn text-xs text-[#55697D]"
                  title="Export project configuration JSON"
                >
                  <FileDown className="w-3.5 h-3.5" />
                </button>

                {projects.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete project "${proj.name}"?`)) {
                        onDeleteProject(proj.id);
                      }
                    }}
                    className="p-2 rounded-xl neu-btn text-xs text-[#B42318] hover:bg-red-50"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
