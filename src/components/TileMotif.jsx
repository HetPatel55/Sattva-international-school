// Vector redraw of the 3×3 tile mark from the SATTVA logo, used as a
// decorative brand element. Each cell is 100 units; cells sit 8 units apart.
const CELL = 100;
const GAP = 8;

const tiles = [
  { color: 'var(--t-red)', d: 'M0 0H100L0 100Z' },
  { color: 'var(--t-tan)', d: 'M0 0H50A50 50 0 0 1 50 100H0Z' },
  { color: 'var(--t-green)', d: 'M0 0H100V100A100 100 0 0 1 0 0Z' },
  { color: 'var(--t-purple)', d: 'M0 0H100A100 100 0 0 1 0 100Z' },
  { color: 'var(--t-gray)', d: 'M0 0A100 100 0 0 1 100 100H0Z' },
  { color: 'var(--t-crimson)', d: 'M0 0H100V50A50 50 0 0 1 0 50Z' },
  { color: 'var(--t-olive)', d: 'M50 0H100V100H50A50 50 0 0 1 50 0Z' },
  { color: 'var(--t-orange)', d: 'M100 0V100H0Z' },
  { color: 'var(--t-blue)', d: 'M0 0H100V100H0Z' },
];

const TileMotif = ({ className = '', size, muted = false }) => {
  const span = CELL * 3 + GAP * 2;
  return (
    <svg
      className={`tile-motif${muted ? ' tile-motif--muted' : ''} ${className}`}
      viewBox={`0 0 ${span} ${span}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {tiles.map((tile, i) => {
        const x = (i % 3) * (CELL + GAP);
        const y = Math.floor(i / 3) * (CELL + GAP);
        return <path key={i} d={tile.d} fill={tile.color} transform={`translate(${x} ${y})`} />;
      })}
    </svg>
  );
};

export default TileMotif;
