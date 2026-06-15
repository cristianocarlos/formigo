import {PhoneIcon} from 'lucide-react';
import {useEffect} from 'react';

import CheckSwitch from '@/lib/components/check/CheckSwitch';
import ComboSelect from '@/lib/components/combo-or-suggest/ComboSelect';
import Hidden from '@/lib/components/Hidden';
import PhoneInput from '@/lib/components/phone-input/PhoneInput';
import TextInput from '@/lib/components/text-input/TextInput';
import {getPhoneTypeOptions, PHONE_CONTACT, PHONE_GROUP_KEYS, PHONE_HOME, PHONE_WORK} from '@/lib/utils/phoneHelper';
import {
  useDispatchFormigoAttrSetValue,
  useSelectorFormigoAttrValue,
  useStoreFormigoAttrGetValue,
} from '@/lib/zustand/hooks';
import {valueAsNumber} from '@/utils/helper';
import YiiLang from '@/utils/yii-lang';

import PhoneGroupElementRowWhatsapp from './PhoneGroupElementRowWhatsapp';

import type {TAddressCountryData} from '@/lib/types/address';
import type {TInputGroupChildrenProps, TPhoneGroupProps} from '@/lib/types/inputGroup';

type TProps = TInputGroupChildrenProps &
  Pick<
    TPhoneGroupProps,
    'additionalInputs' | 'countryXhrUrl' | 'disabled' | 'externalCountryData' | 'printMode' | 'readOnly' | 'required'
  > & {
    className?: string;
  };

function isLandline(typeId: number) {
  return typeId === PHONE_HOME || typeId === PHONE_WORK || typeId === PHONE_CONTACT;
}

export default function PhoneGroupElementRow(props: TProps) {
  const {
    additionalInputs,
    className = '',
    countryXhrUrl,
    disabled,
    externalCountryData,
    itemAttribute,
    printMode,
    readOnly,
    required,
  } = props;

  const typeId = useSelectorFormigoAttrValue(itemAttribute.concat([PHONE_GROUP_KEYS.type]));
  const hasType = additionalInputs ? additionalInputs.includes(PHONE_GROUP_KEYS.type) : false;

  const numberGetValue = useStoreFormigoAttrGetValue(itemAttribute.concat([PHONE_GROUP_KEYS.number]));
  const countryDataSetValue = useDispatchFormigoAttrSetValue<TAddressCountryData>(
    itemAttribute.concat([PHONE_GROUP_KEYS.countryData]),
  );

  useEffect(() => {
    // Usado quando a seleção do país é fora do telefone (ex endereço)
    // Muda quando:
    //   existir a key country_data
    //   não houver número informado (alguém já passou por aqui, melhor não intervir)
    //   houver valor no externalCountryData (quando há valor é porque algum componente externo está enviando)
    if (countryXhrUrl && !numberGetValue() && externalCountryData) countryDataSetValue(externalCountryData);
  }, [countryDataSetValue, externalCountryData, numberGetValue, countryXhrUrl]);

  const renderCountryDataHiddens = () => {
    if (printMode) return;
    if (!countryXhrUrl) return;
    return (
      <>
        <Hidden attribute={itemAttribute.concat([PHONE_GROUP_KEYS.countryData, 'dialing_code'])} />
        <Hidden attribute={itemAttribute.concat([PHONE_GROUP_KEYS.countryData, 'id'])} />
        <Hidden attribute={itemAttribute.concat([PHONE_GROUP_KEYS.countryData, 'iso2_id'])} />
      </>
    );
  };

  const renderExtensionInput = () => {
    if (!additionalInputs) return;
    if (!additionalInputs.includes(PHONE_GROUP_KEYS.extension)) return;
    if (hasType) {
      // Sem o campo tipo na tela, não tem como checar se é celular, tem que mostrar sempre
      if (!typeId) return;
      if (!isLandline(valueAsNumber(typeId))) return;
    }
    return (
      <TextInput
        attribute={itemAttribute.concat([PHONE_GROUP_KEYS.extension])}
        disabled={disabled}
        label={null}
        placeholder={YiiLang.formigo('labelFormPhoneGroupExtension')}
        printMode={printMode}
        readOnly={readOnly}
      />
    );
  };

  const renderMainCheck = () => {
    if (!additionalInputs) return;
    if (!additionalInputs.includes(PHONE_GROUP_KEYS.isMain)) return;
    return (
      <CheckSwitch
        attribute={itemAttribute.concat([PHONE_GROUP_KEYS.isMain])}
        disabled={disabled}
        label={YiiLang.formigo('labelFormPhoneGroupMain')}
        printMode={printMode}
        readOnly={readOnly}
      />
    );
  };

  const renderRestrictCheck = () => {
    if (!additionalInputs) return;
    if (!additionalInputs.includes(PHONE_GROUP_KEYS.isRestrict)) return;
    return (
      <CheckSwitch
        attribute={itemAttribute.concat([PHONE_GROUP_KEYS.isRestrict])}
        disabled={disabled}
        label={YiiLang.formigo('labelFormPhoneGroupRestrict')}
        printMode={printMode}
        readOnly={readOnly}
      />
    );
  };

  const renderTypeComboBox = () => {
    if (!additionalInputs) return;
    if (!additionalInputs.includes(PHONE_GROUP_KEYS.type)) return;
    return (
      <ComboSelect
        attribute={itemAttribute.concat([PHONE_GROUP_KEYS.type])}
        disabled={disabled}
        label={null}
        options={getPhoneTypeOptions()}
        placeholder={'-- ' + YiiLang.formigo('labelFormPhoneGroupType') + ' --'}
        printMode={printMode}
        readOnly={readOnly}
      />
    );
  };

  const renderWhatsappTargetLink = () => {
    if (printMode) return;
    if (!additionalInputs) return;
    if (!additionalInputs.includes(PHONE_GROUP_KEYS.whatsappLink)) return;
    if (hasType) {
      // Sem o campo tipo na tela, não tem como checar se é celular, tem que mostrar sempre
      if (!typeId) return;
      if (isLandline(valueAsNumber(typeId))) return;
    }
    return <PhoneGroupElementRowWhatsapp className={``} itemAttribute={itemAttribute} />;
  };

  return (
    <div className={className}>
      <div className={`${countryXhrUrl ? 'w-52 max-sm:w-58' : 'w-44 max-sm:w-50'} flex-none!`}>
        {renderCountryDataHiddens()}
        <PhoneInput
          attribute={itemAttribute.concat([PHONE_GROUP_KEYS.number])}
          countryDataParams={
            countryXhrUrl
              ? {
                  attribute: itemAttribute.concat([PHONE_GROUP_KEYS.countryData]),
                  xhrUrl: countryXhrUrl,
                }
              : undefined
          }
          disabled={disabled}
          iconElement={<PhoneIcon />}
          label={null}
          printMode={printMode}
          readOnly={readOnly}
          required={required}
        />
      </div>
      {renderTypeComboBox()}
      {renderMainCheck()}
      {renderExtensionInput()}
      {renderRestrictCheck()}
      {renderWhatsappTargetLink()}
    </div>
  );
}
