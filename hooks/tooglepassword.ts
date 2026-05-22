import { useState } from 'react';

export function useTogglePassword() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return {
    inputType: isVisible ? 'text' : 'password',
    isVisible,
    toggleVisibility,
  };
}