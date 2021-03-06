export class PerformanceCalculator {
  constructor(perf, play) {
    this.performance = perf
    this.play = play
  }

  /**
   * type別の金額計算
   * @param {*} perf
   * @return {*}
   */
  get amount() {
    let result = 0
    switch (this.play.type) {
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${this.play.name}`);
      }
    return result
  }

  /**
   * ボリューム特典ポイントの集計
   * @param {*} perf
   * @return {*}
   */
  get volumeCreditsFor() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5);
    return result
  }
}