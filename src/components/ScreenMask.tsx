import React, { useState } from 'react';
import { EyeOff, ArrowLeft, Send, Check, BookOpen, FileText, GraduationCap } from 'lucide-react';

export type MaskType = 'classroom' | 'docs' | 'wikipedia';

interface ScreenMaskProps {
  isOpen: boolean;
  onClose: () => void;
  maskType?: MaskType;
}

export const ScreenMask: React.FC<ScreenMaskProps> = ({
  isOpen,
  onClose,
  maskType = 'classroom'
}) => {
  const [activeTab, setActiveTab] = useState<MaskType>(maskType);
  const [docNotes, setDocNotes] = useState(
    `AP Biology - Unit 4: Cellular Respiration & Metabolic Pathways\n\n1. Glycolysis:\n- Occurs in the cytoplasm (anaerobic, does not require O2).\n- 1 molecule of glucose (6C) is cleaved into 2 molecules of pyruvate (3C).\n- Net energy yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH.\n\n2. Krebs Cycle (Citric Acid Cycle):\n- Occurs in the mitochondrial matrix.\n- Pyruvate undergoes oxidative decarboxylation to form Acetyl-CoA.\n- Produces 2 ATP, 6 NADH, and 2 FADH2 per glucose molecule.\n\n3. Oxidative Phosphorylation & Electron Transport Chain:\n- Inner mitochondrial membrane (cristae).\n- Proton gradient across inner membrane powers ATP synthase.\n- Yields approximately 28 to 32 ATP per glucose molecule.`
  );
  const [privateComment, setPrivateComment] = useState('');
  const [submittedComment, setSubmittedComment] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white text-slate-900 select-text overflow-y-auto font-sans">
      {/* Discreet Escape Bar (Floating top-right with low opacity, turns visible on hover) */}
      <div className="fixed top-2 right-2 z-50 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs shadow-lg backdrop-blur">
        <span>Disguise Active (Press ESC or click)</span>
        <button
          onClick={onClose}
          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 rounded font-medium cursor-pointer"
        >
          Exit Mask
        </button>
      </div>

      {/* Mask 1: Google Classroom */}
      {activeTab === 'classroom' && (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
          {/* Classroom Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 p-1"
                title="Return"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#0f9d58] text-white flex items-center justify-center font-bold text-sm">
                  C
                </div>
                <div>
                  <h1 className="text-base font-semibold text-gray-800 leading-none">
                    AP Biology (Period 3) - Harrison
                  </h1>
                  <span className="text-xs text-gray-500">Assignment Details</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('docs')}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Switch to Google Docs
              </button>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                S
              </div>
            </div>
          </header>

          {/* Classroom Main Container */}
          <main className="max-w-4xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Assignment Info */}
            <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f9d58]/10 text-[#0f9d58] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-800">
                      Unit 4 Lab Report: Photosynthesis & Respiration Rates
                    </h2>
                    <div className="text-xs text-gray-500 mt-1">
                      Dr. Harrison · Oct 28 (Edited yesterday) · 100 points
                    </div>
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-600">
                  Due Tomorrow, 11:59 PM
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-700 space-y-3 leading-relaxed">
                <p>
                  Please submit your completed laboratory analysis including all data tables,
                  calculated rates of O2 consumption from yeast respirometers, and answer questions
                  1-8 on page 142 of the course laboratory manual.
                </p>
                <p>
                  Remember to cite all external peer-reviewed sources in APA format and attach your
                  spreadsheet or Google Docs file before turning in.
                </p>
              </div>

              {/* Attachments */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Class Materials
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <FileText className="w-6 h-6 text-red-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">
                        Lab_Protocol_Unit4.pdf
                      </div>
                      <div className="text-[11px] text-gray-500">PDF Document · 2.4 MB</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <FileText className="w-6 h-6 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">
                        Respiration_Data_Template
                      </div>
                      <div className="text-[11px] text-gray-500">Google Sheets · Shared</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Work Card */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-gray-800">Your work</h3>
                  <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded">
                    Assigned
                  </span>
                </div>

                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center text-xs text-gray-500 bg-gray-50">
                  + Add or create Google Doc
                </div>

                <button
                  onClick={() => alert('Assignment marked as turned in.')}
                  className="w-full mt-3 py-2 bg-[#0f9d58] hover:bg-[#0b8043] text-white font-medium text-xs rounded transition-colors"
                >
                  Turn in
                </button>
              </div>

              {/* Private Comments */}
              <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
                <h4 className="text-xs font-medium text-gray-800 mb-2">Private comments</h4>
                {submittedComment && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded mb-2">
                    {privateComment}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={privateComment}
                    onChange={(e) => setPrivateComment(e.target.value)}
                    placeholder="Add comment to Dr. Harrison..."
                    className="flex-1 text-xs border border-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#0f9d58]"
                  />
                  <button
                    onClick={() => {
                      if (privateComment.trim()) setSubmittedComment(true);
                    }}
                    className="p-2 text-[#0f9d58] hover:bg-green-50 rounded"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Mask 2: Google Docs */}
      {activeTab === 'docs' && (
        <div className="min-h-screen bg-[#f9fbfd] flex flex-col text-slate-800">
          {/* Docs Top Bar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#2684fc]" />
              <div>
                <input
                  type="text"
                  defaultValue="Biology Unit 4 Notes - Cellular Respiration"
                  className="font-medium text-gray-800 text-sm hover:border hover:border-gray-300 px-1 rounded focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                  <span className="hover:text-gray-800 cursor-pointer">File</span>
                  <span className="hover:text-gray-800 cursor-pointer">Edit</span>
                  <span className="hover:text-gray-800 cursor-pointer">View</span>
                  <span className="hover:text-gray-800 cursor-pointer">Insert</span>
                  <span className="hover:text-gray-800 cursor-pointer">Format</span>
                  <span className="hover:text-gray-800 cursor-pointer">Tools</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('classroom')}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                Switch to Classroom
              </button>
              <div className="px-3 py-1 bg-[#1a73e8] text-white rounded text-xs font-medium cursor-pointer">
                Share
              </div>
            </div>
          </div>

          {/* Interactive Document Page */}
          <div className="flex-1 max-w-3xl mx-auto w-full my-6 p-10 bg-white border border-gray-300 rounded shadow-sm min-h-[800px]">
            <textarea
              value={docNotes}
              onChange={(e) => setDocNotes(e.target.value)}
              className="w-full h-[700px] text-sm text-gray-800 font-serif leading-relaxed border-0 focus:outline-none resize-none bg-transparent"
            />
          </div>
        </div>
      )}

      {/* Mask 3: Wikipedia Article */}
      {activeTab === 'wikipedia' && (
        <div className="min-h-screen bg-white text-[#202122] font-serif max-w-5xl mx-auto p-6 md:p-10">
          <div className="border-b border-gray-300 pb-3 mb-6 flex justify-between items-center font-sans">
            <div>
              <h1 className="text-3xl font-serif font-normal">Cellular respiration</h1>
              <div className="text-xs text-gray-500 mt-1">From Wikipedia, the free encyclopedia</div>
            </div>
            <button
              onClick={() => setActiveTab('classroom')}
              className="text-xs text-blue-600 hover:underline"
            >
              Switch to Classroom
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 text-sm leading-relaxed space-y-4">
              <p>
                <strong>Cellular respiration</strong> is the set of metabolic reactions and processes that
                take place in the cells of organisms to convert biochemical energy from nutrients into
                adenosine triphosphate (ATP), and then release waste products.
              </p>
              <p>
                The catabolic reactions involved in respiration include glycolysis, the citric acid
                cycle, and oxidative phosphorylation. Nutrients commonly used by animal and plant cells
                in respiration include glucose, amino acids and fatty acids, and the most common
                oxidizing agent is molecular oxygen (O2).
              </p>
              <h2 className="text-xl font-sans font-semibold border-b border-gray-300 pb-1 pt-4">
                Aerobic respiration
              </h2>
              <p>
                Aerobic respiration requires oxygen (O2) in order to create ATP. Although carbohydrates,
                fats, and proteins are consumed as reactants, aerobic respiration is the preferred method
                of pyruvate breakdown in glycolysis, and requires pyruvate to the mitochondria in order
                to be fully oxidized by the citric acid cycle.
              </p>
            </div>

            <div className="border border-gray-300 bg-[#f8f9fa] p-4 text-xs font-sans rounded">
              <div className="font-bold text-center text-sm border-b border-gray-300 pb-2 mb-3">
                Cellular Respiration
              </div>
              <div className="space-y-2">
                <div><strong>Inputs:</strong> Glucose, Oxygen</div>
                <div><strong>Outputs:</strong> Carbon dioxide, Water, ATP</div>
                <div><strong>Site:</strong> Cytoplasm, Mitochondria</div>
                <div><strong>ATP Yield:</strong> ~30–32 ATP per glucose</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
