import InputGroup from '@/lib/components/input-group/InputGroup';
import {PHONE_GROUP_KEYS} from '@/lib/utils/phoneHelper';

import PhoneGroupElementRow from './PhoneGroupElementRow';

import type {TInputGroupValue, TPhoneGroupProps} from '@/lib/types/inputGroup';

function getItemEmptyValue(): TInputGroupValue[number] {
  // Para permitir o uso do resetError
  return {
    [PHONE_GROUP_KEYS.countryData]: undefined,
    [PHONE_GROUP_KEYS.extension]: undefined,
    [PHONE_GROUP_KEYS.isMain]: undefined,
    [PHONE_GROUP_KEYS.isRestrict]: undefined,
    [PHONE_GROUP_KEYS.number]: undefined,
    [PHONE_GROUP_KEYS.type]: undefined,
    [PHONE_GROUP_KEYS.whatsappLink]: undefined,
  };
}

export default function PhoneGroup(props: TPhoneGroupProps) {
  const {
    additionalInputs,
    countryXhrUrl,
    disabled,
    externalCountryData,
    printMode,
    readOnly,
    required,
    ...componentProps
  } = props;

  return (
    <InputGroup
      {...componentProps}
      data-test="form-element-phone-group"
      disabled={disabled}
      getItemEmptyValue={getItemEmptyValue}
      printMode={printMode}
      readOnly={readOnly}
    >
      {(inputGroupChildrenProps) => {
        return (
          <PhoneGroupElementRow
            {...inputGroupChildrenProps}
            additionalInputs={additionalInputs}
            className="flex items-center gap-2 max-sm:block"
            countryXhrUrl={countryXhrUrl}
            disabled={disabled}
            externalCountryData={externalCountryData}
            printMode={printMode}
            readOnly={readOnly}
            required={required}
          />
        );
      }}
    </InputGroup>
  );
}
