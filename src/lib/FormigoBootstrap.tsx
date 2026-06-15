import {useMemo, useState} from 'react';

import {sanitizeFormFeaturesValues} from '@/lib/utils/sanitize';
import {preventDoubleSubmissionDebounce} from '@/lib/utils/submitHooks';
import {FormigoContext} from '@/lib/utils/withContext';
import {useDispatchFormigoProduceStoreState} from '@/lib/zustand/hooks';
import {uniqueId} from '@/utils/helper';
import {useDidMountEffect, useWillUnmountEffect} from '@/utils/hooks';

import type {TFormigoFormFeatures, TFormigoXhrActions} from '@/lib/types/formigo';
import type {TFormigoContext} from '@/lib/utils/withContext';
import type {ReactNode} from 'react';

export type TFormigoBootstrapProps = {
  children?: ReactNode;
  formFeatures?: TFormigoFormFeatures;
  formId?: string;
  xhrActions: TFormigoXhrActions;
};

export default function FormigoBootstrap(props: TFormigoBootstrapProps) {
  const {children, formFeatures, formId: propFormId, xhrActions} = props;

  const [isReady, setIsReady] = useState(false);

  const formId = useMemo(() => propFormId || uniqueId(), [propFormId]);
  const recordId = formFeatures?.recordId || undefined;

  const produceStoreState = useDispatchFormigoProduceStoreState();

  const contextValues: TFormigoContext = {
    formId,
    recordId,
    recordValues: formFeatures?.values,
    xhrActions,
  };

  useDidMountEffect(() => {
    new Promise((resolve) => {
      produceStoreState((proxyState) => {
        proxyState[formId] = {
          attr: sanitizeFormFeaturesValues(formFeatures?.values),
        };
      });
      resolve(undefined);
    }).then(() => {
      setIsReady(true);
    });
  });

  useWillUnmountEffect(() => {
    produceStoreState((proxyState) => {
      delete proxyState[formId];
    });
    preventDoubleSubmissionDebounce.cancel();
  });

  if (!isReady) return;

  return <FormigoContext value={contextValues}>{children}</FormigoContext>;
}
