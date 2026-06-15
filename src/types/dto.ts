export type TAddressDTO = {
  city: number;
  city_desc: string;
  complement?: string;
  line1: string;
  line2?: string;
  number?: string;
  zip_code?: string;
};
export type TCountryDTO = {dialing_code: string; id: string; iso2_id: string};
export type TPhoneDTO = {
  country_data?: TCountryDTO;
  extension?: string;
  id: number;
  is_main?: boolean;
  is_restrict?: boolean;
  number: string;
  type?: number;
  type_desc?: string;
};
