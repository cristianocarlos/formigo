// import './styles.css'; // não funciona essa bosta

import Address from './lib/components/address/Address';
import ButtonSet from './lib/components/ButtonSet';
import CheckGroup from './lib/components/check-group/CheckGroup';
import CheckTable from './lib/components/check-table/CheckTable';
import CheckBox from './lib/components/check/CheckBox';
import CheckSwitch from './lib/components/check/CheckSwitch';
import CloudflareTurnstile from './lib/components/CloudflareTurnstile';
import ComboBox from './lib/components/combo-or-suggest/ComboBox';
import ComboSelect from './lib/components/combo-or-suggest/ComboSelect';
import SuggestBox from './lib/components/combo-or-suggest/SuggestBox';
import SuggestSelect from './lib/components/combo-or-suggest/SuggestSelect';
import DateHourInput from './lib/components/date-input/DateHourInput';
import DateInput from './lib/components/date-input/DateInput';
import DeleteButton from './lib/components/DeleteButton';
import FormSection from './lib/components/FormSection';
import {FormHeading} from './lib/components/FormTitle';
import Hidden from './lib/components/Hidden';
import InputGroup from './lib/components/input-group/InputGroup';
import CpfInput from './lib/components/masked-input/CpfInput';
import CurrencyInput from './lib/components/masked-input/CurrencyInput';
import FloatInput from './lib/components/masked-input/FloatInput';
import IntegerInput from './lib/components/masked-input/IntegerInput';
import PasswordInput from './lib/components/password-input/PasswordInput';
import PhoneGroup from './lib/components/phone-group/PhoneGroup';
import QuickSearch from './lib/components/quick-search/QuickSearch';
import RadioGroup from './lib/components/radio-group/RadioGroup';
import RadioTable from './lib/components/radio-table/RadioTable';
import ItemSelection from './lib/components/selection/ItemSelection';
import Selection from './lib/components/selection/Selection';
import SubmitButton from './lib/components/SubmitButton';
import TextArea from './lib/components/text-area/TextArea';
import EmailInput from './lib/components/text-input/EmailInput';
import TextInput from './lib/components/text-input/TextInput';
import Formigo from './lib/Formigo';
import FormigoBootstrap from './lib/FormigoBootstrap';
import {CHECK_BOOL_TRUE} from './lib/utils/checkOrRadio';
import {PHONE_GROUP_KEYS} from './lib/utils/phoneHelper';
import {useHandleFetchSubmit} from './lib/utils/submitHooks';
import {passwordRepeatValidator} from './lib/utils/validators';
import {useFormigoContextIsNewRecord, useFormigoContextModelValues} from './lib/utils/withContext';
import {
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoProduceFormState,
  useSelectorFormigoAttrIsChecked,
  useSelectorFormigoAttrValue,
  useStoreFormigoAttrGetValue,
} from './lib/zustand/hooks';
import {zustandFormigoGetData, zustandFormigoInputSetServerErrors} from './lib/zustand/store';

import type {TDeleteButtonProps} from './lib/components/DeleteButton';
import type {TFormigoProps} from './lib/Formigo';
import type {TAddressProps} from './lib/types/address';
import type {
  TCheckGroupDerivableOptionsResolverParams,
  TCheckGroupProps,
  TCheckGroupValue,
} from './lib/types/checkGroup';
import type {TComboBoxProps} from './lib/types/comboOrSuggest';
import type {
  TFormigoAttribute,
  TFormigoFormFeatures,
  TFormigoValidatorBaseCallerProps,
  TFormigoValidatorGetAttrValue,
} from './lib/types/formigo';
import type {TCurrencyInputProps, TInputRefComponent} from './lib/types/input';
import type {
  TRadioGroupDerivableOptionsResolverParams,
  TRadioGroupProps,
  TRadioGroupValue,
} from './lib/types/radioGroup';
import type {TFormigoSubmitEvent, TFormigoSubmitEventHandler} from './types/common';

export {
  Address,
  ButtonSet,
  CHECK_BOOL_TRUE,
  CheckBox,
  CheckGroup,
  CheckSwitch,
  CheckTable,
  CloudflareTurnstile,
  ComboBox,
  ComboSelect,
  CpfInput,
  CurrencyInput,
  DateHourInput,
  DateInput,
  DeleteButton,
  EmailInput,
  FloatInput,
  FormHeading,
  FormigoBootstrap,
  FormSection,
  Hidden,
  InputGroup,
  IntegerInput,
  ItemSelection,
  PasswordInput,
  passwordRepeatValidator,
  PHONE_GROUP_KEYS,
  PhoneGroup,
  QuickSearch,
  RadioGroup,
  RadioTable,
  Selection,
  SubmitButton,
  SuggestBox,
  SuggestSelect,
  TextArea,
  TextInput,
  useDispatchFormigoAttrSetValue,
  useDispatchFormigoProduceFormState,
  useFormigoContextIsNewRecord,
  useFormigoContextModelValues,
  useHandleFetchSubmit,
  useSelectorFormigoAttrIsChecked,
  useSelectorFormigoAttrValue,
  useStoreFormigoAttrGetValue,
  zustandFormigoGetData,
  zustandFormigoInputSetServerErrors,
};
export type {
  TAddressProps,
  TCheckGroupDerivableOptionsResolverParams,
  TCheckGroupProps,
  TCheckGroupValue,
  TComboBoxProps,
  TCurrencyInputProps,
  TDeleteButtonProps,
  TFormigoAttribute,
  TFormigoFormFeatures,
  TFormigoProps,
  TFormigoSubmitEvent,
  TFormigoSubmitEventHandler,
  TFormigoValidatorBaseCallerProps,
  TFormigoValidatorGetAttrValue,
  TInputRefComponent,
  TRadioGroupDerivableOptionsResolverParams,
  TRadioGroupProps,
  TRadioGroupValue,
};

export default Formigo;
