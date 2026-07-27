type Props = {
  src: string;
  title: string;
};

export function PresentationFrame({ src, title }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-black/40">
      <iframe
        src={src}
        title={title}
        className="min-h-[78vh] w-full border-0 bg-white"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
