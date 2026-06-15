import {MapPinIcon} from 'lucide-react';

import ComboBox from '@/lib/components/combo-or-suggest/ComboBox';
import IntegerInput from '@/lib/components/masked-input/IntegerInput';
import TextInput from '@/lib/components/text-input/TextInput';
import {ADDRESS_KEYS} from '@/lib/utils/helper';
import {queryStringStringify} from '@/utils/queryString';
import YiiLang from '@/utils/yii-lang';

import BrazilAddressHandFillMessage from './BrazilAddressHandFillMessage';
import ZipCodeInput from './ZipCodeInput';

import type {TAddressProps} from '@/lib/types/address';
import type {TCountryDTO} from '@/types/dto';

type IPBrazilAddress = Pick<
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
  handleZipCodeSearch: () => void;
  handleZipCodeSearchCancel: () => void;
};

export default function BrazilAddress(props: IPBrazilAddress) {
  const {
    attribute,
    cityIsSelectedOnly,
    cityRequired,
    cityXhrUrl,
    complementMaxLength,
    countryId,
    disabled,
    forceValidateOnSubmit,
    handleZipCodeSearch,
    handleZipCodeSearchCancel,
    printMode,
    readOnly,
    required,
    validateOnlyOnSubmit,
  } = props;

  return (
    <>
      <div className="formigo--row">
        <div className="w-40 flex-none!">
          <ZipCodeInput
            attribute={[...attribute, ADDRESS_KEYS.zipCode]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            handleSearch={handleZipCodeSearch}
            handleSearchCancel={handleZipCodeSearchCancel}
            label={YiiLang.formigo('labelFormAddressBrazilZipCode')}
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
            label={YiiLang.formigo('labelFormAddressBrazilLine1')}
            maxLength={50}
            placeholder={YiiLang.formigo('placeholderFormAddressBrazilLine1')}
            printMode={printMode}
            readOnly={readOnly}
            required={required}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
          />
        </div>
        <div className="w-20 flex-none!">
          <IntegerInput
            attribute={[...attribute, ADDRESS_KEYS.number]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            label={YiiLang.formigo('labelFormAddressBrazilNumber')}
            maxLength={6}
            printMode={printMode}
            readOnly={readOnly}
            validateOnlyOnSubmit={validateOnlyOnSubmit}
          />
        </div>
      </div>
      <BrazilAddressHandFillMessage attribute={attribute} />
      <div className="formigo--row">
        <div>
          <TextInput
            attribute={[...attribute, ADDRESS_KEYS.complement]}
            disabled={disabled}
            forceValidateOnSubmit={forceValidateOnSubmit}
            label={YiiLang.formigo('labelFormAddressBrazilComplement')}
            maxLength={complementMaxLength || 80}
            placeholder={YiiLang.formigo('placeholderFormAddressBrazilComplement')}
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
            label={YiiLang.formigo('labelFormAddressBrazilLine2')}
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
