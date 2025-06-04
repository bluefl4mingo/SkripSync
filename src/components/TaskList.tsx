import { FC } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../app/page';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
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
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task.id)}
        />
      ))}
    </div>
  );
};

export default TaskList;