import {useRef} from 'react';

import {ADDRESS_KEYS} from '@/lib/utils/helper';
import {sanitizeOneLevelObject} from '@/lib/utils/sanitize';
import {useFormigoContext} from '@/lib/utils/withContext';
import {
  useDispatchFormigoAttrObjectMergeValue,
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoHandFillSetValue,
  useDispatchFormigoInputResetErrors,
  useDispatchFormigoLoadingSetValue,
} from '@/lib/zustand/hooks';

import type {TAddressProps, TAddressValue} from '@/lib/types/address';
import type {TAddressDTO} from '@/types/dto';

type TUseAddressHandlers = Pick<
  TAddressProps,
  'attribute' | 'disabled' | 'readOnly' | 'refComponent' | 'zipCodeXhrUrl'
> & {
  getEmptyValue: () => TAddressValue;
};

export default function useAddressHandlers(params: TUseAddressHandlers) {
  const {attribute, disabled, getEmptyValue, readOnly, refComponent, zipCodeXhrUrl} = params;

  const abortControllerRef = useRef<AbortController>(new AbortController());

  const {xhrActions} = useFormigoContext();

  const attrObjectMergeValue = useDispatchFormigoAttrObjectMergeValue(attribute);
  const attrSetValue = useDispatchFormigoAttrSetValue<TAddressValue>(attribute);
  const handFillSetValue = useDispatchFormigoHandFillSetValue(attribute);
  const inputResetErrors = useDispatchFormigoInputResetErrors(null);
  const setLoadingValue = useDispatchFormigoLoadingSetValue([...attribute, ADDRESS_KEYS.zipCode]);

  const resetError = () => {
    const emptyValue = getEmptyValue();
    Object.keys(emptyValue).forEach((itemKey) => {
      inputResetErrors([...attribute, itemKey]);
    });
  };

  const replaceValue = (value?: TAddressValue) => {
    attrSetValue(value);
  };

  const resetValue = () => {
    replaceValue(undefined);
  };

  const handleZipCodeSearchCancel = () => {
    if (abortControllerRef.current) {
      setLoadingValue(false);
      abortControllerRef.current.abort();
    }
  };

  const handleZipCodeSearch = (zipCode?: string) => {
    if (disabled || readOnly) return;
    if (!zipCode) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setLoadingValue(true);
    const url = `${zipCodeXhrUrl}?zipCode=${zipCode}`;
    xhrActions
      .dataGet<TAddressDTO & {error_message?: string}>(url, abortControllerRef.current.signal, 'address')
      .then((responseContent) => {
        const shouldHandFill = !!responseContent.error_message;
        handFillSetValue(responseContent.error_message);
        attrObjectMergeValue(
          sanitizeOneLevelObject({
            [ADDRESS_KEYS.city]: shouldHandFill ? undefined : responseContent[ADDRESS_KEYS.city],
            [ADDRESS_KEYS.cityDesc]: shouldHandFill ? undefined : responseContent[ADDRESS_KEYS.cityDesc],
            [ADDRESS_KEYS.complement]: shouldHandFill ? undefined : responseContent[ADDRESS_KEYS.complement],
            [ADDRESS_KEYS.line1]: shouldHandFill ? undefined : responseContent[ADDRESS_KEYS.line1],
            [ADDRESS_KEYS.line2]: shouldHandFill ? undefined : responseContent[ADDRESS_KEYS.line2],
            [ADDRESS_KEYS.number]: shouldHandFill ? undefined : responseContent[ADDRESS_KEYS.number],
          }),
        );
        setLoadingValue(false);
        resetError();
      })
      .catch(() => {
        setLoadingValue(false); // em caso de erro no servidor, para o loading
      });
  };

  if (refComponent) {
    refComponent.current = {
      replaceValue,
      resetError,
      resetValue,
    };
  }

  return {
    handleZipCodeSearch,
    handleZipCodeSearchCancel,
  };
}
