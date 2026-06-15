import {getDiffInLuxonDuration, getDurationAsMillis, getDurationParts, getLuxonNow} from '@/utils/luxonHelper';
import {isValidStringDateTime} from '@/utils/validators';
import YiiLang from '@/utils/yii-lang';

export default function formatAgeInWords(date?: null | string) {
  if (!date) return '';
  if (typeof date !== 'string') return '';
  if (!isValidStringDateTime(date)) return '';

  const luxonDuration = getDiffInLuxonDuration(date, getLuxonNow());
  if (!luxonDuration) return '';
  if (getDurationAsMillis(luxonDuration) < 0) return '';
  // se duaracao for negativa, quer dizer que a data de nascimento é mais alta do que o dia de hj, assim mostraria a odade negativa
  let yearsDesc = '';
  let monthsDesc = '';
  let daysDesc = '';
  let ageInWords;

  const durationParts = getDurationParts(luxonDuration);

  const yearSufix = ' ' + YiiLang.formigo('fragmentAgeDescYear');
  const yearsSufix = ' ' + YiiLang.formigo('fragmentAgeDescYears');
  const monthSufix = ' ' + YiiLang.formigo('fragmentAgeDescMonth');
  const monthsSufix = ' ' + YiiLang.formigo('fragmentAgeDescMonths');
  const daySufix = ' ' + YiiLang.formigo('fragmentAgeDescDay');
  const daysSufix = ' ' + YiiLang.formigo('fragmentAgeDescDays');

  if (durationParts.years) {
    const singular = durationParts.years + yearSufix;
    const plural = durationParts.years + yearsSufix;
    yearsDesc = durationParts.years === 1 ? singular : plural;
  }

  if (durationParts.months) {
    const singular = durationParts.months + monthSufix;
    const plural = durationParts.months + monthsSufix;
    monthsDesc = durationParts.months === 1 ? singular : plural;
  }

  if (durationParts.days) {
    const singular = durationParts.days + daySufix;
    const plural = durationParts.days + daysSufix;
    daysDesc = durationParts.days === 1 ? singular : plural;
  }

  if (yearsDesc) {
    ageInWords = yearsDesc;
    ageInWords += yearsDesc && monthsDesc ? ', ' : '';
    ageInWords += monthsDesc;
  } else {
    ageInWords = monthsDesc;
    ageInWords += monthsDesc && daysDesc ? ', ' : '';
    ageInWords += daysDesc;
  }
  return ageInWords;
}
