import {FormLegend} from '@/lib/components/FormTitle';

import type {ReactNode} from 'react';

type TFormSectionProps = {
  children: ReactNode;
  className?: string;
  title?: string;
};

export default function FormSection({children, className = '', title}: TFormSectionProps) {
  // min-w-auto:
  // no chrome, o default para o fieldset é min-width: -webkit-min-content
  // isso impede a quebra de linha contínua no draft-js, por exemplo
  //
  // pb-6:
  // pb-6 no lugar de pb-8 pra compensar a margem de (mb-4/16px) nos elementos do form
  //
  // flex flex-col
  // para o legend se comportar como elemento block. precisa float-left no legend
  return (
    <fieldset
      className={`mb-4 flex min-w-auto flex-col rounded-lg bg-white p-10 pb-6 shadow-lg max-sm:p-4 max-sm:pb-0 ${className}`}
    >
      {title ? <FormLegend className="float-left mb-8 max-sm:mb-4">{title}</FormLegend> : undefined}
      {children}
    </fieldset>
  );
}
