import {debounce as esToolkitDebounce} from 'es-toolkit/function';

import {useFormigoContext} from '@/lib/utils/withContext';
import {useDispatchFormigoSubmitValidate, useStoreFormigoSubmitErrorsGetValue} from '@/lib/zustand/hooks';
import YiiLang from '@/utils/yii-lang';

import type {TFormigoSubmitEvent} from '@/types/common';

export const preventDoubleSubmissionDebounce = esToolkitDebounce((target: HTMLButtonElement) => {
  target.disabled = false;
  target.title = '';
}, 5000);

function prepareSubmit(e?: TFormigoSubmitEvent) {
  let skipValidate = false;
  if (e) {
    e.preventDefault();
    const target = e.target as HTMLButtonElement; // Botão clicado (ou acionado pelo ENTER)
    target.focus(); // Precisa focar o botão (não foca em caso de ENTER) pra acionar o blur dos inputs e acionar as validações
    // preventDoubleSubmission
    target.disabled = true; // previne a dupla submissão do form
    target.title = YiiLang.formigo('hintFormProcessing');
    preventDoubleSubmissionDebounce(target);
    skipValidate = !!target.dataset.skipValidate;
  }
  return skipValidate;
}

export function customActionSubmit(formDom: HTMLFormElement, action: string) {
  const previousAction = formDom.action.replace(window.location.protocol + '//' + window.location.hostname, '');
  formDom.setAttribute('action', action);
  formDom.submit();
  formDom.setAttribute('action', previousAction);
}

/**
 * Primeiro estágio do submit, validação
 * Pode ser chamado na aplicação para enviar um form de maneira nativa, com formDom.submit()
 */
export function useHandleValidateSubmit() {
  const submitValidate = useDispatchFormigoSubmitValidate();
  const submitErrorsGetValue = useStoreFormigoSubmitErrorsGetValue();
  return async (e: TFormigoSubmitEvent) => {
    const skipValidate = prepareSubmit(e);
    const formDom = e.currentTarget.form;
    if (!formDom) {
      throw new Error('e.currentTarget.form cant be null');
    }
    return new Promise((resolve) => {
      if (!skipValidate) submitValidate(formDom.id); // Demora um pouco pra calcular os erros
      resolve(undefined);
    }).then(() => {
      let submitErrorsCount = 0;
      if (!skipValidate) {
        const submitErrors = submitErrorsGetValue(formDom.id);
        if (submitErrors) submitErrorsCount = Object.keys(submitErrors).length;
      }
      if (submitErrorsCount === 0) return Promise.resolve(formDom);
      return Promise.reject(new Error('[forms] input with errors: ' + submitErrorsCount + ', handled by application'));
    });
  };
}

/**
 * Segundo estágio do submit, envio dos dados usando fetch
 * Pode ser chamado na aplicação para uso do responseData sem o tratamento do responseData.feedback
 */
export function useHandleFetchSubmit() {
  const {xhrActions} = useFormigoContext();
  const handleValidateSubmit = useHandleValidateSubmit();
  return async <GContent>(e: TFormigoSubmitEvent, abortSignal?: AbortSignal) => {
    return handleValidateSubmit(e).then(async (formDom) => {
      return xhrActions.formSubmit<GContent>(formDom, abortSignal);
    });
  };
}
