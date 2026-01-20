import { Separator } from "./ui/separator";

const Title = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1
      className={`text-2xl font-semibold text-center md:text-left ${className}`}
      {...props}
    >
      {children}
      <Separator className="w-full mt-2" />
    </h1>
  );
};

export default Title;
