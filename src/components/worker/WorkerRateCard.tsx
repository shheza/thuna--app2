import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Check, 
  AlertTriangle, 
  Percent, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { PriceItem } from '../../types';

export const WorkerRateCard: React.FC = () => {
  const { getActiveWorker, updateWorkerProfile } = useApp();
  const worker = getActiveWorker();

  const [basePrice, setBasePrice] = useState<number>(worker.startingPrice || 200);
  const [priceList, setPriceList] = useState<PriceItem[]>(
    worker.priceList && worker.priceList.length > 0
      ? worker.priceList
      : [
          { item: 'Standard Inspection & Diagnostic Visit', price: 150 },
          { item: 'Minor Repair & Part Installation', price: 250 },
          { item: 'Major Overhaul & Heavy Replacement', price: 500 }
        ]
  );

  const [isEmergencyEnabled, setIsEmergencyEnabled] = useState<boolean>(worker.isEmergencyAvailable ?? true);
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Category specific quick-preset suggestions
  const presetsByCategory: Record<string, { item: string; price: number }[]> = {
    plumbing: [
      { item: 'Tap Washer & Spindle Replacement', price: 200 },
      { item: 'Flush Tank Mechanism Repair', price: 350 },
      { item: 'Kitchen Sink Drain Blockage Clearing', price: 300 },
      { item: 'Water Heater / Geyser Valve Connection', price: 400 }
    ],
    electrical: [
      { item: 'Switchboard & Socket Replacement', price: 200 },
      { item: 'MCB Trip & Short Circuit Diagnostic', price: 350 },
      { item: 'Ceiling Fan / Light Fixture Assembly', price: 250 },
      { item: 'Inverter Wiring & Battery Line Check', price: 450 }
    ],
    locksmith: [
      { item: 'Apartment Door Emergency Unlock (Lost Key)', price: 400 },
      { item: 'Godrej / Mortise Lock Replacement', price: 550 },
      { item: 'Padlock / Cabinet Key Extraction', price: 250 },
      { item: 'Main Door Deadbolt Installation', price: 600 }
    ],
    ac_appliance: [
      { item: 'AC Filter Clean & Cooling Diagnostic', price: 450 },
      { item: 'Washing Machine Drum / Drain Motor Check', price: 500 },
      { item: 'Refrigerator Gas Leakage & Coil Inspection', price: 550 },
      { item: 'Microwave Oven PCB & Heating Repair', price: 600 }
    ]
  };

  const currentPresets = presetsByCategory[worker.serviceCategory] || [
    { item: 'Initial Diagnosis & Problem Evaluation', price: 200 },
    { item: 'Standard Repair Service Call', price: 400 },
    { item: 'Full Overhaul / Heavy Labor', price: 750 }
  ];

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemPrice.trim()) return;

    const priceNum = parseInt(newItemPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price in ₹.');
      return;
    }

    setPriceList([...priceList, { item: newItemTitle.trim(), price: priceNum }]);
    setNewItemTitle('');
    setNewItemPrice('');
  };

  const handleAddPreset = (preset: { item: string; price: number }) => {
    if (priceList.some(p => p.item.toLowerCase() === preset.item.toLowerCase())) {
      return;
    }
    setPriceList([...priceList, preset]);
  };

  const handleDeleteItem = (index: number) => {
    setPriceList(priceList.filter((_, i) => i !== index));
  };

  const handleUpdatePrice = (index: number, newP: number) => {
    if (newP < 0) return;
    const copy = [...priceList];
    copy[index].price = newP;
    setPriceList(copy);
  };

  const handleSaveRateCard = () => {
    updateWorkerProfile(worker.id, {
      startingPrice: basePrice,
      priceList: priceList,
      isEmergencyAvailable: isEmergencyEnabled
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-400/20 text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-md border border-emerald-400/30">
                Transparent Pricing
              </span>
              <span className="text-amber-400 text-xs font-bold flex items-center space-x-1">
                <Percent className="w-3.5 h-3.5" />
                <span>0% Middleman Deduction</span>
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1.5 flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-emerald-400" />
              <span>Manage Your Rate Card</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Set your minimum visitation charge and standardized repair rates. Residents see these prices up front, eliminating bargaining hassles.
            </p>
          </div>

          <button
            onClick={handleSaveRateCard}
            className="self-start md:self-auto px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>Rate Card Saved!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Save Rate Card</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Base Visitation Charge Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Primary Standard Fee
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              Base Visitation & Inspection Fee
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md">
              Minimum charge for traveling to the resident's flat/hostel and conducting diagnostic checks.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setBasePrice(Math.max(50, basePrice - 50))}
              className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors text-base"
            >
              -
            </button>
            <div className="text-center px-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting Rate</span>
              <span className="text-2xl font-black text-emerald-600">₹{basePrice}</span>
            </div>
            <button
              type="button"
              onClick={() => setBasePrice(basePrice + 50)}
              className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors text-base"
            >
              +
            </button>
          </div>
        </div>

        {/* 0% Commission Reminder Box */}
        <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">100% Direct Payout to You:</span>
            <span>Thuna takes ₹0 commission. Whatever you set here is collected directly by you via cash or Google Pay / PhonePe from the resident.</span>
          </div>
        </div>
      </div>

      {/* Emergency Surcharge Settings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-red-600 uppercase tracking-wider bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
              🚨 Express Dispatch
            </span>
            <span className="text-xs font-bold text-slate-500">Night & Emergency Calls</span>
          </div>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Accept Emergency SOS Requests (+ ₹100 Surcharge)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 max-w-lg">
            Receive live audio alerts for tap bursts, lockouts, or electrical failures. Emergency bookings automatically include a ₹100 express dispatch bonus.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEmergencyEnabled(!isEmergencyEnabled)}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center space-x-2 transition-all self-start sm:self-auto ${
            isEmergencyEnabled 
              ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isEmergencyEnabled ? 'Emergency SOS Enabled' : 'Disabled'}</span>
        </button>
      </div>

      {/* Itemized Service Price List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Tag className="w-5 h-5 text-emerald-500" />
              <span>Standard Service Offerings ({priceList.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific repair tasks and their transparent fixed or starting charges.
            </p>
          </div>
        </div>

        {/* Existing Price Items Table */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {priceList.map((p, idx) => (
            <div key={idx} className="p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-extrabold text-sm text-slate-900">{p.item}</span>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-auto">
                <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-xl px-2.5 py-1">
                  <span className="text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handleUpdatePrice(idx, parseInt(e.target.value, 10) || 0)}
                    className="w-16 text-xs font-black text-slate-900 focus:outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(idx)}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Custom Service Form */}
        <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            Add New Service Item:
          </span>
          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="e.g. Geyser Element Replacement"
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <div className="w-full sm:w-32 relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="Rate"
                className="w-full pl-7 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
              />
            </div>
            <button
              type="submit"
              disabled={!newItemTitle.trim() || !newItemPrice.trim()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </form>
        </div>

        {/* Quick Trade Presets */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Suggested Presets for {worker.serviceName}:
          </span>
          <div className="flex flex-wrap gap-2">
            {currentPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="inline-flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>{preset.item} (₹{preset.price})</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
