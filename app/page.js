'use client';

import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const [takenMedicines, setTakenMedicines] = useState(new Set());
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);
  const [workoutInterval, setWorkoutInterval] = useState(null);
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    countryCode: '+1', 
    phone: '', 
    message: '' 
  });
  const [formStatus, setFormStatus] = useState(null);
  
  // EmailJS Configuration - Using environment variables for security
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_on2z4xq';
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_wnxvmeu';
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'IzMguHqudD9xLZKjr';
  
  // Country codes for phone number dropdown
  const countryCodes = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' }
  ];
  
  // Medicine database with ACCURATE pharmaceutical information (color AND shape)
  const medicineDatabase = {
    'aspirin': { emoji: '🟠', color: 'orange', shape: 'round', commonDosage: '81mg' },
    'metformin': { emoji: '🥚', color: 'white', shape: 'oblong', commonDosage: '500mg' },
    'lisinopril': { emoji: '⚪', color: 'white', shape: 'round', commonDosage: '10mg' },
    'atorvastatin': { emoji: '🥚', color: 'white', shape: 'oblong', commonDosage: '20mg' },
    'omeprazole': { emoji: '🟣', color: 'purple', shape: 'round', commonDosage: '20mg' },
    'calcium carbonate': { emoji: '⚪', color: 'white', shape: 'round', commonDosage: '600mg' },
    'ibuprofen': { emoji: '🟤', color: 'brown', shape: 'round', commonDosage: '200mg' },
    'acetaminophen': { emoji: '🥚', color: 'white', shape: 'oblong', commonDosage: '500mg' },
    'amoxicillin': { emoji: '🔴', color: 'red', shape: 'capsule', commonDosage: '500mg' },
    'simvastatin': { emoji: '🔴', color: 'red', shape: 'round', commonDosage: '20mg' },
    'amlodipine': { emoji: '⚪', color: 'white', shape: 'round', commonDosage: '5mg' },
    'losartan': { emoji: '🟢', color: 'green', shape: 'oblong', commonDosage: '50mg' },
    'hydrochlorothiazide': { emoji: '🟠', color: 'orange', shape: 'round', commonDosage: '25mg' },
    'prednisone': { emoji: '⚪', color: 'white', shape: 'round', commonDosage: '5mg' },
    'warfarin': { emoji: '⚪', color: 'white', shape: 'round', commonDosage: '5mg' }
  };

  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Aspirin', emoji: '🟠', color: 'orange', shape: 'round', time: 'Morning', taken: false, dosage: '81mg' },
    { id: 2, name: 'Metformin', emoji: '🥚', color: 'white', shape: 'oblong', time: 'Morning', taken: false, dosage: '500mg' },
    { id: 3, name: 'Lisinopril', emoji: '⚪', color: 'white', shape: 'round', time: 'Morning', taken: false, dosage: '10mg' },
    { id: 4, name: 'Atorvastatin', emoji: '🥚', color: 'white', shape: 'oblong', time: 'Evening', taken: false, dosage: '20mg' },
    { id: 5, name: 'Omeprazole', emoji: '🟣', color: 'purple', shape: 'round', time: 'Morning', taken: false, dosage: '20mg' },
    { id: 6, name: 'Calcium Carbonate', emoji: '⚪', color: 'white', shape: 'round', time: 'Evening', taken: false, dosage: '600mg' }
  ]);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: '', emoji: '⚪', color: 'white', shape: 'round', time: 'Morning', dosage: '' });
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ medicine: '', time: '', message: '' });
  const [showPartnerships, setShowPartnerships] = useState(false);
  const [showInteractiveDemo, setShowInteractiveDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [demoMedicines, setDemoMedicines] = useState([
    { id: 1, name: 'Aspirin', emoji: '🟠', color: 'orange', shape: 'round', time: 'Morning', taken: false, dosage: '81mg' },
    { id: 2, name: 'Metformin', emoji: '🥚', color: 'white', shape: 'oblong', time: 'Morning', taken: false, dosage: '500mg' },
    { id: 3, name: 'Lisinopril', emoji: '⚪', color: 'white', shape: 'round', time: 'Evening', taken: false, dosage: '10mg' }
  ]);
  const [demoTime, setDemoTime] = useState(0);
  const [isDemoWorkoutRunning, setIsDemoWorkoutRunning] = useState(false);
  const [demoWorkoutInterval, setDemoWorkoutInterval] = useState(null);

  const handleMedicineTaken = (id) => {
    setMedicines(prev => prev.map(medicine => 
      medicine.id === id 
        ? { ...medicine, taken: !medicine.taken }
        : medicine
    ));
  };

  const handleAddMedicine = () => {
    if (newMedicine.name.trim()) {
      const medicineName = newMedicine.name.toLowerCase().trim();
      const medicineInfo = medicineDatabase[medicineName];
      
      if (medicineInfo) {
        const medicine = {
          name: newMedicine.name,
          emoji: medicineInfo.emoji,
          color: medicineInfo.color,
          shape: medicineInfo.shape,
          dosage: medicineInfo.commonDosage,
          time: newMedicine.time,
          id: Date.now(),
          taken: false
        };
        setMedicines(prev => [...prev, medicine]);
        setNewMedicine({ name: '', emoji: '💊', color: 'white', shape: 'round', time: 'Morning', dosage: '' });
        setShowAddMedicine(false);
      } else {
        alert('Medicine not found in database. Please check the spelling or try a different medicine name.');
      }
    }
  };

  const handleNewMedicineChange = (field, value) => {
    setNewMedicine(prev => ({ ...prev, [field]: value }));
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleAddCustomReminder = () => {
    setShowAddReminder(true);
  };

  const handleReminderChange = (field, value) => {
    setNewReminder(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitReminder = () => {
    if (newReminder.medicine && newReminder.time) {
      alert(`Custom reminder added for ${newReminder.medicine} at ${newReminder.time}!`);
      setNewReminder({ medicine: '', time: '', message: '' });
      setShowAddReminder(false);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handleLearnPartnerships = () => {
    setShowPartnerships(true);
  };

  const handleTryDemo = () => {
    setShowInteractiveDemo(true);
    setDemoStep(0);
    setDemoTime(0);
    setIsDemoWorkoutRunning(false);
  };

  const handleFeatureDemo = (featureIndex) => {
    setActiveModal(featureIndex);
  };

  const handleDemoMedicineTaken = (id) => {
    setDemoMedicines(prev => prev.map(medicine => 
      medicine.id === id 
        ? { ...medicine, taken: !medicine.taken }
        : medicine
    ));
  };

  const nextDemoStep = () => {
    if (demoStep < 4) {
      setDemoStep(prev => prev + 1);
    } else {
      setShowInteractiveDemo(false);
      setDemoStep(0);
    }
  };

  const startDemoWorkout = () => {
    setIsDemoWorkoutRunning(true);
    const interval = setInterval(() => {
      setDemoTime(prev => prev + 1);
    }, 1000);
    // Store interval ID for stopping
    setDemoWorkoutInterval(interval);
  };

  const stopDemoWorkout = () => {
    if (demoWorkoutInterval) {
      clearInterval(demoWorkoutInterval);
      setDemoWorkoutInterval(null);
    }
    setIsDemoWorkoutRunning(false);
    setDemoTime(0);
  };

  const formatDemoTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setIsWorkoutRunning(true);
    const interval = setInterval(() => {
      setWorkoutTime(prev => prev + 1);
    }, 1000);
    setWorkoutInterval(interval);
  };

  const pauseWorkout = () => {
    setIsWorkoutRunning(false);
    if (workoutInterval) {
      clearInterval(workoutInterval);
      setWorkoutInterval(null);
    }
  };

  const stopWorkout = () => {
    setIsWorkoutRunning(false);
    if (workoutInterval) {
      clearInterval(workoutInterval);
      setWorkoutInterval(null);
    }
    setWorkoutTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContactFormChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: contactForm.name,
        from_email: contactForm.email,
        phone_number: `${contactForm.countryCode} ${contactForm.phone}`,
        message: contactForm.message,
        to_email: 'contact@smartdose.app' // Your new email address
      };

      // Send email using EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setFormStatus('sent');
      setContactForm({ 
        name: '', 
        email: '', 
        countryCode: '+1', 
        phone: '', 
        message: '' 
      });
    } catch (error) {
      console.error('EmailJS Error:', error);
      setFormStatus('error');
    }
  };

  const MedicineCardsDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Medicine Cards Demo</h3>
        <p className="text-gray-600">Visual medicine management with real medications, colors, shapes, and emojis</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map(medicine => (
          <div key={medicine.id} className={`p-4 rounded-lg border-2 transition-all duration-300 ${
            medicine.taken 
              ? 'bg-green-50 border-green-300 shadow-lg' 
              : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                medicine.emoji === '🟠' ? 'bg-orange-100' :
                medicine.emoji === '⚪' ? 'bg-white border-2 border-gray-300' :
                medicine.emoji === '🩷' ? 'bg-pink-100' :
                medicine.emoji === '🟣' ? 'bg-purple-100' :
                medicine.emoji === '🦴' ? 'bg-yellow-100' :
                medicine.emoji === '🟤' ? 'bg-amber-100' :
                medicine.emoji === '🟢' ? 'bg-green-100' :
                medicine.color === 'orange' ? 'bg-orange-100' :
                medicine.color === 'pink' ? 'bg-pink-100' :
                medicine.color === 'white' ? 'bg-white border-2 border-gray-300' :
                medicine.color === 'brown' ? 'bg-amber-100' :
                medicine.color === 'green' ? 'bg-green-100' :
                medicine.color === 'purple' ? 'bg-purple-100' :
                medicine.color === 'blue' ? 'bg-blue-100' :
                medicine.color === 'red' ? 'bg-red-100' :
                medicine.color === 'gray' ? 'bg-gray-200' :
                'bg-gray-100'
              }`}>
                {medicine.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg text-gray-800">{medicine.name}</h4>
                <p className="text-sm text-gray-600">Time: {medicine.time}</p>
                <p className="text-sm text-gray-600">Shape: {medicine.shape}</p>
                <p className="text-sm text-gray-600">Dosage: {medicine.dosage}</p>
                {medicine.taken && (
                  <div className="flex items-center gap-1 text-green-600 mt-2">
                    <span>✅</span>
                    <span className="text-sm font-medium">Taken</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleMedicineTaken(medicine.id)}
              className={`w-full mt-3 px-4 py-2 rounded-lg transition-colors font-semibold ${
                medicine.taken
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {medicine.taken ? 'Mark as Not Taken ❌' : 'Mark as Taken ✅'}
            </button>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button 
          onClick={() => setShowAddMedicine(!showAddMedicine)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
        >
          {showAddMedicine ? 'Cancel' : '+ Add New Medicine'}
        </button>
      </div>

      {showAddMedicine && (
        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
          <h4 className="text-lg font-semibold mb-4 text-center">Add New Medicine</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name</label>
              <input
                type="text"
                value={newMedicine.name}
                onChange={(e) => handleNewMedicineChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Ibuprofen, Aspirin, Metformin"
              />
              <p className="text-xs text-gray-500 mt-1">Available: Aspirin, Metformin, Lisinopril, Atorvastatin, Omeprazole, Calcium Carbonate, Ibuprofen, Acetaminophen, Amoxicillin, Simvastatin, Amlodipine, Losartan, Hydrochlorothiazide, Prednisone, Warfarin</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Time to Take</label>
              <select
                value={newMedicine.time}
                onChange={(e) => handleNewMedicineChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddMedicine}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            >
              Add Medicine
            </button>
            <button
              onClick={() => setShowAddMedicine(false)}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const MedicineGuideDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Medicine Guide Demo</h3>
        <p className="text-gray-600">Visual explanations with real medication information and detailed guidance</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicines.map(medicine => (
          <div key={medicine.id} className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="text-center">
              <div className="text-6xl mb-4">{medicine.emoji}</div>
              <h4 className="text-xl font-bold mb-2">{medicine.name}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>💊 Shape: {medicine.shape}</p>
                <p>🎨 Color: {medicine.color}</p>
                <p>⏰ Best time: {medicine.time}</p>
                <p>💊 Dosage: {medicine.dosage}</p>
              </div>
              <button 
                onClick={() => handleViewDetails(medicine)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-2">📘 Detailed Medicine Information</h4>
        <p className="text-sm text-gray-700">
          Each medicine card provides comprehensive information including dosage, shape, color, and optimal timing for better understanding and medication compliance.
        </p>
      </div>
    </div>
  );

  const RemindersDemo = () => {
    const morningMeds = medicines.filter(m => m.time === 'Morning');
    const afternoonMeds = medicines.filter(m => m.time === 'Afternoon');
    const eveningMeds = medicines.filter(m => m.time === 'Evening');
    const nightMeds = medicines.filter(m => m.time === 'Night');

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Reminders Demo</h3>
          <p className="text-gray-600">Pictorial time selection with real medication schedules</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-yellow-50 rounded-lg text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h4 className="font-semibold">Morning</h4>
            <p className="text-sm text-gray-600">8:00 AM</p>
            <div className="mt-2 space-y-1">
              {morningMeds.map(med => (
                <div key={med.id} className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <span>{med.emoji}</span>
                  <span>{med.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-orange-50 rounded-lg text-center">
            <div className="text-4xl mb-2">☀️</div>
            <h4 className="font-semibold">Afternoon</h4>
            <p className="text-sm text-gray-600">2:00 PM</p>
            <div className="mt-2 space-y-1">
              {afternoonMeds.map(med => (
                <div key={med.id} className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <span>{med.emoji}</span>
                  <span>{med.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-purple-50 rounded-lg text-center">
            <div className="text-4xl mb-2">🌅</div>
            <h4 className="font-semibold">Evening</h4>
            <p className="text-sm text-gray-600">6:00 PM</p>
            <div className="mt-2 space-y-1">
              {eveningMeds.map(med => (
                <div key={med.id} className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <span>{med.emoji}</span>
                  <span>{med.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 bg-indigo-50 rounded-lg text-center">
            <div className="text-4xl mb-2">🌙</div>
            <h4 className="font-semibold">Night</h4>
            <p className="text-sm text-gray-600">10:00 PM</p>
            <div className="mt-2 space-y-1">
              {nightMeds.map(med => (
                <div key={med.id} className="text-xs text-gray-500 flex items-center justify-center gap-1">
                  <span>{med.emoji}</span>
                  <span>{med.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={handleAddCustomReminder}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            + Add Custom Reminder
          </button>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h4 className="font-semibold mb-2">🔊 Smart Reminders</h4>
          <p className="text-sm text-gray-700">
            Visual and intuitive reminder system that helps patients stay on track with their medication schedule.
          </p>
        </div>
      </div>
    );
  };

  const MedicineHistoryDemo = () => {
    // Generate sample history data
    const generateHistoryData = () => {
      const medicines = ['Aspirin', 'Metformin', 'Lisinopril', 'Atorvastatin', 'Omeprazole'];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const times = ['8:00 AM', '2:00 PM', '8:00 PM'];
      
      return days.map((day, dayIndex) => ({
        day,
        date: new Date(Date.now() - (6 - dayIndex) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        medicines: medicines.map((medicine, medIndex) => ({
          name: medicine,
          time: times[medIndex % times.length],
          taken: Math.random() > 0.2, // 80% compliance rate
          dosage: ['81mg', '500mg', '10mg', '20mg', '20mg'][medIndex]
        }))
      }));
    };

    const historyData = generateHistoryData();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">Medicine History Demo</h3>
          <p className="text-gray-600">Detailed timeline showing when each medicine was taken with specific times and dosages</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="font-semibold mb-4">📅 This Week's Medicine Log</h4>
          <div className="space-y-4">
            {historyData.map((dayData, dayIndex) => (
              <div key={dayIndex} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-800">{dayData.day} - {dayData.date}</h5>
                  <div className="text-sm text-gray-500">
                    {dayData.medicines.filter(m => m.taken).length}/{dayData.medicines.length} taken
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayData.medicines.map((medicine, medIndex) => (
                    <div key={medIndex} className={`p-3 rounded-lg border-2 ${
                      medicine.taken 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{medicine.taken ? '✅' : '❌'}</span>
                          <div>
                            <div className="font-medium text-sm">{medicine.name}</div>
                            <div className="text-xs text-gray-500">{medicine.dosage}</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">{medicine.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h5 className="font-semibold mb-2">📊 Overall Compliance</h5>
            <div className="text-3xl font-bold text-green-600">87%</div>
            <p className="text-sm text-gray-600">This week</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h5 className="font-semibold mb-2">🎯 Current Streak</h5>
            <div className="text-3xl font-bold text-blue-600">5 days</div>
            <p className="text-sm text-gray-600">Perfect compliance</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h5 className="font-semibold mb-2">⏰ Next Dose</h5>
            <div className="text-2xl font-bold text-purple-600">8:00 AM</div>
            <p className="text-sm text-gray-600">Aspirin 81mg</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
          <h5 className="font-semibold mb-3">📈 Weekly Summary</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">42</div>
              <div className="text-sm text-gray-600">Doses Taken</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">6</div>
              <div className="text-sm text-gray-600">Missed Doses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-sm text-gray-600">Perfect Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">Partial Days</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FitnessWellnessDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Fitness & Wellness Demo</h3>
        <p className="text-gray-600">Workout timer and real-time health metrics</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="font-semibold mb-4 text-center">🏃‍♂️ Workout Timer</h4>
        <div className="text-center mb-6">
          <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
            {formatTime(workoutTime)}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={isWorkoutRunning ? pauseWorkout : startWorkout}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {isWorkoutRunning ? '⏸️ Pause' : '▶️ Start'}
            </button>
            <button
              onClick={stopWorkout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              ⏹️ Stop
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">👟</div>
          <div className="text-2xl font-bold text-blue-600">8,432</div>
          <div className="text-sm text-gray-600">Steps</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">📏</div>
          <div className="text-2xl font-bold text-green-600">6.2</div>
          <div className="text-sm text-gray-600">Miles</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-red-600">324</div>
          <div className="text-sm text-gray-600">Calories</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-2xl font-bold text-pink-600">72</div>
          <div className="text-sm text-gray-600">BPM</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-6 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-4xl mb-2">🚶</div>
          <div className="font-semibold">Walking</div>
          <div className="text-sm text-gray-600">30 min session</div>
        </button>
        <button className="p-6 bg-red-50 rounded-lg text-center hover:bg-red-100 transition-colors">
          <div className="text-4xl mb-2">🏃</div>
          <div className="font-semibold">Running</div>
          <div className="text-sm text-gray-600">15 min session</div>
        </button>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-2">🏆 Health Tracking</h4>
        <p className="text-sm text-gray-700">
          Comprehensive health monitoring with real-time metrics and easy-to-use exercise tracking.
        </p>
      </div>
    </div>
  );

  const ContactSupportDemo = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Contact & Support Demo</h3>
        <p className="text-gray-600">Easy access to help and support resources</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="font-semibold mb-4">📞 Quick Contact Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
            <div className="text-3xl mb-2">📞</div>
            <div className="font-semibold">Phone</div>
            <div className="text-sm text-gray-600">+1 (207) 331-0314</div>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
            <div className="text-3xl mb-2">📧</div>
            <div className="font-semibold">Email</div>
            <div className="text-sm text-gray-600">support@medassist.app</div>
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-2">🏥 For Healthcare Organizations</h4>
        <p className="text-sm text-gray-700 mb-4">
          We build caregiver dashboards and integrations for clinics. 
          Contact us to discuss how SmartDose can help your organization.
        </p>
        <button 
          onClick={handleLearnPartnerships}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Learn More About Partnerships
        </button>
      </div>
    </div>
  );

  const features = [
    {
      title: 'Medicine Management',
      icon: '💊',
      desc: 'Visual medicine cards with colors, shapes, and emojis for easy identification',
      demo: MedicineCardsDemo
    },
    {
      title: 'Medicine Guide',
      icon: '📘',
      desc: 'Visual explanations with icons, detailed info pages, and video guides',
      demo: MedicineGuideDemo
    },
    {
      title: 'Reminders',
      icon: '⏰',
      desc: 'Pictorial time selection with morning, afternoon, and night reminders',
      demo: RemindersDemo
    },
    {
      title: 'Medicine History',
      icon: '📅',
      desc: 'Visual timeline and calendar showing compliance with ✅ and ❌ marks',
      demo: MedicineHistoryDemo
    },
    {
      title: 'Fitness & Wellness',
      icon: '👟',
      desc: 'Workout timer, real-time metrics, and quick exercise options',
      demo: FitnessWellnessDemo
    },
    {
      title: 'Contact & Support',
      icon: '📞',
      desc: 'Easy access to phone, email, and website support options',
      demo: ContactSupportDemo
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
          <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartDose</h1>
              <p className="text-sm text-gray-600 font-medium">Making medicine visual & simple</p>
          </div>
        </div>
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <button onClick={handleTryDemo} className="hover:text-blue-600 transition-colors">Demo</button>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
            <a href="#contact" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started
            </a>
        </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl"></div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Visual Medicine
                  </span>
                  <br />
                  <span className="text-gray-800">Helper for Everyone</span>
                </h2>

            </div>

              <div className="flex flex-wrap gap-4">
                <a href="#features" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold">
                  Explore Features
                </a>
                <button 
                  onClick={handleTryDemo}
                  className="px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Try Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-3">💊</div>
                  <div className="text-sm font-semibold text-gray-700">Medicine Cards</div>
              </div>
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-3">⏰</div>
                  <div className="text-sm font-semibold text-gray-700">Smart Reminders</div>
            </div>
                <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg text-center hover:shadow-xl transition-all duration-300">
                  <div className="text-4xl mb-3">📊</div>
                  <div className="text-sm font-semibold text-gray-700">Health Tracking</div>
                      </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Core Features
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Designed for ease-of-use and accessibility with intuitive visual interfaces
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="group p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 hover:-translate-y-2"
                onClick={() => setActiveModal(index)}
              >
                <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h4 className="text-2xl font-bold mb-4 text-center text-gray-800">{feature.title}</h4>
                <p className="text-gray-600 mb-6 text-center leading-relaxed">{feature.desc}</p>
                <div className="text-center">
                  <button 
                    onClick={() => handleFeatureDemo(index)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Try Demo →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  About SmartDose
                </span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Revolutionizing medication management through visual technology and intuitive design
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                      💊
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">Our Mission</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    To make medication management simple, visual, and accessible for everyone. We believe that 
                    healthcare technology should be intuitive, helping patients stay compliant with their 
                    medication schedules through innovative visual interfaces.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                      🎯
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800">What We Do</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    SmartDose transforms complex medication information into easy-to-understand visual cards, 
                    smart reminders, and comprehensive health tracking. Our app helps patients, caregivers, 
                    and healthcare providers work together for better health outcomes.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                  <h4 className="text-2xl font-bold mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">💊</span>
                      <span>Visual Medicine Cards with accurate colors & shapes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <span>Smart Reminder System with custom notifications</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span>Health Tracking & Compliance Monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">👥</span>
                      <span>Caregiver Support & Family Sharing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-2xl">🏥</span>
                      <span>Healthcare Provider Integration</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="text-center mb-16">
              <h4 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h4>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Passionate developers and healthcare innovators working together to improve medication management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Founder */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-3xl text-white font-bold mx-auto mb-6">
                    VK
                  </div>
                  <h5 className="text-2xl font-bold text-gray-800 mb-2">Vyas Kadiyala</h5>
                  <p className="text-purple-600 font-semibold mb-4">Founder</p>
                  <p className="text-gray-600 leading-relaxed">
                    Visionary leader with a passion for healthcare innovation. Vyas founded SmartDose to 
                    bridge the gap between complex medication management and user-friendly technology.
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Strategy</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Leadership</span>
                  </div>
                </div>
              </div>

              {/* Lead Developer */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-3xl text-white font-bold mx-auto mb-6">
                    VK
                  </div>
                  <h5 className="text-2xl font-bold text-gray-800 mb-2">Vageesh Kudutini Ramesh</h5>
                  <p className="text-blue-600 font-semibold mb-4">Lead Developer</p>
                  <p className="text-gray-600 leading-relaxed">
                    Technical architect and full-stack developer responsible for building SmartDose's 
                    core functionality and ensuring seamless user experience across all platforms.
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Full-Stack</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Architecture</span>
                  </div>
                </div>
              </div>

              {/* Software Developer */}
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-3xl text-white font-bold mx-auto mb-6">
                    SA
                  </div>
                  <h5 className="text-2xl font-bold text-gray-800 mb-2">Siddharth Alwala</h5>
                  <p className="text-green-600 font-semibold mb-4">Software Developer</p>
                  <p className="text-gray-600 leading-relaxed">
                    Innovative developer focused on creating intuitive user interfaces and implementing 
                    cutting-edge features that make medication management both effective and enjoyable.
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">UI/UX</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Innovation</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
              <div className="text-center mb-12">
                <h4 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h4>
                <p className="text-xl text-gray-600">The principles that guide everything we do</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    🎯
                  </div>
                  <h5 className="text-xl font-bold text-gray-800 mb-2">Accessibility</h5>
                  <p className="text-gray-600">Making healthcare technology accessible to everyone, regardless of age or technical expertise.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    🔬
                  </div>
                  <h5 className="text-xl font-bold text-gray-800 mb-2">Innovation</h5>
                  <p className="text-gray-600">Continuously pushing the boundaries of what's possible in healthcare technology.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    ❤️
                  </div>
                  <h5 className="text-xl font-bold text-gray-800 mb-2">Empathy</h5>
                  <p className="text-gray-600">Understanding the real challenges patients face and designing solutions that truly help.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    🤝
                  </div>
                  <h5 className="text-xl font-bold text-gray-800 mb-2">Collaboration</h5>
                  <p className="text-gray-600">Working together with patients, caregivers, and healthcare providers for better outcomes.</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">Ready to Transform Your Medication Management?</h4>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have already improved their health outcomes with SmartDose
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleTryDemo}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Try SmartDose Now
                </button>
                <a 
                  href="#contact" 
                  className="px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300"
                >
                  Contact Our Team
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get in Touch
              </span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or want to partner with us? We'd love to hear from you!
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <h4 className="text-2xl font-bold mb-6 text-gray-800">Send us a Message</h4>
              <form onSubmit={handleContactSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input 
                      name="name" 
                      value={contactForm.name} 
                      onChange={handleContactFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                      required
                    />
                      </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input 
                      name="email" 
                      type="email"
                      value={contactForm.email} 
                      onChange={handleContactFormChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                      required
                    />
                    </div>
                </div>
                      <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      name="countryCode"
                      value={contactForm.countryCode}
                      onChange={handleContactFormChange}
                      className="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white min-w-[120px]"
                    >
                      {countryCodes.map((country, index) => (
                        <option key={index} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <input 
                      name="phone" 
                      type="tel"
                      value={contactForm.phone} 
                      onChange={handleContactFormChange}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                      </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="message" 
                    value={contactForm.message} 
                    onChange={handleContactFormChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 h-32"
                    placeholder="Tell us about your needs or questions..."
                    required
                  />
                    </div>
                <button 
                  type="submit" 
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus === 'sent' && (
                  <div className="text-center text-green-600 font-semibold">
                    ✅ Message sent successfully! We'll get back to you soon.
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="text-center text-red-600 font-semibold">
                    ❌ Failed to send message. Please try again or contact us directly.
                  </div>
                )}
              </form>
                  </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                <h4 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h4>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">📞</div>
                    <div>
                      <div className="font-semibold text-gray-800">Phone</div>
                      <div className="text-gray-600">+1 (207) 331-0314</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📧</div>
                <div>
                      <div className="font-semibold text-gray-800">Email</div>
                      <div className="text-gray-600">support@medassist.app</div>
                    </div>
                  </div>
                  </div>
                </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                <h4 className="text-2xl font-bold mb-4 text-gray-800">For Healthcare Organizations</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We build caregiver dashboards and integrations for clinics. 
                  Tell us about your organization and how we can help!
                </p>
                <button 
                  onClick={handleLearnPartnerships}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Learn About Partnerships
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for Feature Demos */}
      {activeModal !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {features[activeModal].title}
                </h2>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-300"
                >
                  ×
                </button>
              </div>
              {features[activeModal].demo()}
            </div>
          </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {selectedMedicine.name} Details
                </h2>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
                </div>
              
              <div className="text-center mb-6">
                <div className="text-8xl mb-4">{selectedMedicine.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedMedicine.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">💊 Dosage</h4>
                  <p className="text-blue-600">{selectedMedicine.dosage}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">🎨 Color</h4>
                  <p className="text-green-600 capitalize">{selectedMedicine.color}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">📐 Shape</h4>
                  <p className="text-purple-600 capitalize">{selectedMedicine.shape}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">⏰ Best Time</h4>
                  <p className="text-orange-600">{selectedMedicine.time}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">📋 Important Information</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Take with a full glass of water</li>
                  <li>• Follow your doctor's instructions carefully</li>
                  <li>• Store in a cool, dry place</li>
                  <li>• Keep out of reach of children</li>
                  <li>• Contact your doctor if you experience any side effects</li>
                </ul>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Add Custom Reminder
                </h2>
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine</label>
                  <select
                    value={newReminder.medicine}
                    onChange={(e) => handleReminderChange('medicine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a medicine</option>
                    {medicines.map(medicine => (
                      <option key={medicine.id} value={medicine.name}>{medicine.name}</option>
                    ))}
                  </select>
          </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => handleReminderChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Message (Optional)</label>
                  <textarea
                    value={newReminder.message}
                    onChange={(e) => handleReminderChange('message', e.target.value)}
                    placeholder="e.g., Don't forget to take with food"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReminder}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partnerships Modal */}
      {showPartnerships && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Partnership Opportunities
                </h2>
                <button
                  onClick={() => setShowPartnerships(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">🏥 Healthcare Providers</h3>
                    <ul className="space-y-2 text-blue-700">
                      <li>• Custom patient dashboards</li>
                      <li>• Medication compliance tracking</li>
                      <li>• Integration with existing systems</li>
                      <li>• Real-time patient monitoring</li>
                    </ul>
              </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-green-800 mb-4">🏪 Pharmacies</h3>
                    <ul className="space-y-2 text-green-700">
                      <li>• Prescription management tools</li>
                      <li>• Automated refill reminders</li>
                      <li>• Patient education resources</li>
                      <li>• Inventory integration</li>
                    </ul>
              </div>

                  <div className="bg-purple-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-purple-800 mb-4">👨‍⚕️ Caregivers</h3>
                    <ul className="space-y-2 text-purple-700">
                      <li>• Family member monitoring</li>
                      <li>• Shared medication schedules</li>
                      <li>• Emergency notifications</li>
                      <li>• Progress reports</li>
                    </ul>
              </div>

                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-orange-800 mb-4">🏢 Organizations</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Employee wellness programs</li>
                      <li>• Corporate health initiatives</li>
                      <li>• Bulk licensing options</li>
                      <li>• Custom branding</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">📞 Get Started</h3>
                  <p className="text-gray-700 mb-4">
                    Ready to partner with SmartDose? Contact our partnership team to discuss how we can work together to improve medication management and patient outcomes.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Schedule a Demo
                    </button>
                    <button className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                      Download Partnership Guide
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setShowPartnerships(false)}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Demo Modal */}
      {showInteractiveDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Demo Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🚀 Interactive SmartDose Demo
                  </h2>
                  <p className="text-gray-600 mt-2">Experience the app like never before!</p>
                </div>
                <button
                  onClick={() => setShowInteractiveDemo(false)}
                  className="text-gray-500 hover:text-gray-700 text-3xl"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {demoStep + 1} of 5</span>
                  <span>{Math.round(((demoStep + 1) / 5) * 100)}% Complete</span>
            </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((demoStep + 1) / 5) * 100}%` }}
                  ></div>
          </div>
              </div>

              {/* Demo Steps */}
              {demoStep === 0 && (
                <div className="text-center space-y-8">
                  <div className="text-8xl mb-6">🎯</div>
                  <h3 className="text-3xl font-bold text-gray-800">Welcome to SmartDose!</h3>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Let's take a quick tour of our revolutionary medicine management app. 
                    You'll see how easy it is to track, manage, and stay compliant with your medications.
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold mb-4">What you'll experience:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💊</span>
                        <span>Interactive Medicine Cards</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⏰</span>
                        <span>Smart Reminders</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <span>Health Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {demoStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">💊 Medicine Management</h3>
                    <p className="text-xl text-gray-600">Tap the medicines to mark them as taken!</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {demoMedicines.map(medicine => (
                      <div 
                        key={medicine.id}
                        className={`p-6 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                          medicine.taken 
                            ? 'bg-green-100 border-2 border-green-300' 
                            : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => handleDemoMedicineTaken(medicine.id)}
                      >
                        <div className="text-center">
                          <div className="text-6xl mb-4">{medicine.emoji}</div>
                          <h4 className="text-xl font-bold mb-2">{medicine.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>💊 {medicine.dosage}</p>
                            <p>⏰ {medicine.time}</p>
                            <p>📐 {medicine.shape}</p>
                          </div>
                          <div className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
                            medicine.taken 
                              ? 'bg-green-500 text-white' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {medicine.taken ? '✅ Taken' : '👆 Tap to Take'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 p-6 rounded-2xl text-center">
                    <h4 className="text-lg font-semibold mb-2">🎉 Great Job!</h4>
                    <p className="text-gray-700">
                      You've successfully managed your medicines! The app tracks your compliance and sends smart reminders.
                    </p>
                  </div>
                </div>
              )}

              {demoStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">⏰ Smart Reminders</h3>
                    <p className="text-xl text-gray-600">See how our intelligent reminder system works</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-red-50 rounded-2xl text-center">
                      <div className="text-4xl mb-3">🌅</div>
                      <h4 className="font-semibold text-red-800">Morning</h4>
                      <p className="text-sm text-red-600">8:00 AM</p>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-red-700">🟠 Aspirin 81mg</div>
                        <div className="text-xs text-red-700">🥚 Metformin 500mg</div>
                      </div>
                    </div>
                    <div className="p-6 bg-orange-50 rounded-2xl text-center">
                      <div className="text-4xl mb-3">☀️</div>
                      <h4 className="font-semibold text-orange-800">Afternoon</h4>
                      <p className="text-sm text-orange-600">2:00 PM</p>
                      <div className="mt-2 text-xs text-orange-700">No medications</div>
                    </div>
                    <div className="p-6 bg-purple-50 rounded-2xl text-center">
                      <div className="text-4xl mb-3">🌅</div>
                      <h4 className="font-semibold text-purple-800">Evening</h4>
                      <p className="text-sm text-purple-600">6:00 PM</p>
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-purple-700">⚪ Lisinopril 10mg</div>
                      </div>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-2xl text-center">
                      <div className="text-4xl mb-3">🌙</div>
                      <h4 className="font-semibold text-indigo-800">Night</h4>
                      <p className="text-sm text-indigo-600">10:00 PM</p>
                      <div className="mt-2 text-xs text-indigo-700">No medications</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl">
                    <h4 className="text-lg font-semibold mb-2">🔔 Smart Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>• Visual time-based organization</div>
                      <div>• Custom reminder messages</div>
                      <div>• Missed dose notifications</div>
                      <div>• Progress tracking</div>
                    </div>
                  </div>
                </div>
              )}

              {demoStep === 3 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">🏃‍♂️ Fitness & Wellness</h3>
                    <p className="text-xl text-gray-600">Track your health and stay active</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h4 className="text-2xl font-bold mb-6 text-center">⏱️ Workout Timer</h4>
                      <div className="text-center mb-6">
                        <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
                          {formatDemoTime(demoTime)}
                        </div>
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={startDemoWorkout}
                            disabled={isDemoWorkoutRunning}
                            className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
                              isDemoWorkoutRunning 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600 hover:scale-105'
                            }`}
                          >
                            ▶️ Start
                          </button>
                          <button
                            onClick={stopDemoWorkout}
                            disabled={!isDemoWorkoutRunning}
                            className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 ${
                              !isDemoWorkoutRunning 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-500 hover:bg-red-600 hover:scale-105'
                            }`}
                          >
                            ⏹️ Stop
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-4xl mb-3">👟</div>
                        <div className="text-3xl font-bold text-blue-600">8,432</div>
                        <div className="text-gray-600">Steps Today</div>
                      </div>
                      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-4xl mb-3">📏</div>
                        <div className="text-3xl font-bold text-green-600">6.2</div>
                        <div className="text-gray-600">Miles Walked</div>
                      </div>
                      <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                        <div className="text-4xl mb-3">💪</div>
                        <div className="text-3xl font-bold text-purple-600">15</div>
                        <div className="text-gray-600">Workouts This Week</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                    <h4 className="text-lg font-semibold mb-2">🎯 Health Integration</h4>
                    <p className="text-gray-700">
                      SmartDose integrates with your fitness routine to provide a complete health management solution. 
                      Track your activity, monitor your progress, and stay motivated!
                    </p>
                  </div>
                </div>
              )}

              {demoStep === 4 && (
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">📊 Your Health Dashboard</h3>
                    <p className="text-xl text-gray-600">Comprehensive overview of your health journey</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl text-center">
                      <div className="text-4xl mb-3">📈</div>
                      <div className="text-3xl font-bold text-green-700">87%</div>
                      <div className="text-green-600 font-semibold">Compliance Rate</div>
                      <div className="text-sm text-green-600 mt-2">This month</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-2xl text-center">
                      <div className="text-4xl mb-3">🎯</div>
                      <div className="text-3xl font-bold text-blue-700">12</div>
                      <div className="text-blue-600 font-semibold">Day Streak</div>
                      <div className="text-sm text-blue-600 mt-2">Perfect compliance</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl text-center">
                      <div className="text-4xl mb-3">💊</div>
                      <div className="text-3xl font-bold text-purple-700">156</div>
                      <div className="text-purple-600 font-semibold">Doses Taken</div>
                      <div className="text-sm text-purple-600 mt-2">This month</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">Demo Complete!</h4>
                    <p className="text-lg text-gray-600 mb-6">
                      You've experienced the power of SmartDose! Ready to transform your medication management?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        Get Started Now
                      </button>
                      <button className="px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowInteractiveDemo(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip Demo
                </button>
                <button
                  onClick={nextDemoStep}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {demoStep === 4 ? 'Finish Demo' : 'Next Step →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SmartDose</span>
          </div>
          <p className="text-gray-600 font-medium">
            © {new Date().getFullYear()} SmartDose — Built with care for better healthcare accessibility.
          </p>
        </div>
      </footer>
    </div>
  );
}
