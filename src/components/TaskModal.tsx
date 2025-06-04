'use client';

import { useState, FC, FormEvent, ChangeEvent, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { TaskFormData, Task } from '../app/page';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: TaskFormData, id?: string) => void;
  editingTask: Task | null;
}

interface CriterionInput {
  id: 'urgency' | 'impact' | 'effort' | 'prioritylvl' | 'learningpoint';
  label: string;
  value: string;
  setter: (value: string) => void;
  help: string;
}

const TaskModal: FC<ModalProps> = ({ isOpen, onClose, onSaveTask, editingTask }) => {
  const [taskName, setTaskName] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [urgency, setUrgency] = useState<string>('3');
  const [impact, setImpact] = useState<string>('3');
  const [effort, setEffort] = useState<string>('3');
  const [prioritylvl, setPrioritylvl] = useState<string>('3');
  const [learningpoint, setLearningpoint] = useState<string>('3');
  const [error, setError] = useState<string>('');

  const SUBMIT_BUTTON_ID = "task-modal-submit-button";

  useEffect(() => {
    if (editingTask) {
      setTaskName(editingTask.taskName);
      setDeadline(editingTask.deadline || '');
      setUrgency(String(editingTask.urgency));
      setImpact(String(editingTask.impact));
      setEffort(String(editingTask.effort));
      setPrioritylvl(String(editingTask.prioritylvl));
      setLearningpoint(String(editingTask.learningpoint));
    } else {
      setTaskName('');
      setDeadline('');
      setUrgency('3');
      setImpact('3');
      setEffort('3');
      setPrioritylvl('3');
      setLearningpoint('3');
    }
    setError('');
  }, [editingTask, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Enter') {
        event.preventDefault(); 
        
        const submitButton = document.getElementById(SUBMIT_BUTTON_ID) as HTMLButtonElement | null;
        if (submitButton) {
          submitButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onSaveTask, editingTask, taskName, deadline, urgency, impact, effort, prioritylvl, learningpoint]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError('Nama tugas tidak boleh kosong.');
      return;
    }

    onSaveTask({ taskName, deadline, urgency, impact, effort, prioritylvl, learningpoint }, editingTask?.id);
  };

  if (!isOpen) return null;

  const criteria: CriterionInput[] = [
    { id: 'urgency', label: 'Tingkat Urgensi (Urgency)', value: urgency, setter: setUrgency, help: "Seberapa mendesak tugas ini?" },
    { id: 'impact', label: 'Potensi Dampak (Impact)', value: impact, setter: setImpact, help: "Seberapa besar dampak jika tugas ini selesai/tidak?" },
    { id: 'effort', label: 'Estimasi Usaha (Effort)', value: effort, setter: setEffort, help: "Seberapa sulit/banyak usaha yang dibutuhkan?" },
    { id: 'prioritylvl', label: 'Prioritas Intuitif (Intuitive Priority)', value: prioritylvl, setter: setPrioritylvl, help: "Seberapa penting tugas ini menurut penilaian pribadi/secara intuitif?" },
    { id: 'learningpoint', label: 'Potensi Pembelajaran (Learning Potential)', value: learningpoint, setter: setLearningpoint, help: "Seberapa besar potensi pembelajaran yang didapat dari tugas ini?" },
  ];

  const modalTitle = editingTask ? "Edit Tugas" : "Tambah Tugas Baru";
  const submitButtonText = editingTask ? "Simpan Perubahan" : "Simpan Tugas";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-2xl max-w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-sky-400">{modalTitle}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 hover:cursor-pointer transition-colors">
            <XMarkIcon className="h-7 w-7" />
          </button>
        </div>

        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="taskName" className="block text-sm font-medium text-slate-300 mb-1">
              Nama Tugas <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTaskName(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-400 text-white"
              placeholder="Contoh: Mengerjakan Bab 1 Skripsi"
              required
            />
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-300 mb-1">
              Tanggal Deadline (Opsional)
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDeadline(e.target.value)}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white"
              min={new Date().toISOString().split('T')[0]} 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
            {criteria.map(criterion => (
              <div key={criterion.id}>
                <label htmlFor={criterion.id} className="block text-sm font-medium text-slate-300 mb-1">
                  {criterion.label} <span className="text-red-400">*</span>
                </label>
                <select
                  id={criterion.id}
                  value={criterion.value}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => criterion.setter(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-white appearance-none"
                >
                  {[1, 2, 3, 4, 5].map(val => (
                    <option key={val} value={String(val)} className="bg-slate-700 text-white">
                      {val} - {
                        val === 1 ? (criterion.id === 'effort' ? 'Sangat Sulit' : (criterion.id === 'urgency' ? 'Tidak Mendesak' : (criterion.id === 'impact' ? 'Dampak Kecil' : (criterion.id === 'prioritylvl' ? 'Sangat Rendah' : 'Sangat Kecil')))) :
                        val === 5 ? (criterion.id === 'effort' ? 'Sangat Mudah' : (criterion.id === 'urgency' ? 'Sangat Mendesak' : (criterion.id === 'impact' ? 'Dampak Besar' : (criterion.id === 'prioritylvl' ? 'Sangat Tinggi' : 'Sangat Besar')))) :
                        (val === 2 ? (criterion.id === 'effort' ? 'Tinggi' : (criterion.id === 'learningpoint' ? 'Kecil' : 'Rendah') ) : (val === 3 ? 'Sedang' : (criterion.id === 'effort' ? 'Rendah' : (criterion.id === 'learningpoint' ? 'Besar' : 'Tinggi'))))
                      }
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-1">{criterion.help}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 hover:cursor-pointer transition-colors"
            >
              Batal
            </button>
            <button
              id={SUBMIT_BUTTON_ID}
              type="submit"
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-all"
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;