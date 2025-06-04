'use client';

import Head from 'next/head';
import { useState, useEffect, useCallback, FC } from 'react';
import TaskModal from '../components/TaskModal';
import TaskList from '../components/TaskList';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import ConfirmModal from '../components/ConfirmModal';

export interface Task {
  id: string;
  taskName: string;
  deadline?: string;
  urgency: number;
  impact: number;
  effort: number;
  score: number;
}

export interface TaskFormData {
  taskName: string;
  deadline: string;
  urgency: string;
  impact: string;
  effort: string;
}

// Weights untuk Weighted Scoring Model
const WEIGHTS = {
  urgency: 0.4,
  impact: 0.4,
  effort: 0.2,
};

const HomePage: FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedTasks = localStorage.getItem('skripsyncTasks');
      if (storedTasks) {
        try {
          const parsedTasks = JSON.parse(storedTasks) as Task[];
          if (Array.isArray(parsedTasks) && parsedTasks.every(task => typeof task.id === 'string' && typeof task.taskName === 'string')) {
            setTasks(parsedTasks);
          } else {
            console.error("Format tugas dari localStorage tidak valid.");
            setTasks([]);
          }
        } catch (error) {
          console.error("Gagal memuat tugas dari localStorage:", error);
          setTasks([]);
        }
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('skripsyncTasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const calculatePriorityScore = useCallback((data: { urgency: string; impact: string; effort: string }) => {
    const score =
      parseInt(data.urgency, 10) * WEIGHTS.urgency +
      parseInt(data.impact, 10) * WEIGHTS.impact +
      parseInt(data.effort, 10) * WEIGHTS.effort;
    return parseFloat(score.toFixed(2));
  }, []);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = useCallback((taskData: TaskFormData, id?: string) => {
    const score = calculatePriorityScore({
      urgency: taskData.urgency,
      impact: taskData.impact,
      effort: taskData.effort,
    });

    if (id) {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id
            ? {
                ...task,
                taskName: taskData.taskName,
                deadline: taskData.deadline || undefined,
                urgency: parseInt(taskData.urgency, 10),
                impact: parseInt(taskData.impact, 10),
                effort: parseInt(taskData.effort, 10),
                score,
              }
            : task
        )
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        taskName: taskData.taskName,
        deadline: taskData.deadline || undefined,
        urgency: parseInt(taskData.urgency, 10),
        impact: parseInt(taskData.impact, 10),
        effort: parseInt(taskData.effort, 10),
        score,
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
    }
    handleCloseTaskModal();
  }, [calculatePriorityScore]);

  const handleDeleteRequest = (taskId: string) => {
    setTaskToDeleteId(taskId);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setTaskToDeleteId(null);
  };

  const handleConfirmDeleteTask = useCallback(() => {
    if (taskToDeleteId) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDeleteId));
      handleCloseConfirmModal();
    }
  }, [taskToDeleteId]);


  const sortedTasks = [...tasks].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else if (a.deadline) {
      return -1;
    } else if (b.deadline) {
      return 1;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center p-4 sm:p-8 font-sans">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@700&display=swap" rel="stylesheet" />
      </Head>

      <header className="w-full max-w-4xl text-center mb-10 mt-8">
        <h1 className="text-5xl sm:text-6xl font-bold mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Skrip<span className="text-sky-400">Sync</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300">
          Atur Prioritas, Raih Sukses Tepat Waktu!
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <div className="flex justify-center  mb-6">
          <button
            onClick={handleOpenAddModal}
            className="flex items-center bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-100 ease-in-out transform"
          >
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Tambah Tugas
          </button>
        </div>

        {isClient && <TaskList tasks={sortedTasks} onEditTask={handleOpenEditModal} onDeleteTask={handleDeleteRequest} />}
        
        {!isClient && (
            <div className="text-center text-slate-400 mt-10">
                Memuat daftar tugas...
            </div>
        )}

        {isClient && tasks.length === 0 && (
             <div className="text-center text-slate-400 mt-20 p-8 bg-slate-800 rounded-xl shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-sky-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                <h2 className="text-2xl font-semibold mb-2">Belum Ada Tugas</h2>
                <p className="text-slate-300">Mulai tambahkan tugas pertama untuk diprioritaskan!</p>
            </div>
        )}
      </main>

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onSaveTask={handleSaveTask}
          editingTask={editingTask}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseConfirmModal}
          onConfirm={handleConfirmDeleteTask}
          title="Konfirmasi Hapus Tugas"
          message="Apakah kamu yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan."
        />
      )}

      <footer className="w-full max-w-4xl text-center mt-16 mb-8">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} SkripSync. Dibuat dengan cinta.
          <br />
          Developed by Febri, Adzka, and Pijar.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
