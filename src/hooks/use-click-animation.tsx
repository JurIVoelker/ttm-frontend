import { useState } from "react";

const useClickAnimation = ({
  onClick,
}: {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const onClickAnimated = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsClicked(true);
    if (onClick) {
      onClick(event);
    }
    setTimeout(() => {
      setIsClicked(false);
    }, 105);
  };

  const clickClass = isClicked ? "animate-click" : "";

  return { isClicked, onClickAnimated, clickClass };
};

export default useClickAnimation;
