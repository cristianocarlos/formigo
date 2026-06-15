// Adapted from: https://github.com/deanilvincent/check-password-strength

import YiiLang from '@/utils/yii-lang';

import type {TFormigoValidatorBaseCallerProps, TFormigoValidatorGetAttrValue} from '@/lib/types/formigo';

export const PASSWORD_MAX_SCORE = 4;
export const PASSWORD_MIN_LENGTH = 10;

const OPTIONS = [
  {
    minDiversity: 0,
    minLength: 0,
    score: 1,
  },
  {
    minDiversity: 2,
    minLength: 6,
    score: 2,
  },
  {
    minDiversity: 4,
    minLength: 8,
    score: 3,
  },
  {
    minDiversity: 4,
    minLength: PASSWORD_MIN_LENGTH,
    score: PASSWORD_MAX_SCORE,
  },
];

const RULES = [
  {
    message: 'lowercase',
    regex: '[a-z]',
  },
  {
    message: 'uppercase',
    regex: '[A-Z]',
  },
  {
    message: 'number',
    regex: '[0-9]',
  },
  {
    message: 'symbol',
    regex: '[!"#\$%&\'\(\)\*\+,-\./:;<=>\?@\[\\\\\\]\^_`\{|\}~]',
  },
];

export const passwordStrength = (password?: string) => {
  const passwordCopy = password || '';

  const contains = RULES.filter((rule) => new RegExp(`${rule.regex}`).test(passwordCopy)).map((rule) => rule.message);

  const {length} = passwordCopy;

  const [{score}] = OPTIONS.filter((option) => contains.length >= option.minDiversity)
    .filter((option) => length >= option.minLength)
    .sort((o1, o2) => o2.score - o1.score);

  return {
    contains,
    length,
    score,
  };
};

export function strongPasswordValidator(callerProps: TFormigoValidatorBaseCallerProps) {
  return (getAttrValue: TFormigoValidatorGetAttrValue) => {
    const {attribute} = callerProps;
    const attrValue = getAttrValue(attribute);
    if (attrValue) {
      return passwordStrength(attrValue).score < PASSWORD_MAX_SCORE
        ? YiiLang.formigo('feedbackFormValidatorPasswordWeakError')
        : undefined;
    }
    return;
  };
}
