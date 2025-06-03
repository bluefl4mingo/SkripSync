import { FC } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../app/page';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void; // Tambahkan prop untuk handle edit
  onDeleteTask: (taskId: string) => void; // Tambahkan prop untuk handle delete
}

const TaskList: FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  if (!tasks || tasks.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onEdit={() => onEditTask(task)} // Teruskan fungsi edit
          onDelete={() => onDeleteTask(task.id)} // Teruskan fungsi delete
        />
      ))}
    </div>
  );
};

export default TaskList;