import TargetLink from '@/components/TargetLink';
import WhatsappIcon from '@/components/WhatsappIcon';
import {resolveReplacementWhatsappSendUrl} from '@/lib/utils/phoneHelper';
import YiiLang from '@/utils/yii-lang';

export default function WhatsappLink({href}: {href?: string}) {
  return (
    <span className={`inline-flex gap-1`}>
      <TargetLink
        disabled={!href}
        href={resolveReplacementWhatsappSendUrl(href)}
        target="_blank"
        title={YiiLang.formigo('Enviar para o número informado, sem o nono dígito')}
      >
        <WhatsappIcon className="size-3!" />
      </TargetLink>
      <TargetLink
        disabled={!href}
        href={href}
        target="_blank"
        title={YiiLang.formigo('Enviar para o número informado')}
      >
        {YiiLang.formigo('labelFormPhoneGroupWhatsapp')}
      </TargetLink>
    </span>
  );
}
