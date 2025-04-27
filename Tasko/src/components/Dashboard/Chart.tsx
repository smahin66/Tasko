import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Radar, PolarArea } from 'react-chartjs-2';
import { ChartData } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: ChartData[];
  type: 'radar' | 'bar' | 'polar';
}

const Chart: React.FC<ChartProps> = ({ data = [], type }) => {
  // Return early if no data is provided
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 dark:bg-dark-700 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </div>
    );
  }

  const isDarkMode = document.documentElement.classList.contains('dark');

  const commonData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Tâches ajoutées',
        data: data.map(item => item.added),
        borderColor: isDarkMode ? 'rgb(167, 139, 250)' : 'rgb(124, 58, 237)',
        backgroundColor: isDarkMode ? 'rgba(167, 139, 250, 0.1)' : 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Tâches terminées',
        data: data.map(item => item.completed),
        borderColor: isDarkMode ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
        backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          color: isDarkMode ? '#e2e8f0' : '#1f2937',
          font: {
            size: 12,
            family: "'Outfit', system-ui, sans-serif"
          }
        }
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
          family: "'Outfit', system-ui, sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Outfit', system-ui, sans-serif"
        },
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#64748b',
          font: {
            size: 12,
            family: "'Outfit', system-ui, sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: isDarkMode ? '#94a3b8' : '#64748b',
          font: {
            size: 12,
            family: "'Outfit', system-ui, sans-serif"
          },
          stepSize: 1
        }
      }
    }
  };

  const chartStyle = {
    height: '300px',
    width: '100%'
  };

  if (type === 'radar') {
    const radarData = {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: 'Tâches ajoutées',
          data: data.map(item => item.added),
          borderColor: isDarkMode ? 'rgb(167, 139, 250)' : 'rgb(124, 58, 237)',
          backgroundColor: isDarkMode ? 'rgba(167, 139, 250, 0.2)' : 'rgba(124, 58, 237, 0.2)',
          pointBackgroundColor: isDarkMode ? 'rgb(167, 139, 250)' : 'rgb(124, 58, 237)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: isDarkMode ? 'rgb(167, 139, 250)' : 'rgb(124, 58, 237)',
        },
        {
          label: 'Tâches terminées',
          data: data.map(item => item.completed),
          borderColor: isDarkMode ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
          backgroundColor: isDarkMode ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)',
          pointBackgroundColor: isDarkMode ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: isDarkMode ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
        }
      ]
    };

    return (
      <div style={chartStyle}>
        <Radar 
          data={radarData} 
          options={{
            ...commonOptions,
            scales: {
              r: {
                angleLines: {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                grid: {
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
                pointLabels: {
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  font: {
                    size: 12,
                    family: "'Outfit', system-ui, sans-serif"
                  }
                },
                ticks: {
                  color: isDarkMode ? '#94a3b8' : '#64748b',
                  backdropColor: 'transparent'
                }
              }
            }
          }} 
        />
      </div>
    );
  }

  if (type === 'polar') {
    const polarData = {
      labels: data.map(item => item.date),
      datasets: [
        {
          data: data.map(item => item.added + item.completed),
          backgroundColor: [
            'rgba(167, 139, 250, 0.5)',
            'rgba(52, 211, 153, 0.5)',
            'rgba(251, 146, 60, 0.5)',
            'rgba(236, 72, 153, 0.5)',
            'rgba(99, 102, 241, 0.5)',
            'rgba(16, 185, 129, 0.5)',
            'rgba(124, 58, 237, 0.5)',
          ],
          borderColor: [
            'rgb(167, 139, 250)',
            'rgb(52, 211, 153)',
            'rgb(251, 146, 60)',
            'rgb(236, 72, 153)',
            'rgb(99, 102, 241)',
            'rgb(16, 185, 129)',
            'rgb(124, 58, 237)',
          ],
        }
      ]
    };

    return (
      <div style={chartStyle}>
        <PolarArea 
          data={polarData} 
          options={commonOptions} 
        />
      </div>
    );
  }

  return (
    <div style={chartStyle}>
      <Bar data={commonData} options={commonOptions} />
    </div>
  );
};

export default Chart;