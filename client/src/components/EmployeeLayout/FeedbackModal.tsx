import { MessageSquare, X } from "lucide-react";

interface Feedback {
  kraTitle: string;
  kpiTitle: string;
  feedback: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: string;
  feedbacks: Feedback[];
}

export default function FeedbackModal({ isOpen, onClose, cycle, feedbacks }: FeedbackModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] sm:max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Manager Feedback</h3>
              <p className="text-purple-200 text-sm mt-0.5">{cycle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          {/* Feedback count badge */}
          <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              {feedbacks.length} {feedbacks.length === 1 ? "feedback" : "feedbacks"}
            </span>
          </div>
        </div>

        {/* Feedback List */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[55vh] space-y-3 sm:space-y-4">
          {feedbacks.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 hover:border-purple-200 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                      {item.kraTitle}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-2">{item.kpiTitle}</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-purple-400">
                    "{item.feedback}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </div>
  );
}
