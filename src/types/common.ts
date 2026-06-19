import type {TDBJsonString} from '@/types/db-schema';
import type {TCountryDTO, TPhoneDTO} from '@/types/dto';
import type {TsAllToString, TsOverride} from '@/types/helper';
import type {
  ChangeEventHandler,
  ClipboardEventHandler,
  FocusEvent,
  FocusEventHandler,
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler as ReactMouseEventHandler,
  SyntheticEvent,
} from 'react';

//
type TEnhancedKeyboardEvent<G> = KeyboardEvent<G> & {
  keyCode: number;
};
export type TInputBeforeInputEvent = SyntheticEvent<HTMLInputElement> & {
  data?: string;
  key?: string;
};

//
type TButtonMouseEvent = ReactMouseEvent<HTMLButtonElement>;
export type TButtonMouseEventHandler = ReactMouseEventHandler<HTMLButtonElement>;
export type TFormigoSubmitEvent = TButtonMouseEvent;
export type TFormigoSubmitEventHandler = TButtonMouseEventHandler;

export type TInputChangeEventHandler = ChangeEventHandler<HTMLInputElement>;
export type TInputClipboardEventHandler = ClipboardEventHandler<HTMLInputElement>;
export type TInputFocusEventHandler = FocusEventHandler<HTMLInputElement>;
export type TInputKeyboardEventHandler = KeyboardEventHandler<HTMLInputElement>;
export type TInputMouseEventHandler = ReactMouseEventHandler<HTMLInputElement>;
export type TInputOrTextAreaFocusEventHandler = (
  e: FocusEvent<HTMLInputElement> & FocusEvent<HTMLTextAreaElement>,
) => void;
export type TTextAreaChangeEventHandler = ChangeEventHandler<HTMLTextAreaElement>;
//
export type TArrayKey = Array<string>;
export type TDottedKey = string;
export type TFormattedDate = string;
export type TFormattedDateHour = string;
export type TLanguage = 'en' | 'es' | 'pt_BR';
export type TLinkMouseEventHandler = ReactMouseEventHandler;
export type TFormCountryData = TsAllToString<TCountryDTO>;
export type TFormPhoneData = TsOverride<
  TsAllToString<TPhoneDTO>,
  {
    country_data?: TFormCountryData;
  }
>;
export type TCountryOptionRows = Array<{
  data_list_item_extra: TDBJsonString;
  id: string;
  label: string;
}>;
export type TQueryStringValue = null | number | string | undefined;
export type TQueryStringData = Record<string, TQueryStringValue>;

export type TLabelMouseEventHandler = ReactMouseEventHandler<HTMLLabelElement>;
export type TLiKeyboardEvent = TEnhancedKeyboardEvent<HTMLLIElement>;
export type TLiMouseEvent = ReactMouseEvent<HTMLLIElement>;
