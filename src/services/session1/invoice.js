/**
 * 請求書フォーマットの取得
 * @param {*} number
 * @return {*}
 */
function getStatementFormat(number) {
  return new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD",
      minimumFractionDigits: 2 }).format(number / 100);
}

/**
 * 請求書印刷の関数
 * @param {*} invoice 請求
 * @param {*} plays 演劇のデータ
 * @return {*}
 */
function statement(invoice, plays) {
  /**
   * 劇タイプの取得
   * @param {*} perf
   * @return {*}
   */
  const getPlayType = (perf) => {
    return plays[perf.playID].type
  }

  /**
   * type別の金額計算
   * @param {*} perf
   * @return {*}
   */
  const amountFor = (perf) => {
    let result = 0
    switch (getPlayType(perf)) {
      case "tragedy":
        result = 40000;
        if (perf.audience > 30) {
          result += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (perf.audience > 20) {
          result += 10000 + 500 * (perf.audience - 20);
        }
        result += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${getPlayType(perf)}`);
      }
    return result
  }

  /**
   * ボリューム特典ポイントの集計
   * @param {*} perf
   * @return {*}
   */
  const volumeCreditsFor = (perf) => {
    let result = 0;
    result += Math.max(perf.audience - 30, 0);
    if ("comedy" === getPlayType(perf)) result += Math.floor(perf.audience / 5);
    return result
  }

  /**
   * ボリューム特典ポイント集計のループを切り出す
   * @return {*}
   */
  const totalVolumeCredits = () => {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
      volumeCredits += volumeCreditsFor(perf)
    }
    return volumeCredits
  }

  /**
   * 合計金額集計のループを切り出す
   * @return {*}
   */
  const totalAmount = () => {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result
  }

  let result = `Statement for ${invoice.customer}\n`;
  for (let perf of invoice.performances) {
    result += `  ${getPlayType(perf)}: ${getStatementFormat(amountFor(perf))} (${perf.audience} seats)\n`;
  }

  result += `Amount owed is ${getStatementFormat(totalAmount())}\n`;
  result += `You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

/**
 * 請求書の発行
 * @export
 * @param {*} invoices 請求情報
 * @param {*} plays 演劇のデータ
 * @return {*} string
 */
export function getInvoice(invoices, plays) {
  const result = invoices.reduce((_, item) => {
    return statement(item, plays)
  }, '')
  return result
}