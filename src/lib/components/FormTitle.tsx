import {createElement} from 'react';

import type {ReactNode} from 'react';

type TBaseProps = {children: ReactNode; className?: string};
type TTitleProps = TBaseProps & {tagName: string};

function TitleElement({children, className, tagName}: TTitleProps) {
  return createElement(tagName, {className}, children);
}

function Title({children, className, tagName}: TTitleProps) {
  return (
    <TitleElement className={`flex items-center gap-2 ${className}`} tagName={tagName}>
      <hr className="w-2 flex-none border-gray-300" />
      <abbr className="bg-white">{children}</abbr>
      <hr className="flex-1 border-gray-300" />
    </TitleElement>
  );
}

export function FormLegend({children, className = ''}: TBaseProps) {
  return (
    <Title className={`text-sm font-medium tracking-widest text-gray-400 uppercase ${className}`} tagName="legend">
      {children}
    </Title>
  );
}

export function FormHeading({children, className = '', importance = 4}: TBaseProps & {importance?: number}) {
  return (
    <Title className={`mb-4 text-xs tracking-wide text-gray-400 uppercase ${className}`} tagName={`h${importance}`}>
      {children}
    </Title>
  );
}
