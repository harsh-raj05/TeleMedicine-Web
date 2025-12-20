import { X, Calendar, User, FileText, Pill } from "lucide-react";

function PatientHistoryModal({ isOpen, onClose, history, patient }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fadeIn">

                {/* Header */}
                <div className="bg-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <FileText size={24} />
                            Medical History
                        </h2>
                        <p className="text-blue-100 mt-1">
                            Patient: <span className="font-semibold">{patient?.name}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-blue-700 rounded-full transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {history.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <FileText size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No past medical records found.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {history.map((record, index) => (
                                <div key={record._id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                                    {/* Side Color Bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>

                                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4 border-b border-gray-100 pb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                                <p className="text-sm text-gray-500">{record.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                                            <User size={16} className="text-gray-500" />
                                            <span className="text-gray-700 font-medium">Dr. {record.doctor?.name}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Diagnosis */}
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Diagnosis</h4>
                                            <p className="text-gray-800 font-medium">
                                                {record.prescription?.diagnosis || "No diagnosis provided"}
                                            </p>
                                        </div>

                                        {/* Symptoms */}
                                        {record.prescription?.symptoms && (
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Symptoms</h4>
                                                <p className="text-gray-600 text-sm">{record.prescription.symptoms}</p>
                                            </div>
                                        )}

                                        {/* Medicines */}
                                        {record.prescription?.medicines && (
                                            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                                                <Pill size={20} className="text-blue-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-800 mb-1">Prescribed Medicines</h4>
                                                    <p className="text-blue-700 text-sm whitespace-pre-line">{record.prescription.medicines}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientHistoryModal;
