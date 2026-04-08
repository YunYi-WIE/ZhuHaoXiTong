/**
 * 从分页或列表接口响应中取出数组（兼容 records / list / rows / content / data 等）
 * @param {*} payload axios 拦截器返回后的 body（可能已是 Page、数组或业务对象）
 */
export function extractListRecords(payload) {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== 'object') return [];

  const pickArray = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    const keys = ['records', 'list', 'rows', 'content', 'items'];
    for (const k of keys) {
      if (Array.isArray(obj[k])) return obj[k];
    }
    return null;
  };

  let arr = pickArray(payload);
  if (arr) return arr;

  if (Array.isArray(payload.data)) return payload.data;
  arr = pickArray(payload.data);
  if (arr) return arr;

  return [];
}

/**
 * 分页 total（兼容多种字段名）
 */
export function extractPageTotal(payload) {
  if (payload == null || typeof payload !== 'object') return 0;
  const t =
    payload.total ?? payload.totalCount ?? payload.totalElements ?? payload.totalRow;
  if (typeof t === 'number' && !Number.isNaN(t)) return t;
  return extractListRecords(payload).length;
}
