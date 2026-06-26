import {ADDRESS_KEYS} from '@/lib/utils/helper';
import {HOME_COUNTRY_DATA} from '@/lib/utils/phoneHelper';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {useDidMountEffect} from '@/utils/hooks';
import YiiLang from '@/utils/yii-lang';

import BrazilAddress from './BrazilAddress';
import CountryComboBox from './CountryComboBox';
import OtherCountryAddress from './OtherCountryAddress';
import useAddressHandlers from './useAddressHandlers';

import type {TAddressProps} from '@/lib/types/address';

function getEmptyValue() {
  // Para permitir o uso do resetError
  return {
    [ADDRESS_KEYS.city]: undefined,
    [ADDRESS_KEYS.cityDesc]: undefined,
    [ADDRESS_KEYS.complement]: undefined,
    [ADDRESS_KEYS.country]: HOME_COUNTRY_DATA.id,
    [ADDRESS_KEYS.countryDesc]: HOME_COUNTRY_DATA.name,
    [ADDRESS_KEYS.line1]: undefined,
    [ADDRESS_KEYS.line2]: undefined,
    [ADDRESS_KEYS.number]: undefined,
    [ADDRESS_KEYS.zipCode]: undefined,
  };
}

export default function Address(props: TAddressProps) {
  const {cityXhrUrl, className = '', countryXhrUrl, initValue, refComponent, zipCodeXhrUrl, ...addressProps} = props;

  const {attribute, disabled, printMode, readOnly, required, validateOnlyOnSubmit} = addressProps;

  const {handleZipCodeSearch, handleZipCodeSearchCancel} = useAddressHandlers({
    attribute,
    disabled,
    getEmptyValue,
    readOnly,
    refComponent,
    zipCodeXhrUrl,
  });

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue);
  });

  const countryId = useSelectorFormigoAttrValue([...attribute, ADDRESS_KEYS.country]) || HOME_COUNTRY_DATA.id;

  if (!isReady) return;

  return (
    <div className={className}>
      {countryXhrUrl ? (
        <CountryComboBox
          attribute={[...attribute, ADDRESS_KEYS.country]}
          disabled={disabled}
          forceValidateOnSubmit={addressProps.forceValidateOnSubmit}
          label={YiiLang.formigo('labelFormAddressCountry')}
          printMode={printMode}
          readOnly={readOnly}
          required={required}
          rootAttribute={attribute}
          validateOnlyOnSubmit={validateOnlyOnSubmit}
          xhrUrl={countryXhrUrl}
        />
      ) : undefined}
      {countryId === HOME_COUNTRY_DATA.id ? (
        <BrazilAddress
          {...addressProps}
          cityXhrUrl={cityXhrUrl}
          countryId={countryId}
          handleZipCodeSearch={handleZipCodeSearch}
          handleZipCodeSearchCancel={handleZipCodeSearchCancel}
        />
      ) : (
        <OtherCountryAddress {...addressProps} cityXhrUrl={cityXhrUrl} countryId={countryId} />
      )}
    </div>
  );
}
