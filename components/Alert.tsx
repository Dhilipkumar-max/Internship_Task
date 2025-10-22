import React, { FC } from 'react';
import { AlertMessage } from '../types';

interface AlertProps {
  alert: AlertMessage;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Alert: FC<AlertProps> = ({ alert }) => {
  const alertStyles = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-700',
      icon: <CheckCircleIcon />,
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: <InfoIcon />,
    },
  };
  
  const styles = alertStyles[alert.type];

  return (
    <div className={`border-l-4 p-4 rounded-md flex items-center space-x-3 ${styles.bg} ${styles.border}`} role="alert">
        <div className={styles.text}>{styles.icon}</div>
        <p className={`text-sm font-medium ${styles.text}`}>{alert.message}</p>
    </div>
  );
};