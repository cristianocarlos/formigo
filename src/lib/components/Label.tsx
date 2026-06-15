import type {TFormigoLabel} from '@/lib/types/formigo';

type IPLabel = {
  children?: TFormigoLabel;
  className?: string;
  htmlFor?: string;
  labelHint?: string;
};

export default function Label(props: IPLabel) {
  const {children, className, htmlFor, labelHint} = props;
  if (!children && typeof children !== 'string') return;
  if (typeof children === 'string') {
    let resolvedLabel = children;
    if (labelHint)
      resolvedLabel += '<em class="ml-1 text-[0.6rem] font-normal text-gray-400 not-italic">' + labelHint + '</em>';
    return <label className={className} dangerouslySetInnerHTML={{__html: resolvedLabel}} htmlFor={htmlFor} />;
  }
  return (
    <label className={className} htmlFor={htmlFor}>
      {children}
    </label>
  );
}
