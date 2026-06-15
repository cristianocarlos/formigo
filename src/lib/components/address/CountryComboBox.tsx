import ComboBox from '@/lib/components/combo-or-suggest/ComboBox';
import {ADDRESS_KEYS} from '@/lib/utils/helper';
import {useDispatchFormigoAttrSetValue} from '@/lib/zustand/hooks';
import {jsonParse, valueAsString} from '@/utils/helper';
import {queryStringStringify} from '@/utils/queryString';

import type {TAddressCountryData} from '@/lib/types/address';
import type {TComboBoxProps, TComboOrSuggestBase} from '@/lib/types/comboOrSuggest';
import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {TCountryDTO} from '@/types/dto';

type TProps = TComboBoxProps & {
  rootAttribute: TFormigoAttribute;
};

export default function CountryComboBox(props: TProps) {
  const {rootAttribute, ...componentProps} = props;

  const setPhoneCountryData = useDispatchFormigoAttrSetValue<TAddressCountryData>([
    ...rootAttribute,
    ADDRESS_KEYS.phoneCountryData,
  ]);

  const handleCountryPick: TComboOrSuggestBase['handlePick'] = ({dataListItemExtra}) => {
    let newPhoneCountryData;
    const extraData = jsonParse<TCountryDTO>(dataListItemExtra);
    if (extraData) {
      newPhoneCountryData = {
        dialing_code: valueAsString(extraData.dialing_code),
        id: extraData.id,
        iso2_id: extraData.iso2_id,
      };
    }
    setPhoneCountryData(newPhoneCountryData);
  };

  return (
    <ComboBox {...componentProps} handlePick={handleCountryPick} xhrQueryString={queryStringStringify({withCity: 1})} />
  );
}
