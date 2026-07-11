import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  File,
  Search,
  Upload,
  Download,
  Trash2,
  FolderPlus,
  ChevronRight,
  HardDrive,
  FileText,
  Clock,
  LayoutGrid,
  List,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { ResourceFolder, ResourceFile, Course } from '../types';

interface ResourcesProps {
  folders: ResourceFolder[];
  files: ResourceFile[];
  onAddFile: (file: ResourceFile) => void;
  onDeleteFile: (id: string) => void;
  courses: Course[];
  activeCourseId?: string | null;
  setActiveCourseId?: (id: string | null) => void;
}

export default function Resources({
  folders,
  files,
  onAddFile,
  onDeleteFile,
  courses,
  activeCourseId,
  setActiveCourseId
}: ResourcesProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter files by folder, active course context, and search
  const filteredFiles = files.filter((file) => {
    const matchesFolder = selectedFolderId === null || file.folderId === selectedFolderId;
    
    let matchesCourse = true;
    if (activeCourseId) {
      const activeCourseObj = courses.find(c => c.id === activeCourseId);
      if (activeCourseObj) {
        matchesCourse = file.name.toUpperCase().includes(activeCourseObj.code.toUpperCase());
      }
    }

    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesCourse && matchesSearch;
  });

  const selectedFolderObj = folders.find(f => f.id === selectedFolderId);

  // File Upload Handlers (Supports file selection & drag-and-drop as requested!)
  const handleUploadNewFile = (fileName: string, fileSize: string, fileType: string) => {
    const newFileObj: ResourceFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      folderId: selectedFolderId || folders[0].id,
      size: fileSize,
      type: fileType as any,
      uploadedBy: 'Alex Rivera',
      uploadedAt: new Date().toISOString().split('T')[0],
      downloads: 0
    };

    onAddFile(newFileObj);
    triggerToast(`"${fileName}" uploaded successfully!`);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      const ext = file.name.split('.').pop() || 'pdf';
      handleUploadNewFile(file.name, sizeStr, ext);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      const ext = file.name.split('.').pop() || 'pdf';
      handleUploadNewFile(file.name, sizeStr, ext);
    }
  };

  // Storage Stats Calculator
  const totalStorageAllocated = 5.0; // GB
  const usedStorageBytes = files.reduce((acc, f) => {
    const size = f.size.split(' ');
    const num = parseFloat(size[0]);
    const unit = size[1];
    if (unit === 'GB') return acc + num * 1024 * 1024 * 1024;
    if (unit === 'MB') return acc + num * 1024 * 1024;
    return acc + num * 1024;
  }, 0);

  const usedStorageGB = parseFloat((usedStorageBytes / (1024 * 1024 * 1024)).toFixed(2)) + 0.94; // Adding base OS space
  const storagePercent = Math.round((usedStorageGB / totalStorageAllocated) * 100);

  const handleSimulateDownload = (fileName: string) => {
    triggerToast(`Downloading "${fileName}"...`);
  };

  return (
    <div
      className="space-y-6 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-text-primary text-white text-xs px-4 py-3 rounded-custom-md shadow-custom-modal flex items-center gap-2 border border-white/10"
          >
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-brand-primary/10 backdrop-blur-xs border-4 border-dashed border-brand-primary flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-bg-surface dark:bg-gray-900 px-6 py-8 rounded-custom-lg shadow-custom-modal flex flex-col items-center gap-3">
            <Upload className="h-10 w-10 text-brand-primary animate-bounce" />
            <p className="text-sm font-bold text-text-primary dark:text-gray-200">
              Drop file here to upload!
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-text-primary dark:text-gray-100">
            Resource Library
          </h1>
          <p className="text-xs md:text-sm text-text-muted dark:text-gray-400 font-sans">
            Access lecture syllabus sheets, slide presentations, labs, and reference textbooks.
          </p>
        </div>

        {/* Upload Action */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-xs font-bold bg-brand-primary hover:bg-brand-hover text-white rounded-custom-md cursor-pointer transition-all inline-flex items-center gap-1.5 shadow-custom-card"
          >
            <Upload className="h-4 w-4" /> Upload File
          </button>
        </div>
      </div>

      {/* Course Focus Selector Bar */}
      <div className="p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-custom-card">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-brand-light dark:bg-blue-950/40 text-brand-primary dark:text-blue-400 rounded-custom-md flex items-center justify-center border border-brand-primary/10">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans leading-none">
              Course Focus Context
            </h3>
            <p className="text-xs font-extrabold text-text-primary dark:text-gray-200 mt-1">
              {activeCourseId && courses.find(c => c.id === activeCourseId)
                ? `${courses.find(c => c.id === activeCourseId)?.code}: ${courses.find(c => c.id === activeCourseId)?.name}`
                : 'All Enrolled Courses'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="course-context-select-res" className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-sans shrink-0">
            Focus:
          </label>
          <select
            id="course-context-select-res"
            value={activeCourseId || 'all'}
            onChange={(e) => {
              if (setActiveCourseId) {
                setActiveCourseId(e.target.value === 'all' ? null : e.target.value);
              }
            }}
            className="text-xs font-bold text-text-primary dark:text-gray-300 bg-bg-primary dark:bg-gray-850 border border-border-custom dark:border-gray-800 px-3 py-1.5 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 cursor-pointer"
          >
            <option value="all">📚 All Enrolled Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
          {activeCourseId && (
            <button
              onClick={() => {
                if (setActiveCourseId) {
                  setActiveCourseId(null);
                }
              }}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 rounded-custom-md border border-red-200/50 cursor-pointer transition-colors"
            >
              Clear Focus
            </button>
          )}
        </div>
      </div>

      {/* Library Breadcrumb bar & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card">
        {/* Breadcrumb path navigation */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
          <button
            onClick={() => setSelectedFolderId(null)}
            className="hover:text-brand-primary cursor-pointer transition-colors"
          >
            Library Root
          </button>
          {selectedFolderId && (
            <>
              <ChevronRight className="h-3 w-3 text-text-muted" />
              <span className="text-text-primary dark:text-gray-200 font-bold">
                {selectedFolderObj?.name}
              </span>
            </>
          )}
        </div>

        {/* Search & Layout Views */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-bg-primary dark:bg-gray-855 border border-border-custom dark:border-gray-800 rounded-custom-md focus:outline-none focus:ring-2 focus:ring-brand-primary/25 transition-all font-sans w-48 md:w-56 text-text-primary"
            />
          </div>

          <div className="flex items-center border border-border-custom dark:border-gray-800 rounded-custom-md p-1 bg-bg-primary dark:bg-gray-900/40">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-custom-sm cursor-pointer ${viewMode === 'grid' ? 'bg-bg-surface dark:bg-[#111827] text-brand-primary shadow-sm' : 'text-text-muted'}`}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-custom-sm cursor-pointer ${viewMode === 'list' ? 'bg-bg-surface dark:bg-[#111827] text-brand-primary shadow-sm' : 'text-text-muted'}`}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main split grid: Folders & Storage Stats */}
      {selectedFolderId === null && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Folder catalog items (Left 3 Columns) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-sans">
              Resource Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg hover:border-brand-primary/40 hover:shadow-custom-card cursor-pointer hover-lift transition-all group flex items-start gap-4 shadow-custom-card"
                >
                  <div className="h-12 w-12 bg-brand-light dark:bg-blue-950/40 text-brand-primary dark:text-blue-400 rounded-custom-md flex items-center justify-center border border-brand-primary/10 group-hover:scale-105 transition-transform">
                    <Folder className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-xs font-bold text-text-primary dark:text-gray-200 truncate font-display">
                      {folder.name}
                    </h4>
                    <p className="text-[10px] text-text-muted font-sans">
                      {folder.filesCount} Documents • {folder.size} Used
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hard Drive Storage stats */}
          <div className="p-5 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card space-y-4 self-start">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-bg-primary dark:bg-gray-850 text-text-secondary border border-border-custom rounded-custom-md flex items-center justify-center">
                <HardDrive className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-text-primary dark:text-gray-200">
                  Drive Storage
                </h4>
                <p className="text-[9px] text-text-muted font-sans">
                  Shared student cloud space
                </p>
              </div>
            </div>

            {/* Storage Progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-medium font-sans text-text-muted">
                <span>{usedStorageGB.toFixed(2)} GB of {totalStorageAllocated.toFixed(1)} GB</span>
                <span className="font-bold text-text-primary dark:text-gray-300">{storagePercent}%</span>
              </div>
              <div className="w-full bg-bg-primary dark:bg-gray-800 h-2 rounded-full overflow-hidden border border-border-custom">
                <div
                  className="bg-brand-primary h-full rounded-full transition-all"
                  style={{ width: `${storagePercent}%` }}
                ></div>
              </div>
            </div>

            <p className="text-[10px] text-text-muted leading-normal font-sans pt-1">
              Need more cloud space? Send an application to your CSE Administrator or clear older past exam worksheets.
            </p>
          </div>

        </div>
      )}

      {/* Files Display Area (Filterable) */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider font-sans">
          {selectedFolderId === null ? 'Recent Library Files' : `${selectedFolderObj?.name} Files`}
        </h3>

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card">
            <FileText className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-muted font-sans">No documents found matching search or directory filters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View of files */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="p-4 bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg shadow-custom-card hover:shadow-md hover-lift transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 bg-brand-light dark:bg-blue-950/40 text-brand-primary rounded-custom-md flex items-center justify-center shrink-0 border border-brand-primary/10">
                    <File className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="text-xs font-bold text-text-primary dark:text-gray-200 line-clamp-2 leading-snug cursor-pointer hover:text-brand-primary transition-colors font-sans"
                      title={file.name}
                    >
                      {file.name}
                    </h4>
                    <p className="text-[9px] text-text-muted font-sans mt-0.5">
                      {file.size} • {file.type.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-divider-custom dark:border-gray-850 flex items-center justify-between text-[10px]">
                  <span className="text-text-muted font-sans font-medium">
                    By {file.uploadedBy.split(' ')[0]}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteFile(file.id)}
                      className="p-1 text-text-muted hover:text-danger rounded cursor-pointer transition-colors"
                      title="Delete file"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleSimulateDownload(file.name)}
                      className="p-1 text-brand-primary dark:text-blue-400 hover:bg-brand-light dark:hover:bg-blue-950 rounded cursor-pointer transition-all"
                      title="Download file"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View of files (Standard Table) */
          <div className="bg-bg-surface dark:bg-[#111827] border border-border-custom dark:border-gray-800 rounded-custom-lg overflow-hidden shadow-custom-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg-primary dark:bg-gray-855/10 border-b border-border-custom dark:border-gray-800 font-bold text-text-muted font-mono uppercase tracking-wider text-[10px]">
                    <th className="p-4">File Name</th>
                    <th className="p-4">File Type</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider-custom dark:divide-gray-800/80 font-sans text-text-secondary dark:text-gray-300">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-bg-primary/40 dark:hover:bg-gray-850/10 transition-colors">
                      <td className="p-4 font-bold text-text-primary dark:text-gray-200">
                        <div className="flex items-center gap-2.5">
                          <File className="h-3.5 w-3.5 text-brand-primary" />
                          <span className="truncate max-w-64" title={file.name}>{file.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold uppercase font-mono text-text-muted">{file.type}</td>
                      <td className="p-4 font-mono text-text-muted">{file.size}</td>
                      <td className="p-4 text-text-muted font-medium">{file.uploadedBy}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onDeleteFile(file.id)}
                            className="p-1.5 text-text-muted hover:text-danger rounded cursor-pointer transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleSimulateDownload(file.name)}
                            className="p-1.5 text-brand-primary dark:text-blue-400 hover:bg-brand-light dark:hover:bg-blue-950 rounded cursor-pointer transition-colors"
                            title="Download"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
