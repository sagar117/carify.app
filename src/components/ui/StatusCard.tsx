import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center">
          {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className="mt-4">
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                changeType === 'positive'
                  ? 'bg-green-100 text-green-800'
                  : changeType === 'negative'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {changeType === 'positive' && <span>▲</span>}
              {changeType === 'negative' && <span>▼</span>}
              <span className="ml-1">{change}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;