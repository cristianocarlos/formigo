import {MapPinIcon} from 'lucide-react';

import ComboBox from '@/lib/components/combo-or-suggest/ComboBox';
import TextInput from '@/lib/components/text-input/TextInput';
import {ADDRESS_KEYS} from '@/lib/utils/helper';
import {queryStringStringify} from '@/utils/queryString';
import YiiLang from '@/utils/yii-lang';

import type {TAddressProps} from '@/lib/types/address';
import type {TCountryDTO} from '@/types/dto';

type IPOtherCountryAddress = Pick<
  TAddressProps,
  | 'attribute'
  | 'cityIsSelectedOnly'
  | 'cityRequired'
  | 'complementMaxLength'
  | 'disabled'
  | 'forceValidateOnSubmit'
  | 'printMode'
  | 'readOnly'
  | 'required'
  | 'validateOnlyOnSubmit'
> & {
  cityXhrUrl: NonNullable<TAddressProps['cityXhrUrl']>;
  countryId?: TCountryDTO['id'];
};

export default function OtherCountryAddress(props: IPOtherCountryAddress) {
  const {
    attribute,
    cityIsSelectedOnly,
    cityRequired,
    cityXhrUrl,
    complementMaxLength,
    countryId,
    disabled,
    forceValidateOnSubmit,
    printMode,
    readOnly,
    required,
    validateOnlyOnSubmit,
  } = props;
  return (
    <>
      <div className="formigo--row">
        <div className="w-40 flex-none!">
          <TextInput
            attribute={[...attribute, ADDRESS_KEYS.zipCode]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            label={YiiLang.formigo('labelFormAddressOtherCountryZipCode')}
            maxLength={10}
            printMode={printMode}
            readOnly={readOnly}
            required={required}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
          />
        </div>
        <div>
          <TextInput
            attribute={[...attribute, ADDRESS_KEYS.line1]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            iconElement={<MapPinIcon />}
            label={YiiLang.formigo('labelFormAddressOtherCountryLine1')}
            maxLength={50}
            printMode={printMode}
            readOnly={readOnly}
            required={required}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
          />
        </div>
      </div>
      <div className="formigo--row">
        <div>
          <TextInput
            attribute={[...attribute, ADDRESS_KEYS.complement]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            label={YiiLang.formigo('labelFormAddressOtherCountryComplement')}
            maxLength={complementMaxLength || 80}
            printMode={printMode}
            readOnly={readOnly}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
          />
        </div>
        <div>
          <TextInput
            attribute={[...attribute, ADDRESS_KEYS.line2]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            label={YiiLang.formigo('labelFormAddressOtherCountryLine2')}
            maxLength={50}
            printMode={printMode}
            readOnly={readOnly}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
          />
        </div>
        <div>
          <ComboBox
            attribute={[...attribute, ADDRESS_KEYS.city]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            isSelectedOnly={cityIsSelectedOnly}
            label={YiiLang.formigo('labelFormAddressCity')}
            printMode={printMode}
            readOnly={readOnly}
            required={cityRequired || required}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
            xhrQueryString={queryStringStringify({countryId})}
            xhrUrl={cityXhrUrl}
          />
        </div>
      </div>
    </>
  );
}
