import {HOME_COUNTRY_DATA} from '@/lib/utils/phoneHelper';

import type {TAddressCountryData} from '@/lib/types/address';
import type {TButtonMouseEventHandler} from '@/types/common';
import type {CSSProperties} from 'react';

type TProps = {
  countryData?: TAddressCountryData;
  disabled?: boolean;
  handleMouseDown: TButtonMouseEventHandler;
  style: CSSProperties;
};

export default function PhoneInputDialingCodePrepend(props: TProps) {
  const {countryData, disabled, handleMouseDown, style} = props;
  const dialingCode = countryData?.dialing_code || HOME_COUNTRY_DATA.dialing_code;
  const iso2Id = countryData?.iso2_id || HOME_COUNTRY_DATA.iso2_id;
  return (
    <div className="absolute top-0 left-0 flex h-full" style={style}>
      <button
        className="flex size-full items-center gap-1"
        disabled={disabled}
        onMouseDown={handleMouseDown}
        tabIndex={-1}
        type="button"
      >
        <img alt="" className="aspect-4/3 w-4" src={'//flagcdn.com/' + iso2Id + '.svg'} />
        <span className="text-sm text-gray-400">{'+' + dialingCode}</span>
      </button>
    </div>
  );
}
