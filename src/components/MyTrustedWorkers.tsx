import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookmarkCheck, 
  PhoneCall, 
  MessageSquare, 
  Trash2, 
  Plus, 
  ArrowRight
} from 'lucide-react';

export const MyTrustedWorkers: React.FC = () => {
  const { 
    workers, 
    trustedWorkerIds, 
    toggleSaveTrustedWorker, 
    setSelectedWorkerForRequest, 
    setSelectedWorkerForProfile,
    userProfile,
    setActiveView 
  } = useApp();

  const [notes, setNotes] = useState<Record<string, string>>({
    w1: 'Saved for flat washroom plumbing fixes.',
    w2: 'Fixed ceiling fan capacitor in 10 mins.'
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState<string>('');

  const savedWorkers = workers.filter(w => trustedWorkerIds.includes(w.id));

  const handleSaveNote = (workerId: string) => {
    setNotes(prev => ({ ...prev, [workerId]: tempNote }));
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-6 sm:p-8 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-slate-950 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
            <BookmarkCheck className="w-4 h-4 text-amber-400" />
            <span>Personal Local Rolodex</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            My Trusted Workers
          </h1>
          <p className="text-xs sm:text-sm text-slate-900 font-medium mt-0.5">
            Your saved local contact book for {userProfile.cityDistrict}. Never search from scratch again.
          </p>
        </div>

        <button
          onClick={() => setActiveView('discovery')}
          className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Contact</span>
        </button>
      </div>

      {/* Saved Workers Cards */}
      {savedWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedWorkers.map(worker => {
            const isEditing = editingNoteId === worker.id;
            const currentNote = notes[worker.id] || '';

            return (
              <div 
                key={worker.id} 
                className="bg-white rounded-3xl border border-amber-200/90 p-5 shadow-xs hover:shadow-md transition-all space-y-4 relative flex flex-col justify-between"
              >
                
                <div>
                  {/* Category & Status pill */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-extrabold bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {worker.serviceCategory.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{worker.availabilityStatus}</span>
                    </span>
                  </div>

                  {/* Worker Avatar & Details */}
                  <div className="flex items-center space-x-4 pt-3">
                    <img 
                      src={worker.avatar} 
                      alt={worker.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 cursor-pointer"
                      onClick={() => setSelectedWorkerForProfile(worker)}
                    />
                    <div>
                      <h3 
                        onClick={() => setSelectedWorkerForProfile(worker)}
                        className="font-bold text-slate-900 text-base hover:text-amber-600 cursor-pointer line-clamp-1"
                      >
                        {worker.name}
                      </h3>
                      <p className="text-xs text-slate-500">{worker.serviceName}</p>
                      
                      <div className="flex items-center space-x-3 text-xs mt-1 font-semibold text-slate-700">
                        <span className="text-amber-600">⭐ {worker.rating}</span>
                        <span>📍 {worker.distanceKm} km away</span>
                        <span className="text-slate-900">From ₹{worker.startingPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Note */}
                  <div className="mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
                      <span>Personal Note</span>
                      <button
                        onClick={() => {
                          if (isEditing) {
                            handleSaveNote(worker.id);
                          } else {
                            setEditingNoteId(worker.id);
                            setTempNote(currentNote);
                          }
                        }}
                        className="text-[11px] text-amber-700 hover:underline"
                      >
                        {isEditing ? 'Save' : 'Edit Note'}
                      </button>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={tempNote}
                        onChange={e => setTempNote(e.target.value)}
                        placeholder="Add personal note (e.g. knows flat wiring)..."
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    ) : (
                      <p className="text-slate-700 italic">
                        "{currentNote || 'No personal notes added yet.'}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleSaveTrustedWorker(worker.id)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs transition-colors"
                    title="Remove from Trusted"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <a
                    href={`tel:${worker.phone}`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Calling ${worker.name} at ${worker.phone}`);
                    }}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

                  <a
                    href={`https://wa.me/${worker.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`WhatsApping ${worker.name}`);
                    }}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setSelectedWorkerForRequest(worker)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl transition-all shadow-xs flex items-center justify-center space-x-1"
                  >
                    <span>Request Again</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
            📖
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg">Your contact book is empty</h3>
          <p className="text-xs text-slate-500">
            Save workers you use so you can rebook them instantly without searching.
          </p>
          <button
            onClick={() => setActiveView('discovery')}
            className="bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
          >
            Find Workers Near You
          </button>
        </div>
      )}

    </div>
  );
};
