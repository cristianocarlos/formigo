import FilledOptions from './FilledOptions';

export default function RatingOptions({
  className = '',
  wrapperClassName = '',
}: {
  className?: string;
  wrapperClassName?: string;
}) {
  return (
    <FilledOptions
      className={`h-8 max-w-8 flex-1 rounded-lg ${className}`}
      wrapperClassName={`max-sm:gap-0.5 flex! ${wrapperClassName}`}
    />
  );
}
