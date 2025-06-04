import { FC } from 'react';
import { CalendarDaysIcon, SparklesIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task } from '../app/page';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskItem: FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Tidak ada';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
        return 'Tanggal tidak valid';
    }
  };

  const getPillColor = (value: number): string => {
    if (value === 1) return 'bg-teal-500/20 text-teal-200 border-teal-500/30';
    if (value === 2) return 'bg-green-500/20 text-green-200 border-green-500/30';
    if (value === 3) return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
    if (value === 4) return 'bg-orange-500/20 text-orange-200 border-yellow-500/30';
    return 'bg-red-500/20 text-red-200 border-red-500/30';
  };

  const getPillColorReversed = (value: number): string => {
    if (value === 5) return 'bg-teal-500/20 text-teal-200 border-teal-500/30';
    if (value === 4) return 'bg-green-500/20 text-green-200 border-green-500/30';
    if (value === 3) return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
    if (value === 2) return 'bg-orange-500/20 text-orange-200 border-yellow-500/30';
    return 'bg-red-500/20 text-red-200 border-red-500/30';
  };
  
  const getPillText = (value: number, type: 'urgency' | 'impact' | 'effort'): string => {
    const scale: { [key: number]: string } = {
      1: type === 'effort' ? 'Sangat Sulit' : (type === 'urgency' ? 'Tidak Mendesak' : 'Kecil'),
      2: type === 'effort' ? 'Tinggi' : 'Rendah',
      3: 'Sedang',
      4: type === 'effort' ? 'Rendah' : 'Tinggi',
      5: type === 'effort' ? 'Sangat Mudah' : (type === 'urgency' ? 'Sangat Mendesak' : 'Besar')
    };
    return scale[value] || 'N/A';
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-xl shadow-lg hover:shadow-sky-500/20 hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
        <div className="flex-grow mb-2 sm:mb-0">
            <h3 className="text-xl font-semibold text-sky-200 break-all">
            {task.taskName}
            </h3>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
            <button 
                onClick={onEdit} 
                className="p-2 text-slate-400 hover:text-sky-400 hover:cursor-pointer transition-colors"
                aria-label="Edit tugas"
            >
                <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button 
                onClick={onDelete} 
                className="p-2 text-slate-400 hover:text-red-400 hover:cursor-pointer transition-colors"
                aria-label="Hapus tugas"
            >
                <TrashIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center text-md font-bold bg-sky-500/20 border border-sky-500/30 px-3 py-1 rounded-full">
                <SparklesIcon className="h-5 w-5 mr-1.5 text-sky-200" />
                <span className="text-sky-200">
                  Skor: {task.score}
                </span>
            </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-slate-300">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-500" />
          Deadline: {formatDate(task.deadline)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className={`flex items-center p-2.5 rounded-md border ${getPillColor(task.urgency)}`}>
          <div>
            <span className="font-semibold">Urgensi:</span> {getPillText(task.urgency, 'urgency')} ({task.urgency})
          </div>
        </div>
        <div className={`flex items-center p-2.5 rounded-md border ${getPillColor(task.impact)}`}>
          <div>
            <span className="font-semibold">Dampak:</span> {getPillText(task.impact, 'impact')} ({task.impact})
          </div>
        </div>
        <div className={`flex items-center p-2.5 rounded-md border ${getPillColorReversed(task.effort)}`}>
          <div>
            <span className="font-semibold">Usaha:</span> {getPillText(task.effort, 'effort')} ({task.effort})
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;