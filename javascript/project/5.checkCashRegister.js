/**
 * 找回的零钱与收款机中的钱数关系
 * 1. 小于： {status: "INSUFFICIENT_FUNDS", change: []}。
 * 2. 等于：{status: "CLOSED", change: [...]} change 的属性值就是收银机內的金额。
 * 3. 大于： {status: "OPEN", change: [...]} change 键值是应找回的零钱数，并将找零的面值由高到低排序。
 *
 * @param {Number} price 价格
 * @param {Number} cash 支付金额
 * @param {Array} cid 收款机金额组成
 */
function checkCashRegister(price, cash, cid) {
  // 面值字典
  const UINT = {
    PENNY: 0.01,
    NICKEL: 0.05,
    DIME: 0.1,
    QUARTER: 0.25,
    ONE: 1,
    FIVE: 5,
    TEN: 10,
    TWENTY: 20,
    'ONE HUNDRED': 100
  };

  /**
   * 计算 cid 子项中应找回的数目和新的找零
   * @param {Number} cash 找零数值
   * @param {Number} base 面值
   * @param {Array} cidItem cid面值数量
   * @param {Array} change 组成找零的面值数量
   * @returns {Object}
   */
  function check(cash, base, cidItem) {
    const result = {
      nd: cash, //新的找零
      md: cidItem[1], // 收款机中当前面值剩余
      c: [] // 当前面值的找零组成
    };

    const count = Math.floor(cash / base); // base面值的数量
    if (cash >= base) {
      // 找零的当前面值总和
      const maxNum = count * base;
      // 找零为base的总数。
      // 如果找零的当前面值总和大于收款机中当前面值总和，应返回所有收款机中当前面值的所有钱；
      // 否则返回找零的当前面值总和
      const backTotal = handlerFloat(maxNum < cidItem[1] ? maxNum : cidItem[1]);
      result.c.push([cidItem[0], backTotal]);
      result.nd = handlerFloat(cash - backTotal);
      result.md = handlerFloat(cidItem[1] - backTotal);
    }
    return result;
  }

  // 数字精度处理
  function handlerFloat(num, base = 100) {
    return Math.round(num * base) / base;
  }

  const change = []; // 找零面值数量
  let diff = handlerFloat(cash - price), // 找零的总数
    mDiff = 0; // 收银机剩余

  for (let index = cid.length - 1; index >= 0; index--) {
    const item = cid[index];
    const { nd, md, c } = check(diff, UINT[item[0]], item, change);
    diff = nd;
    mDiff += md;
    change.push(...c);
  }

  if (diff > 0) {
    // 操作完，零钱不够
    return { status: 'INSUFFICIENT_FUNDS', change: [] };
  } else {
    if (mDiff === 0) {
      // 所有零钱都已用完
      return { status: 'CLOSED', change: cid };
    }
    return { status: 'OPEN', change };
  }
}
