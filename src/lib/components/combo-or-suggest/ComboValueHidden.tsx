import Hidden from '@/lib/components/Hidden';

import type {TFormigoAttribute} from '@/lib/types/formigo';
import type {THiddenProps} from '@/lib/types/input';

type IPComboValueHidden = THiddenProps & {
  extraAttribute?: TFormigoAttribute;
  screenIdAttribute?: TFormigoAttribute;
};

export default function ComboValueHidden(props: IPComboValueHidden) {
  const {disabled, extraAttribute, screenIdAttribute, ...componentProps} = props;
  return (
    <>
      <Hidden {...componentProps} disabled={disabled} />
      {extraAttribute ? <Hidden attribute={extraAttribute} disabled={disabled} /> : undefined}
      {screenIdAttribute ? <Hidden attribute={screenIdAttribute} disabled={disabled} /> : undefined}
    </>
  );
}
