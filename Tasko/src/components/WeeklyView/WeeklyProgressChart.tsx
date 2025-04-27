import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, startOfWeek, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Task } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyProgressChartProps {
  tasks: Task[];
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({ tasks }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  const calculateDayProgress = (date: Date) => {
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate || '');
      return taskDate.toDateString() === date.toDateString();
    });
    
    if (dayTasks.length === 0) return 0;
    const completedTasks = dayTasks.filter(task => task.completed);
    return (completedTasks.length / dayTasks.length) * 100;
  };

  const data = {
    labels: weekDays.map(day => format(day, 'EEEE', { locale: fr })),
    datasets: [
      {
        label: 'Progression (%)',
        data: weekDays.map(day => calculateDayProgress(day)),
        borderColor: isDarkMode ? 'rgb(167, 139, 250)' : 'rgb(139, 92, 246)',
        backgroundColor: isDarkMode ? 'rgba(167, 139, 250, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: isDarkMode ? 'rgb(167, 139, 250)' : 'rgb(139, 92, 246)',
        pointBorderColor: isDarkMode ? '#1e293b' : 'white',
        pointBorderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#e2e8f0' : '#1f2937',
        bodyColor: isDarkMode ? '#e2e8f0' : '#1f2937',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: '600',
          family: "'SF Pro Display', system-ui, sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'SF Pro Display', system-ui, sans-serif"
        },
        callbacks: {
          label: (context: any) => `Progression: ${Math.round(context.raw)}%`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#a78bfa' : '#8b5cf6',
          font: {
            size: 12,
            family: "'SF Pro Display', system-ui, sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: isDarkMode ? 'rgba(167, 139, 250, 0.1)' : 'rgba(139, 92, 246, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#a78bfa' : '#8b5cf6',
          font: {
            size: 12,
            family: "'SF Pro Display', system-ui, sans-serif"
          },
          callback: (value: number) => `${value}%`
        }
      }
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm p-6 border border-violet-100 dark:border-violet-800">
      <h3 className="text-lg font-medium text-violet-900 dark:text-violet-100 mb-4">
        Progression hebdomadaire
      </h3>
      <div className="h-[200px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeeklyProgressChart;