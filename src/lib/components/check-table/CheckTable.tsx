import BoxOption from '@/lib/components/check/options/BoxOption';
import FieldsetWrapper from '@/lib/components/FieldsetWrapper';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {valueAsString} from '@/utils/helper';
import {useDidMountEffect} from '@/utils/hooks';

import EmptyValueHidden from './EmptyValueHidden';
import useCheckTableHandlers from './useCheckTableHandlers';

import type {TCheckTableProps, TCheckTableValues} from '@/lib/types/checkTableOrRadioTable';

export default function CheckTable(props: TCheckTableProps) {
  const {
    attribute,
    className = '',
    cols,
    disabled,
    forceValidateOnSubmit,
    handleChange,
    initValue,
    label,
    printMode,
    readOnly,
    refComponent,
    required,
    rows,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange} = useCheckTableHandlers({
    attribute,
    disabled,
    handleChange,
    readOnly,
    refComponent,
    validateOnlyOnSubmit,
  });

  /**
   * INIT
   */

  const initProps = useHtmlProps({attribute});

  const inputPrepare = useDispatchFormigoInputPrepare(attribute);
  const isReady = useSelectorFormigoInputReadyValue(attribute);

  useDidMountEffect(() => {
    inputPrepare(initValue);
  });

  /**
   * VALIDATORS
   */

  useValidators(
    {
      attribute,
      disabled,
      forceValidateOnSubmit,
      readOnly,
      required,
      validationType: VALIDATION_TYPES.radioTable,
    },
    validators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue<TCheckTableValues>(attribute);

  if (!isReady) return;

  const renderOptions = () => {
    return (
      <table className="w-full">
        <thead>
          <tr>
            <td className="border border-gray-200" />
            {cols.map((colData) => {
              return (
                <td className="border border-gray-200 p-2 text-xs text-gray-600" key={colData.id}>
                  {colData.label}
                </td>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((rowData) => {
            const rowId = valueAsString(rowData.id);
            return (
              <tr key={rowId}>
                <td className="border border-gray-200 p-2 text-gray-600">{rowData.label}</td>
                {cols.map((colData) => {
                  const colId = valueAsString(colData.id);
                  const id = `${initProps.id}_${rowId}_${colId}`;
                  const name = `${initProps.name}[${rowId}][${colId}]`;
                  const checkedValue = attrValue && attrValue[rowId] && attrValue[rowId][colId];
                  return (
                    <td className="border border-gray-200 p-2" key={colId}>
                      <BoxOption
                        checked={checkedValue === colId}
                        dataType="check-table"
                        disabled={disabled || printMode || readOnly}
                        hiddenElement={undefined}
                        id={id}
                        key={colId}
                        label={null}
                        name={name}
                        onChange={handleInputChange(rowId, colId)}
                        value={colId}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <FieldsetWrapper
      attribute={attribute}
      className={`${printMode ? 'grayscale-100' : ''} ${className}`}
      legend={label}
      role="listbox"
    >
      <EmptyValueHidden {...props} inputName={initProps.name} />
      {renderOptions()}
    </FieldsetWrapper>
  );
}
