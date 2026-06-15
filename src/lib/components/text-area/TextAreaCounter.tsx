import YiiLang from '@/utils/yii-lang';

export default function TextAreaCounter({maxLength, value}: {maxLength: number; value?: string}) {
  const counter = maxLength - (value || '').length;
  return (
    <div className="relative px-0.5 text-[0.76em] leading-none font-thin text-gray-500">
      {YiiLang.formigo('labelFormTextAreaCounter') + ': ' + counter}
    </div>
  );
}
