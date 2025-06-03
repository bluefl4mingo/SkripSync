import { FC } from 'react';
import TaskItem from './TaskItem';
import { Task } from '../app/page';

interface TaskListProps {
  tasks: Task[];
}

const TaskList: FC<TaskListProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;