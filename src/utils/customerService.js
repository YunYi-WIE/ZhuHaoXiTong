import { showDialog, showImagePreview } from 'vant';
import { useSiteBrandingStore } from '@/stores/siteBranding';

/** 预约租号 / 联系客服：优先展示后台配置的二维码，否则弹窗展示微信号说明 */
export function openCustomerService() {
  const s = useSiteBrandingStore();
  const qr = (s.customerQrUrl || '').trim();
  const wx = (s.customerWechat || '').trim();
  if (qr) {
    showImagePreview([qr]);
    return;
  }
  showDialog({
    title: '联系客服',
    message: wx || '请通过「消息」或订单页联系平台客服。',
    confirmButtonText: '知道了',
  });
}
