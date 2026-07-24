import { ICON_SVG, type IconName } from "./icon-svg";

export type { IconName };

/**
 * Faithful React port of the prototype's `ic(name, size)` helper.
 * Renders the exact SVG markup from index (3).html (see icon-svg.ts),
 * wrapped in an inline-flex span sized to `size`, matching the prototype.
 */
export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const svg = ICON_SVG[name] ?? "";
  return (
    <span
      className={className}
      aria-hidden="true"
      style={{ display: "inline-flex", width: size, height: size, ...style }}
      dangerouslySetInnerHTML={{
        __html: svg.replace("<svg", `<svg width="${size}" height="${size}"`),
      }}
    />
  );
}
