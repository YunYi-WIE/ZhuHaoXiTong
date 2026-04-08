/**
 * 与后端 OrderStatusEnum 一致：1=租赁中(ON_RENT)，2=已完成(FINISHED)。
 * {@code HxlOrderServiceImpl#createDispute} 允许上述两种状态发起投诉。
 */
export const ORDER_STATUS_ALLOW_CREATE_DISPUTE = [1, 2];
