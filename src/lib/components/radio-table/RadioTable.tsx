import FieldsetWrapper from '@/lib/components/FieldsetWrapper';
import RadioOption from '@/lib/components/radio-group/options/RadioOption';
import EmptyValueHidden from '@/lib/components/radio-table/EmptyValueHidden';
import useHtmlProps from '@/lib/utils/useHtmlProps';
import useValidators, {VALIDATION_TYPES} from '@/lib/utils/useValidators';
import {radioTableColsUniqueValidator, radioTableRowsCompleteValidator} from '@/lib/utils/validators';
import {
  useDispatchFormigoInputPrepare,
  useSelectorFormigoAttrValue,
  useSelectorFormigoInputReadyValue,
} from '@/lib/zustand/hooks';
import {valueAsString} from '@/utils/helper';
import {useDidMountEffect} from '@/utils/hooks';

import useRadioTableHandlers from './useRadioTableHandlers';

import type {TRadioTableProps, TRadioTableValues} from '@/lib/types/checkTableOrRadioTable';

export default function RadioTable(props: TRadioTableProps) {
  const {
    attribute,
    className = '',
    cols,
    colsUnique,
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
    rowsComplete,
    validateOnlyOnSubmit,
    validators,
  } = props;

  /**
   * HANDLERS
   */

  const {handleInputChange, handleInputClick} = useRadioTableHandlers({
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

  const resolvedValidators = validators || [];

  useDidMountEffect(() => {
    if (colsUnique) {
      resolvedValidators.push(radioTableColsUniqueValidator({attribute}));
    }
    if (rowsComplete) {
      resolvedValidators.push(radioTableRowsCompleteValidator({attribute, rows}));
    }
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
    resolvedValidators,
  );

  /**
   * COMPONENT
   */

  const attrValue = useSelectorFormigoAttrValue<TRadioTableValues>(attribute);

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
                  const isChecked = attrValue?.[rowId] === colId;
                  let resolvedName: string | undefined = `${initProps.name}[${rowId}]`;
                  const hasHiddenChecked = readOnly && isChecked;
                  const hiddenCheckedElement = hasHiddenChecked ? (
                    <input disabled={disabled || printMode} name={resolvedName} type="hidden" value={colId} />
                  ) : undefined;
                  if (!attrValue || hasHiddenChecked) {
                    // undefined pra não dar pau no node
                    // Quando não tiver attrValue é criado um EmtyValueHidden e os checks não podem ter nome
                    // Quando existir o hiddenChecked tira nome dos checks
                    resolvedName = undefined;
                  }
                  return (
                    <td className="border border-gray-200 p-2" key={colId}>
                      {hiddenCheckedElement}
                      <RadioOption
                        checked={isChecked}
                        disabled={disabled || printMode || readOnly}
                        id={id}
                        label={null}
                        name={resolvedName}
                        onChange={handleInputChange(rowId)}
                        onClick={handleInputClick(rowId)}
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
      role="radiogroup"
    >
      <EmptyValueHidden {...props} inputName={initProps.name} />
      {renderOptions()}
    </FieldsetWrapper>
  );
}
