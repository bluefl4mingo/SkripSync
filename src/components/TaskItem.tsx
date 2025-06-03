import { FC } from 'react';
import { CalendarDaysIcon, SparklesIcon, BoltIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Task } from '../app/page';

interface TaskItemProps {
  task: Task;
}

const TaskItem: FC<TaskItemProps> = ({ task }) => {
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
    if (value <= 2) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (value === 3) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };
  
  const getPillText = (value: number, type: 'urgency' | 'impact' | 'effort'): string => {
    const scale: { [key: number]: string } = {
      1: type === 'effort' ? 'Sangat Mudah' : (type === 'urgency' ? 'Tidak Mendesak' : 'Kecil'),
      2: 'Rendah',
      3: 'Sedang',
      4: 'Tinggi',
      5: type === 'effort' ? 'Sangat Sulit' : (type === 'urgency' ? 'Sangat Mendesak' : 'Besar')
    };
    return scale[value] || 'N/A';
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-xl shadow-lg hover:shadow-sky-500/10 transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <h3 className="text-xl font-semibold text-sky-300 mb-2 sm:mb-0 break-all">
          {task.taskName}
        </h3>
        <div className="flex items-center text-sm font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full">
          <SparklesIcon className="h-5 w-5 mr-1.5 text-sky-400" />
          Skor Prioritas: {task.score}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm text-slate-400">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-500" />
          Deadline: {formatDate(task.deadline)}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className={`flex items-center p-2.5 rounded-md border ${getPillColor(task.urgency)}`}>
          <div>
            <span className="font-medium">Urgensi:</span> {getPillText(task.urgency, 'urgency')} ({task.urgency})
          </div>
        </div>
        <div className={`flex items-center p-2.5 rounded-md border ${getPillColor(task.impact)}`}>
          <div>
            <span className="font-medium">Dampak:</span> {getPillText(task.impact, 'impact')} ({task.impact})
          </div>
        </div>
        <div className={`flex items-center p-2.5 rounded-md border ${getPillColor(task.effort)}`}>
          <div>
            <span className="font-medium">Usaha:</span> {getPillText(task.effort, 'effort')} ({task.effort})
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;