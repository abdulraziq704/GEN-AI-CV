import React from 'react';

const Loader = () => {
  return (
    // h-screen makes it take the full viewport height, and flex centers the content
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      
      {/* The Spinning Ring */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        {/* Faded background ring */}
        <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
        {/* Animated spinning primary ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>

      {/* Pulsing Text */}
      <p className="text-lg font-medium text-muted-foreground animate-pulse tracking-wide">
        Loading...
      </p>

    </div>
  );
};

export default Loader;