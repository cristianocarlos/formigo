import {useCallback, useRef} from 'react';

import SuggestBox from '@/lib/components/combo-or-suggest/SuggestBox';
import {jsonParse} from '@/utils/helper';
import {useOutsideClickEffect} from '@/utils/hooks';
import YiiLang from '@/utils/yii-lang';

import type {TSuggestBoxProps} from '@/lib/types/comboOrSuggest';
import type {TPhoneInputProps} from '@/lib/types/input';
import type {TCountryOptionRows} from '@/types/common';
import type {TCountryDTO} from '@/types/dto';

type TProps = {
  countryDataParams: NonNullable<TPhoneInputProps['countryDataParams']>;
  handleOutsideClick: () => void;
  handlePick: TSuggestBoxProps['handlePick'];
};

function itemFormatter(data: TCountryOptionRows[number]) {
  const extraData = jsonParse<TCountryDTO>(data.data_list_item_extra);
  if (!extraData) return data.label;
  return (
    <div className="flex gap-2">
      <img alt={data.label} className="aspect-4/3 w-6" src={'//flagcdn.com/' + extraData.iso2_id + '.svg'} />{' '}
      {data.label}{' '}
      <span>
        {'+'}
        {extraData.dialing_code}
      </span>
    </div>
  );
}

export default function PhoneInputDialingCodePicker({countryDataParams, handleOutsideClick, handlePick}: TProps) {
  const refHtmlInputSuggestBox = useRef<HTMLInputElement>(null);

  useOutsideClickEffect(
    refHtmlInputSuggestBox,
    'mousedown',
    useCallback(() => {
      handleOutsideClick();
    }, [handleOutsideClick]),
  );

  return (
    <SuggestBox
      attribute={['chooser'].concat(countryDataParams.attribute)}
      className="absolute z-[var(--z-formigo--input-picker)] mb-0 min-w-60"
      handlePick={handlePick}
      isInitOpen={true}
      itemFormatter={itemFormatter}
      label={null}
      placeholder={YiiLang.formigo('placeholderFormPhoneInputDialingCodePicker')}
      refHtmlInput={refHtmlInputSuggestBox}
      resetValueOnPick={true}
      xhrUrl={countryDataParams.xhrUrl}
    />
  );
}
