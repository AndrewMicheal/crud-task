import { useRef, useEffect } from 'react';

export function useIsMounted() {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    console.log("yes")

    return () =>{
        
        isMounted.current = false
    };
  }, []);

  return isMounted;
}