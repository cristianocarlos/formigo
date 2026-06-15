import {useCallback, useState} from 'react';

import {HOME_COUNTRY_DATA} from '@/lib/utils/phoneHelper';
import {useDispatchFormigoAttrSetValue, useSelectorFormigoAttrValue} from '@/lib/zustand/hooks';
import {jsonParse} from '@/utils/helper';

import type {TAddressCountryData} from '@/lib/types/address';
import type {TComboOrSuggestBase} from '@/lib/types/comboOrSuggest';
import type {TPhoneInputProps} from '@/lib/types/input';
import type {TButtonMouseEventHandler, TInputFocusEventHandler} from '@/types/common';

type TUseDialingCodePickerHandlers = Pick<TPhoneInputProps, 'disabled' | 'readOnly'> & {
  countryDataAttribute?: NonNullable<TPhoneInputProps['countryDataParams']>['attribute'];
  handleInputBlur: TInputFocusEventHandler;
  refHtmlInput: NonNullable<TPhoneInputProps['refHtmlInput']>;
};

export default function useDialingCodePickerHandlers(params: TUseDialingCodePickerHandlers) {
  const {countryDataAttribute, disabled, handleInputBlur, readOnly, refHtmlInput} = params;

  const [isDialingCodePickerOpen, setIsDialingCodePickerOpen] = useState(false);

  const countryData = useSelectorFormigoAttrValue<TAddressCountryData>(countryDataAttribute);
  const setCountryData = useDispatchFormigoAttrSetValue<TAddressCountryData>(countryDataAttribute);

  const handleDialingCodePickerInputBlur: TInputFocusEventHandler = (e) => {
    if (disabled || readOnly) return;
    if (!isDialingCodePickerOpen) {
      // If pra não rodar o validate em duas situações:
      // - no momento do pick
      // - ao iniciar navegação no picker (próximo mês, por exemplo)
      handleInputBlur(e);
    }
  };

  const handleDialingCodePickerPick: TComboOrSuggestBase['handlePick'] = ({dataListItemExtra}) => {
    const extraData = jsonParse<TAddressCountryData>(dataListItemExtra);
    setCountryData(extraData);
    refHtmlInput.current?.focus(); // Para acionar o validate no blur
    setIsDialingCodePickerOpen(false);
  };

  const handleDialingCodePickerButtonMouseDown: TButtonMouseEventHandler = (e) => {
    if (disabled || readOnly) return;
    e.preventDefault(); // Previne acionar o validate
    e.stopPropagation(); // Previne acionar o handleDatePickerOutsideClick
    refHtmlInput.current?.focus(); // Para acionar o validate no blur
    setIsDialingCodePickerOpen((prevDatePickerOpen) => !prevDatePickerOpen);
  };

  const handleDialingCodePickerOutsideClick = useCallback(() => {
    setIsDialingCodePickerOpen(false);
  }, []);

  return {
    dialingCodeCountryData: countryData,
    handleDialingCodePickerButtonMouseDown,
    handleDialingCodePickerInputBlur,
    handleDialingCodePickerOutsideClick,
    handleDialingCodePickerPick,
    isCountryHome: !countryData || countryData.id === HOME_COUNTRY_DATA.id,
    isDialingCodePickerOpen,
  };
}
