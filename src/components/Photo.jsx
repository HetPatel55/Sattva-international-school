// Renders a content image ({ src, thumb?, alt, w?, h? }) with a smaller file
// for phones when one exists. Uploaded photos carry their own w/h, so frames
// can match the photo's real shape instead of cropping it.
const Photo = ({ image, sizes = '100vw', alt, ...rest }) => {
  if (!image?.src) return null;
  const { src, thumb, w = 1280, h = 720 } = image;
  return (
    <img
      src={src}
      srcSet={thumb && thumb !== src ? `${thumb} 800w, ${src} 1600w` : undefined}
      sizes={thumb && thumb !== src ? sizes : undefined}
      width={w}
      height={h}
      alt={alt ?? image.alt ?? ''}
      {...rest}
    />
  );
};

export default Photo;
