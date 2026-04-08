import QRCode from 'qrcode';

/**
 * 解析 /api/order/pay/:id 等业务返回，区分「直接成功」与「需展示收款码」等形态（兼容多种字段名）
 * @param {*} data axios 拦截器已脱壳后的 data
 * @returns {{ kind: 'success' } | { kind: 'qr_image', imageSrc: string } | { kind: 'qr_content', content: string } | { kind: 'unknown' }}
 */
export function parsePayOrderResult(data) {
  if (!data || typeof data !== 'object') return { kind: 'unknown' };

  const paid =
    data.paid === true ||
    data.paySuccess === true ||
    data.success === true;
  const st = data.orderStatus ?? data.status ?? data.payStatus;
  const stNum = Number(st);
  const paidByStatus =
    st === 'paid' ||
    st === 'success' ||
    (Number.isFinite(stNum) && (stNum === 1 || stNum === 2));

  if (paid || paidByStatus) {
    return { kind: 'success' };
  }

  const nested = data.data && typeof data.data === 'object' ? data.data : null;
  const payment =
    data.payment && typeof data.payment === 'object'
      ? data.payment
      : nested?.payment && typeof nested.payment === 'object'
        ? nested.payment
        : null;
  const pick = (k) =>
    data[k] ?? (nested && nested[k]) ?? (payment && payment[k]);

  const codeUrl = pick('codeUrl') ?? pick('code_url');
  const qrCode = pick('qrCode') ?? pick('qr_code');

  if (typeof qrCode === 'string') {
    if (qrCode.startsWith('data:image')) {
      return { kind: 'qr_image', imageSrc: qrCode };
    }
    if (/^https?:\/\//i.test(qrCode)) {
      return { kind: 'qr_image', imageSrc: qrCode };
    }
  }

  const text =
    (typeof codeUrl === 'string' && codeUrl) ||
    (typeof qrCode === 'string' && qrCode && !/^https?:\/\//i.test(qrCode) ? qrCode : '') ||
    '';

  if (text) {
    return { kind: 'qr_content', content: text };
  }

  return { kind: 'unknown' };
}

/**
 * 将微信 Native 等的链接字符串转为 PNG Data URL，供 img 展示
 * @param {string} content
 * @returns {Promise<string>}
 */
export function qrContentToDataUrl(content) {
  return QRCode.toDataURL(content, {
    margin: 2,
    width: 240,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#ffffff' },
  });
}

/**
 * 从订单对象判断是否已支付（待支付一般为 0）
 * @param {*} order unwrapOrderPayload 之后
 * @returns {boolean}
 */
export function isOrderPaid(order) {
  if (!order || typeof order !== 'object') return false;
  const st = Number(order.status ?? order.orderStatus);
  // 与 OrderStatusEnum：支付成功后为 ON_RENT(1)，完结为 FINISHED(2)
  return Number.isFinite(st) && (st === 1 || st === 2);
}
