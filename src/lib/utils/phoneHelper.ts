import {stripNonNumber} from '@/utils/helper';
import YiiLang from '@/utils/yii-lang';

export const PHONE_HOME = 1008;
export const PHONE_WORK = 1010;
export const PHONE_CONTACT = 1009;
export const PHONE_MOBILE = 1011;

export const HOME_COUNTRY_DATA = {
  dialing_code: 55,
  id: 'BRA',
  iso2_id: 'br',
  name: 'Brasil',
};

export const PHONE_GROUP_ADDITIONAL_INPUT_KEYS = {
  extension: 'extension',
  isMain: 'is_main',
  isRestrict: 'is_restrict',
  type: 'type',
  whatsappLink: 'whatsapp_link',
} as const;

export const PHONE_GROUP_KEYS = {
  ...PHONE_GROUP_ADDITIONAL_INPUT_KEYS,
  countryData: 'country_data',
  number: 'number',
} as const;

import type {TFormPhoneData} from '@/types/common';

const WHATSAPP_URL = 'https://wa.me/';

export function resolveWhatsappSendUrl(whatsappData?: TFormPhoneData, queryString = '') {
  let url = WHATSAPP_URL;
  if (whatsappData && whatsappData[PHONE_GROUP_KEYS.number]) {
    url += resolveFullPhoneNumber(whatsappData);
  }
  return url + queryString;
}

export function resolveReplacementWhatsappSendUrl(url?: string) {
  if (!url) return url;
  const urlParts = url.split('?');
  const number = urlParts[0].replace(WHATSAPP_URL, '');
  if (number.length !== 13) return url;
  const replacementNumber = number.substring(0, 4) + number.substring(5, 13);
  return url.replace(number, replacementNumber);
}

function resolveFullPhoneNumber(data: TFormPhoneData) {
  const countryData = data.country_data;
  return (countryData?.dialing_code || HOME_COUNTRY_DATA.dialing_code) + '' + stripNonNumber(data.number);
}

export function getPhoneTypeOptions() {
  return [
    {id: PHONE_HOME, label: YiiLang.formigo('textPhoneHome')},
    {id: PHONE_WORK, label: YiiLang.formigo('textPhoneWork')},
    {id: PHONE_CONTACT, label: YiiLang.formigo('textPhoneContact')},
    {id: PHONE_MOBILE, label: YiiLang.formigo('textPhoneMobile')},
  ];
}
