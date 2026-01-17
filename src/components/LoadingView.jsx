import React from 'react';

const LoadingView = ({ fullScreen = true }) => {
  return (
    <div className={`${fullScreen ? 'h-[95vh]' : 'py-20'} flex items-center justify-center bg-transparent w-full`}>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingView;