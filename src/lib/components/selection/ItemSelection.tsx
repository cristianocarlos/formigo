import ComboBox from '@/lib/components/combo-or-suggest/ComboBox';
import Hidden from '@/lib/components/Hidden';
import Selection from '@/lib/components/selection/Selection';

import type {TFormigoAttribute} from '@/lib/types/formigo';

type TItemSelectionProps = {
  attribute: TFormigoAttribute;
  className?: string;
  label?: null | string;
  xhrUrl: string;
};

export default function ItemSelection(props: TItemSelectionProps) {
  const {attribute, className, label, xhrUrl} = props;
  return (
    <Selection attribute={attribute} className={className}>
      <Selection.Chooser
        renderer={({chooserAttribute, handleAdd}) => {
          return (
            <ComboBox
              attribute={chooserAttribute}
              handlePick={(pickedData) => {
                handleAdd({id: pickedData.value || '', label: pickedData.comboOptionLabel || ''});
              }}
              label={label}
              resetValueOnPick={true}
              xhrUrl={xhrUrl}
            />
          );
        }}
      />
      <Selection.Rows
        renderer={({data, rowAttribute}) => {
          return (
            <>
              <Hidden attribute={[...rowAttribute, 'id']} value={data.id} />
              <Hidden attribute={[...rowAttribute, 'label']} value={data.label} />
              <div className="flex items-center gap-1">
                {data.label}
                <span className="text-[0.5em] text-gray-600">{data.id}</span>
              </div>
            </>
          );
        }}
      />
    </Selection>
  );
}
