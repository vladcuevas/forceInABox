/* global d3 */

export class Reader {
  constructor (path) {
    this.path = path
  }


  plainCSV (f) {
    let rawDS = d3.csv(this.path, f)

    return rawDS
  }

  plainTSV (f) {
    let rawDS = d3.tsv(this.path, f)
    return rawDS
  }

  JSON () {
    let rawDS = d3.json(this.path)
    return rawDS
  }
}
