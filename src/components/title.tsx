import { Separator } from "./ui/separator";

const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="text-2xl font-semibold text-center md:text-left">
      {children}
      <Separator className="w-full mt-2" />
    </h1>
  );
};

export default Title;
