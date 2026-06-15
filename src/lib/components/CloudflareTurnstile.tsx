import {useEffect, useRef} from 'react';

import Hidden from '@/lib/components/Hidden';
import {useSelectorFormigoValidatorInputErrors} from '@/lib/zustand/hooks';
import {getLanguage} from '@/utils/globals';

import type {ComponentProps} from 'react';

type TProps = {
  handleSuccess?: Turnstile.RenderParameters['callback'];
  modelName?: string;
  siteKey: string;
  size?: 'compact' | 'flexible' | 'normal';
  url: string;
};

export default function CloudflareTurnstile({handleSuccess, modelName, siteKey, size = 'normal', url}: TProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<null | string>(undefined);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = () => {
      if (containerRef.current && !scriptLoadedRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          callback: handleSuccess,
          language: getLanguage().toLowerCase().replace('_', '-'),
          sitekey: siteKey,
          size,
          theme: 'light',
        });
        scriptLoadedRef.current = true;
      }
    };

    document.body.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      document.body.removeChild(script);
      scriptLoadedRef.current = false;
    };
  }, [handleSuccess, siteKey, size, url]);

  return <CloudflareTurnstileInput modelName={modelName} ref={containerRef} />;
}

function CloudflareTurnstileInput({modelName, ref}: ComponentProps<'div'> & {modelName?: string}) {
  // name hardcoded no CloudflareTurnstileTrait pra usar os validator no model
  // o hidden que envia o input é o cf-turnstile-response
  // obtido via Yii::$app->request->post('cf-turnstile-response') no métido traitGetCloudflareTurnstileResponse
  const name = 'cf_turnstile_response';
  const attribute = modelName ? [modelName, name] : [name];

  const inputErrors = useSelectorFormigoValidatorInputErrors(attribute);

  const errorMessage = inputErrors ? inputErrors.join('; ') : undefined;

  useEffect(() => {
    if (errorMessage) window.turnstile.reset();
  }, [errorMessage]);

  return (
    <div className="relative pb-2" ref={ref}>
      <Hidden attribute={attribute} value="1" />
      {errorMessage ? (
        <em className="absolute -bottom-1 font-[Arial] text-xs text-yellow-500 not-italic">{errorMessage}</em>
      ) : undefined}
    </div>
  );
}
