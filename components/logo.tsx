export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="0"
        y="30"
        className="fill-foreground font-sentient font-bold text-3xl tracking-tighter"
      >
        Vquiz
      </text>
    </svg>
  );
};
