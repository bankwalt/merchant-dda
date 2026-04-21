import type { CSSProperties } from "react";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 20, color, style }: IconProps) {
  return (
    <span
      className="icon"
      style={{
        width: size,
        height: size,
        color,
        display: "inline-flex",
        ...style,
      }}
      aria-hidden="true"
    >
      <img
        src={`/icons/${name}.svg`}
        width={size}
        height={size}
        alt=""
        style={{ display: "block" }}
      />
    </span>
  );
}
