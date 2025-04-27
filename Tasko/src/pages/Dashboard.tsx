import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';
import TaskOverview from '../components/Dashboard/TaskOverview';
import Card from '../components/ui/Card';
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target,
  TrendingUp,
  Users
} from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const recentActivity = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const categoryDistribution = tasks.reduce((acc, task) => {
    const category = task.category || 'Non catégorisé';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Welcome Card - Spans full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bento-card p-6 col-span-full"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-violet-900 dark:text-violet-100 mb-2">
              Tableau de bord
            </h1>
            <p className="text-violet-600 dark:text-violet-300">
              Voici un aperçu de votre progression
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-violet-600 dark:text-violet-300">Taux de complétion</p>
              <p className="text-2xl font-bold gradient-text">{completionRate}%</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-400 flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats - Each takes 1/4 width */}
      <div className="bento-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-600 dark:text-violet-300">Tâches totales</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-1">{totalTasks}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-violet-500" />
          </div>
        </div>
      </div>

      <div className="bento-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-600 dark:text-violet-300">Tâches terminées</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-1">{completedTasks}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-violet-500" />
          </div>
        </div>
      </div>

      <div className="bento-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-600 dark:text-violet-300">En cours</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-1">
              {totalTasks - completedTasks}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Clock className="w-6 h-6 text-violet-500" />
          </div>
        </div>
      </div>

      <div className="bento-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-600 dark:text-violet-300">Cette semaine</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-100 mt-1">
              {tasks.filter(task => {
                const taskDate = new Date(task.createdAt);
                const today = new Date();
                const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                return taskDate >= weekStart;
              }).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-violet-500" />
          </div>
        </div>
      </div>

      {/* Charts Section - Spans 3 columns */}
      <div className="col-span-full lg:col-span-3">
        <div className="bento-card">
          <TaskOverview tasks={tasks} />
        </div>
      </div>

      {/* Activity Feed - Takes remaining space */}
      <div className="col-span-full lg:col-span-1 space-y-6">
        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-100 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-violet-500" />
              Activité récente
            </h2>
            <span className="text-sm text-violet-500 dark:text-violet-400">
              Dernières 24h
            </span>
          </div>
          <div className="space-y-4">
            {recentActivity.map(task => (
              <div 
                key={task.id}
                className="flex items-center p-3 rounded-xl bg-violet-50 dark:bg-violet-900/30"
              >
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  task.completed 
                    ? 'bg-violet-500' 
                    : 'bg-violet-300'
                }`} />
                <div>
                  <p className="text-sm font-medium text-violet-900 dark:text-violet-100">
                    {task.title}
                  </p>
                  <p className="text-xs text-violet-500 dark:text-violet-400">
                    {new Date(task.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-violet-900 dark:text-violet-100 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-violet-500" />
              Distribution
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-violet-600 dark:text-violet-300">
                    {category}
                  </span>
                  <span className="text-sm font-medium text-violet-900 dark:text-violet-100">
                    {count} tâches
                  </span>
                </div>
                <div className="h-2 bg-violet-100 dark:bg-violet-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-violet-400"
                    style={{ width: `${(count / totalTasks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;