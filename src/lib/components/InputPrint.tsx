import EmptyDesc from '@/lib/components/EmptyDesc';

export default function InputPrint({value}: {value?: number | string}) {
  return <div>{value || <EmptyDesc />}</div>;
}
