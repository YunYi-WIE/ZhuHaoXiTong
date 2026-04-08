/** 订单展示用：应付金额、标题、租期（兼容多种后端字段） */

function toNum(v) {
  if (v === undefined || v === null || v === '') return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function sumRentDeposit(obj) {
  if (!obj || typeof obj !== 'object') return NaN;
  const rent = toNum(obj.rent ?? obj.rentAmount);
  const dep = toNum(obj.deposit ?? obj.depositAmount);
  if (Number.isNaN(rent) && Number.isNaN(dep)) return NaN;
  return Math.max(0, rent || 0) + Math.max(0, dep || 0);
}

/**
 * 多次嵌套的 data，或详情聚合体 { order, timelines, disputes }，解析出真正的订单实体
 * @param {*} payload
 * @returns {Record<string, any>|null}
 */
export function unwrapOrderPayload(payload) {
  let o = payload;
  if (
    o &&
    typeof o === 'object' &&
    !Array.isArray(o) &&
    'code' in o &&
    (o.code == 200 || o.code == 0 || o.code == 1 || o.code == 20000) &&
    o.data != null &&
    typeof o.data === 'object' &&
    !Array.isArray(o.data) &&
    o.id == null &&
    o.orderNo == null &&
    o.order == null &&
    o.orderSn == null
  ) {
    o = o.data;
  }
  for (let i = 0; i < 6 && o && typeof o === 'object' && !Array.isArray(o); i++) {
    const nestedOrder = o.order;
    if (
      nestedOrder &&
      typeof nestedOrder === 'object' &&
      !Array.isArray(nestedOrder) &&
      (nestedOrder.id != null ||
        nestedOrder.orderNo != null ||
        nestedOrder.orderSn != null)
    ) {
      o = nestedOrder;
      continue;
    }

    const inner = o.data;
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      if (
        inner.id != null ||
        inner.orderNo != null ||
        inner.orderSn != null
      ) {
        o = inner;
        continue;
      }
      if (
        inner.order &&
        typeof inner.order === 'object' &&
        (inner.order.id != null || inner.order.orderNo != null)
      ) {
        o = inner;
        continue;
      }
    }

    break;
  }
  return o && typeof o === 'object' ? o : null;
}

/**
 * 订单详情聚合接口：{ order, disputes, timelines, settlement }，勿用 unwrapOrderPayload（会丢掉 settlement）
 * @param {*} payload
 */
export function unwrapOrderDetailBundle(payload) {
  let r = payload;
  if (r && typeof r === 'object' && r.data != null && typeof r.data === 'object') {
    r = r.data;
  }
  if (!r || typeof r !== 'object') {
    return { order: null, settlement: null, disputes: [], timelines: [] };
  }
  return {
    order: r.order ?? null,
    settlement: r.settlement ?? null,
    disputes: Array.isArray(r.disputes) ? r.disputes : [],
    timelines: Array.isArray(r.timelines) ? r.timelines : [],
  };
}

/**
 * @param {*} order 订单详情（axios 拦截器脱壳后的对象）
 * @returns {number}
 */
export function getOrderPayAmount(order) {
  if (!order || typeof order !== 'object') return 0;

  const explicit = [
    'actualAmount',
    'payAmount',
    'payableAmount',
    'totalPayAmount',
    'orderPayAmount',
    'shouldPayAmount',
    'realPayAmount',
    'payMoney',
    'totalMoney',
    'orderAmount',
    'amount',
  ];
  for (const k of explicit) {
    const v = toNum(order[k]);
    if (!Number.isNaN(v) && v > 0) return v;
  }

  const acc = order.account || order.sjzAccount || order.accountVO || order.goods;
  const hours = order.rentHours ?? order.leaseHours ?? order.rentDuration;
  const hNum = hours === undefined || hours === '' ? NaN : Number(hours);
  if (acc && typeof acc === 'object' && Number.isFinite(hNum) && hNum > 0) {
    const hourly = toNum(acc.rent ?? acc.pricePerHour ?? acc.unitPrice);
    const dep = toNum(order.deposit ?? order.depositAmount ?? acc.deposit ?? acc.depositAmount);
    if (!Number.isNaN(hourly) && hourly >= 0) {
      const total = hourly * hNum + (Number.isNaN(dep) ? 0 : Math.max(0, dep));
      if (total > 0) return total;
    }
  }

  const days = order.leaseDays ?? acc?.leaseDays;
  const dNum = days === undefined || days === '' ? NaN : Number(days);
  if (acc && typeof acc === 'object' && Number.isFinite(dNum) && dNum > 0) {
    const daily = toNum(acc.rentPerDay ?? acc.dayRent ?? acc.dailyRent);
    const dep = toNum(order.deposit ?? order.depositAmount ?? acc.deposit ?? acc.depositAmount);
    if (!Number.isNaN(daily) && daily >= 0) {
      const total = daily * dNum + (Number.isNaN(dep) ? 0 : Math.max(0, dep));
      if (total > 0) return total;
    }
  }

  const nestedSum = sumRentDeposit(acc);
  if (!Number.isNaN(nestedSum) && nestedSum > 0) return nestedSum;

  const flatSum = sumRentDeposit(order);
  if (!Number.isNaN(flatSum) && flatSum > 0) return flatSum;

  const ta = toNum(order.totalAmount);
  if (!Number.isNaN(ta) && ta > 0) return ta;
  const pr = toNum(order.price);
  if (!Number.isNaN(pr) && pr > 0) return pr;
  return 0;
}

export function getOrderGoodsTitle(order) {
  if (!order || typeof order !== 'object') return '游戏账号';
  const acc = order.account || order.sjzAccount || order.accountVO || order.goods;
  return (
    order.goodsName ||
    order.title ||
    order.ratioInfo ||
    acc?.ratioInfo ||
    order.accountCode ||
    acc?.accountCode ||
    '游戏账号'
  );
}

export function getOrderRentLabel(order) {
  if (!order || typeof order !== 'object') return { hours: 0, label: '—' };
  const acc = order.account || order.sjzAccount || order.accountVO;
  const h = order.rentHours ?? order.leaseHours ?? order.rentDuration;
  if (h != null && h !== '') {
    const n = Number(h);
    if (Number.isFinite(n)) return { hours: n, label: `${n}小时` };
  }
  const days = order.leaseDays ?? acc?.leaseDays;
  if (days != null && days !== '') {
    const n = Number(days);
    if (Number.isFinite(n)) return { hours: 0, label: `${n}天` };
  }
  return { hours: 0, label: '—' };
}

const FIRST_IMG = (s) => {
  if (!s || typeof s !== 'string') return '';
  const u = s.split(/[,;\s]+/).map((x) => x.trim()).find(Boolean);
  return u || '';
};

/** 列表卡片封面（兼容 goodsInfo、嵌套账号截图） */
export function getOrderCoverUrl(order) {
  if (!order || typeof order !== 'object') return '';
  const acc = order.account || order.sjzAccount || order.accountVO;
  const gi = order.goodsInfo;
  const raw =
    order.cover ||
    order.coverUrl ||
    FIRST_IMG(order.images) ||
    FIRST_IMG(gi?.images) ||
    gi?.warehouseScreenshot ||
    acc?.warehouseScreenshot ||
    acc?.otherScreenshot ||
    order.warehouseScreenshot ||
    '';
  return raw || '';
}

/** 下单时间展示 */
export function getOrderTimeText(order) {
  if (!order || typeof order !== 'object') return '';
  const t =
    order.createTime ??
    order.createdAt ??
    order.createDate ??
    order.orderTime ??
    order.time ??
    '';
  return t ? String(t) : '';
}

function firstPositiveFinite(...candidates) {
  for (const c of candidates) {
    if (c === undefined || c === null || c === '') continue;
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return NaN;
}

/**
 * 从订单/嵌套对象解析「租赁小时数」
 */
export function resolveOrderRentHours(order) {
  if (!order || typeof order !== 'object') return NaN;
  const acc =
    order.account ||
    order.sjzAccount ||
    order.accountVO ||
    order.goods;
  const gi = order.goodsInfo;
  return firstPositiveFinite(
    order.rentHours,
    order.leaseHours,
    order.rentDuration,
    order.durationHours,
    order.leaseDuration,
    order.hours,
    order.hourCount,
    order.rentHour,
    acc?.rentHours,
    gi?.rentHours,
    gi?.leaseHours
  );
}

/**
 * 从订单/嵌套对象解析「时租单价」元/小时（尽量不将「租金小计 rentAmount」误判为时租）
 */
export function resolveOrderHourlyRent(order) {
  if (!order || typeof order !== 'object') return NaN;
  const acc =
    order.account ||
    order.sjzAccount ||
    order.accountVO ||
    order.goods;
  const gi = order.goodsInfo;

  let hourly = firstPositiveFinite(
    order.unitPrice,
    order.hourPrice,
    order.hourlyPrice,
    order.pricePerHour,
    order.perHourPrice,
    order.perHourRent,
    order.hourlyRent,
    acc?.unitPrice,
    acc?.pricePerHour,
    gi?.unitPrice,
    gi?.pricePerHour,
    gi?.rent,
    acc?.rent
  );

  const hours = resolveOrderRentHours(order);
  const rentAmount = toNum(order.rentAmount);
  if ((Number.isNaN(hourly) || hourly <= 0) && Number.isFinite(hours) && hours > 0) {
    const derived = rentAmount / hours;
    if (!Number.isNaN(derived) && derived >= 0) hourly = derived;
  }

  if (Number.isNaN(hourly) || hourly <= 0) {
    const r = toNum(order.rent);
    const ra = rentAmount;
    if (Number.isFinite(hours) && hours > 0 && !Number.isNaN(r) && r > 0) {
      if (Number.isNaN(ra)) hourly = r;
      else if (Math.abs(r * hours - ra) < 0.02 || ra <= 0.01) hourly = r;
      else if (Math.abs(r - ra) < 0.02) hourly = r / hours;
    }
  }

  return Number.isFinite(hourly) && hourly >= 0 ? hourly : NaN;
}

/**
 * 支付页：应付金额 = 租金小计（时租×时长 或 订单租金字段）+ 押金
 * @returns {{ hourly: number, hours: number, deposit: number, rentSubtotal: number, payAmount: number, formulaLabel: string }}
 */
export function getPayRentTimesHoursBreakdown(order) {
  const bad = {
    hourly: NaN,
    hours: NaN,
    deposit: 0,
    rentSubtotal: 0,
    payAmount: 0,
    formulaLabel: '—',
  };
  if (!order || typeof order !== 'object') return bad;

  const acc =
    order.account ||
    order.sjzAccount ||
    order.accountVO ||
    order.goods;
  const hours = resolveOrderRentHours(order);
  let hourly = resolveOrderHourlyRent(order);

  const depositRaw = toNum(
    order.deposit ??
      order.depositAmount ??
      order.cashDeposit ??
      acc?.deposit ??
      acc?.depositAmount
  );
  const deposit = Number.isNaN(depositRaw) ? 0 : Math.max(0, depositRaw);

  let rentSubtotal = 0;
  let formulaLabel = '—';

  const rentAmount = toNum(order.rentAmount);
  const totalAmt = toNum(order.totalAmount);

  if (Number.isFinite(hours) && hours > 0 && !Number.isNaN(rentAmount) && rentAmount > 0) {
    rentSubtotal = Math.round(rentAmount * 100) / 100;
    hourly = rentSubtotal / hours;
    formulaLabel = `￥${hourly.toFixed(2)} × ${hours}小时 + 押金￥${deposit.toFixed(2)}`;
  } else if (Number.isFinite(hours) && hours > 0 && Number.isFinite(hourly) && hourly >= 0) {
    rentSubtotal = Math.round(hourly * hours * 100) / 100;
    formulaLabel = `￥${hourly.toFixed(2)} × ${hours}小时 + 押金￥${deposit.toFixed(2)}`;
  }

  if (rentSubtotal <= 0 && !Number.isNaN(rentAmount) && rentAmount > 0) {
    rentSubtotal = Math.round(rentAmount * 100) / 100;
    if (Number.isFinite(hours) && hours > 0) {
      hourly = rentSubtotal / hours;
      formulaLabel = `￥${hourly.toFixed(2)} × ${hours}小时 + 押金￥${deposit.toFixed(2)}`;
    } else {
      formulaLabel = `租金小计￥${rentSubtotal.toFixed(2)} + 押金￥${deposit.toFixed(2)}`;
      hourly = NaN;
    }
  }

  if (rentSubtotal <= 0 && !Number.isNaN(totalAmt) && totalAmt > 0) {
    const rentPart = Math.max(0, Math.round((totalAmt - deposit) * 100) / 100);
    if (rentPart >= 0 || totalAmt > 0) {
      rentSubtotal = rentPart;
      if (Number.isFinite(hours) && hours > 0 && rentPart > 0) {
        hourly = rentPart / hours;
        formulaLabel =
          deposit > 0.01
            ? `￥${hourly.toFixed(2)} × ${hours}小时 + 押金￥${deposit.toFixed(2)}`
            : `￥${hourly.toFixed(2)} × ${hours}小时`;
      } else {
        formulaLabel =
          deposit > 0.01
            ? `租金￥${rentSubtotal.toFixed(2)} + 押金￥${deposit.toFixed(2)}`
            : `￥${totalAmt.toFixed(2)}`;
      }
    }
  }

  let payAmount = Math.round((rentSubtotal + deposit) * 100) / 100;

  if (!Number.isNaN(totalAmt) && totalAmt > 0) {
    const expected = Math.round((rentSubtotal + deposit) * 100) / 100;
    if (Math.abs(totalAmt - expected) < 0.02) payAmount = Math.round(totalAmt * 100) / 100;
    else if (rentSubtotal <= 0 && deposit >= 0) payAmount = Math.round(totalAmt * 100) / 100;
  }

  if (payAmount <= 0) {
    const fallback = getOrderPayAmount(order);
    if (Number.isFinite(fallback) && fallback > 0) {
      payAmount = Math.round(fallback * 100) / 100;
      formulaLabel =
        deposit > 0.01
          ? `（与详情一致）约 时租×时长+押金 ≈ ￥${payAmount.toFixed(2)}`
          : `￥${payAmount.toFixed(2)}`;
    }
  }

  return {
    hourly,
    hours,
    deposit,
    rentSubtotal,
    payAmount,
    formulaLabel,
  };
}
