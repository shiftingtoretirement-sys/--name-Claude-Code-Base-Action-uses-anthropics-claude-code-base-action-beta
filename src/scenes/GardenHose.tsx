import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { Stage, wobble } from "../components/effects";
import { palette } from "../theme";

/** EXHIBIT 01 — a kid drinking from the garden hose on a summer lawn. */
export const GardenHose: React.FC = () => {
  const f = useCurrentFrame();
  const rayRot = (f * 0.4) % 360;
  const dashOffset = -f * 26; // water flowing through the arc
  const heat = 1 + Math.sin(f * 0.05) * 0.02;

  // A stream of droplets travelling along the arc + splashing at the mouth.
  const drops = Array.from({ length: 10 }).map((_, i) => {
    const t = ((f * 0.9 + i * 12) % 120) / 120;
    const x = interpolate(t, [0, 1], [1520, 1015]);
    const y = 470 + Math.sin(t * Math.PI) * -190 + t * 120;
    return { x, y, r: 6 + (i % 3) * 2, o: 1 - t * 0.4 };
  });

  return (
    <Stage>
      {/* Sun with rotating rays */}
      <g transform={`translate(360 250) scale(${heat})`}>
        <g transform={`rotate(${rayRot})`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={-6} y={-230} width={12} height={90} rx={6} fill={palette.harvest} opacity={0.55} transform={`rotate(${i * 30})`} />
          ))}
        </g>
        <circle r={130} fill={palette.brandGold} />
        <circle r={130} fill="none" stroke={palette.bone} strokeWidth={4} opacity={0.4} />
      </g>

      {/* Rolling lawn */}
      <path d={`M0 820 Q 960 740 1920 820 L1920 1080 L0 1080 Z`} fill={palette.avocado} />
      <path d={`M0 900 Q 960 840 1920 900 L1920 1080 L0 1080 Z`} fill="#586330" />
      {/* Grass blades */}
      {Array.from({ length: 42 }).map((_, i) => {
        const gx = 30 + i * 46;
        const sway = wobble(f, "g" + i, 6, 0.2);
        return <path key={i} d={`M${gx} 900 q ${sway} -40 ${sway * 0.4} -70`} stroke="#455026" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.8} />;
      })}

      {/* Spigot + hose entering from the right */}
      <path d="M1920 560 C 1740 560 1720 470 1560 470" stroke={palette.rust} strokeWidth={30} fill="none" strokeLinecap="round" />
      <rect x={1520} y={440} width={70} height={60} rx={10} fill={palette.brown} />

      {/* Water arc */}
      <path id="arc" d="M1540 470 C 1400 250 1180 250 1015 460" stroke="#BFE6F2" strokeWidth={20} fill="none" strokeLinecap="round" strokeDasharray="34 22" strokeDashoffset={dashOffset} opacity={0.9} />
      <path d="M1540 470 C 1400 250 1180 250 1015 460" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray="10 40" strokeDashoffset={dashOffset * 1.4} opacity={0.8} />
      {drops.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#DFF3FA" opacity={d.o} />
      ))}

      {/* Kid silhouette, head tipped back under the arc */}
      <g transform="translate(915 470)" fill={palette.darkBrown}>
        {/* legs */}
        <path d="M40 300 l -30 210 l 34 0 l 24 -160 l 22 160 l 34 0 l -22 -210 Z" />
        {/* torso leaning back */}
        <path d="M-10 120 q 60 -30 130 0 l 6 190 l -150 0 Z" />
        {/* arm reaching up to the hose */}
        <path d="M120 150 q 120 -40 190 -140" stroke={palette.darkBrown} strokeWidth={34} fill="none" strokeLinecap="round" />
        {/* head tilted up */}
        <circle cx={70} cy={70} r={62} />
        <path d="M55 40 q 30 -22 70 -6" stroke={palette.brown} strokeWidth={16} fill="none" strokeLinecap="round" />
      </g>

      {/* Little splash sparkle at the mouth */}
      {[0, 1, 2, 3].map((i) => {
        const s = (Math.sin(f * 0.3 + i) + 1) / 2;
        return <circle key={i} cx={1005 + i * 14 - 20} cy={455 + (i % 2) * 18} r={3 + s * 4} fill="#FFFFFF" opacity={0.5 + s * 0.5} />;
      })}
    </Stage>
  );
};
