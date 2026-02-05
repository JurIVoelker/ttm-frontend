import { useEffect, useState } from "react";

const useAlterLoading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(async () => {
      setLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 750));
      setLoading(true);
    }, 1500);

    return () => clearInterval(timer); // Cleanup the timer on unmount
  }, []);

  return loading;
};

export default useAlterLoading;
