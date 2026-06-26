import FormElement from '@/lib/components/FormElement';
import {PHONE_GROUP_KEYS} from '@/lib/utils/phoneHelper';
import {resolveWhatsappSendUrl} from '@/lib/utils/phoneHelper';
import {useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';
import {isValidPhoneNumber} from '@/utils/validators';

import WhatsappLink from './WhatsappLink';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TFormPhoneData} from '@/types/common';

type TProps = {
  className?: string;
  itemAttribute: TFormigoAttribute;
};

export default function PhoneGroupElementRowWhatsapp({className = '', itemAttribute}: TProps) {
  const whatsappData = useSelectorFormigoAttrValue<TFormPhoneData>(itemAttribute);
  if (!whatsappData) return;
  if (!whatsappData[PHONE_GROUP_KEYS.number]) return;
  const countryData = whatsappData[PHONE_GROUP_KEYS.countryData];
  if (!isValidPhoneNumber(whatsappData[PHONE_GROUP_KEYS.number], countryData?.id)) return;
  return (
    <FormElement className={className}>
      <WhatsappLink href={resolveWhatsappSendUrl(whatsappData)} />
    </FormElement>
  );
}
