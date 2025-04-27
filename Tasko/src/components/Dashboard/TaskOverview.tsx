import React from 'react';
import StatCard from './StatCard';
import Chart from './Chart';
import { 
  ClipboardList, 
  CheckSquare2, 
  HourglassIcon, 
  AlertOctagon,
  BarChart2, 
  LineChart, 
  RadarIcon
} from 'lucide-react';
import { Task, ChartData } from '../../types';
import { startOfWeek, addDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TaskOverviewProps {
  tasks: Task[];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ tasks }) => {
  const [chartType, setChartType] = React.useState<'radar' | 'bar' | 'polar'>('radar');
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  const overdueTasks = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
  ).length;

  const generateChartData = (): ChartData[] => {
    // Utiliser la même logique que WeeklyView
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    
    return weekDays.map(date => {
      const dayTasks = tasks.filter(task => {
        if (!task.createdAt) return false;
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });

      const completedDayTasks = dayTasks.filter(task => task.completed);

      return {
        date: format(date, 'EEEE', { locale: fr }),
        added: dayTasks.length,
        completed: completedDayTasks.length,
        failed: 0
      };
    });
  };
  
  const chartData = generateChartData();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total des tâches"
          value={totalTasks}
          icon={ClipboardList}
          color="bg-primary-500 dark:bg-primary-600"
        />
        <StatCard
          title="Terminées"
          value={completedTasks}
          icon={CheckSquare2}
          color="bg-emerald-500 dark:bg-emerald-600"
        />
        <StatCard
          title="En cours"
          value={pendingTasks}
          icon={HourglassIcon}
          color="bg-amber-500 dark:bg-amber-600"
        />
        <StatCard
          title="En retard"
          value={overdueTasks}
          icon={AlertOctagon}
          color="bg-rose-500 dark:bg-rose-600"
        />
      </div>
      
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-dark-700">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Progression des tâches</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Taux de complétion</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{completionRate}%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 dark:bg-primary-600 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('radar')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'radar'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <RadarIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'bar'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChartType('polar')}
              className={`p-2 rounded-lg transition-colors ${
                chartType === 'polar'
                  ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
              }`}
            >
              <LineChart className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <Chart data={chartData} type={chartType} />
      </div>
    </div>
  );
};

export default TaskOverview;