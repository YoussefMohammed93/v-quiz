export const Logo = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox="0 0 240 65" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Logo Icon */}
      <image
        href="/logo.svg"
        x="0"
        y="0"
        width="65"
        height="65"
        preserveAspectRatio="xMidYMid meet"
      />
      {/* Text */}
      <text
        x="85"
        y="48"
        fontSize="42"
        className="fill-foreground font-sentient font-bold tracking-tighter"
      >
        Vquiz
      </text>
    </svg>
  );
};
