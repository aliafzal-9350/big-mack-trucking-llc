import { buildIcon } from './iso';
import { ICONS } from './icons';

const cache = new Map();
function getIcon(name) {
  if (!cache.has(name)) cache.set(name, buildIcon(ICONS[name] || []));
  return cache.get(name);
}

/** Isometric icon. Decorative by default; pass `title` to expose it to assistive tech. */
export default function IsoIcon({ name, className = '', title }) {
  const { shapes, viewBox } = getIcon(name);
  return (
    <svg
      viewBox={viewBox}
      className={`iso iso-${name} ${className}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {shapes.map((s) =>
        s.kind === 'polyline' ? (
          <polyline key={s.key} points={s.points} className={s.cls} />
        ) : (
          <polygon key={s.key} points={s.points} className={s.cls} />
        ),
      )}
    </svg>
  );
}
