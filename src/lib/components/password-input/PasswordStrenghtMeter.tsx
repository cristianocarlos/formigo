import {CheckIcon, XIcon} from 'lucide-react';

import YiiLang from '@/utils/yii-lang';

import {PASSWORD_MAX_SCORE, PASSWORD_MIN_LENGTH, passwordStrength} from './helper';

export default function PasswordStrenghtMeter({value}: {value?: string}) {
  if (!value) return;
  const {contains, length, score} = passwordStrength(value);
  if (score !== PASSWORD_MAX_SCORE) {
    return (
      <div className={`flex items-center gap-1 text-xs leading-tight text-green-600`}>
        <CheckIcon />
        {YiiLang.formigo('hintFormPasswordStrenghtMeterValid') + '!'}
      </div>
    );
  }
  const requirementOptions = [
    {
      id: 'length',
      label: PASSWORD_MIN_LENGTH + ' ' + YiiLang.formigo('hintFormPasswordStrenghtMeterLength').toLowerCase(),
    },
    {id: 'lowercase', label: YiiLang.formigo('hintFormPasswordStrenghtMeterLowercase')},
    {id: 'uppercase', label: YiiLang.formigo('hintFormPasswordStrenghtMeterUppercase')},
    {id: 'number', label: YiiLang.formigo('hintFormPasswordStrenghtMeterNumber')},
    {id: 'symbol', label: YiiLang.formigo('hintFormPasswordStrenghtMeterSymbol')},
  ];
  return (
    <dl className={`text-xs leading-tight text-cyan-800`}>
      <dt className="leading-normal font-medium">{YiiLang.formigo('hintFormPasswordStrenghtMeterTitle')}</dt>
      {requirementOptions.map((data) => {
        const hasRequirement = data.id === 'length' ? length >= PASSWORD_MIN_LENGTH : contains.includes(data.id);
        return (
          <dd className={`flex items-center gap-1 ${hasRequirement ? 'text-green-600' : ''}`} key={data.id}>
            {hasRequirement ? <CheckIcon className="size-3!" /> : <XIcon className="size-3!" />}
            {data.label}
          </dd>
        );
      })}
    </dl>
  );
}
