import { shuffle, simpleId } from "../_utils";

type ListItem = {
  idx: string,
  name: string
};

export class List {
  _list: ListItem[];

  constructor(list: ListItem[]) {
    this._list = list;
  }

  _getSortIdx(idx: string) {
    const sortIdx = this._list.findIndex(item => item.idx === idx);
    if (sortIdx === -1) return undefined;
    return sortIdx;
  }

  _vExists(idx: string) {
    return !!this._list.find(item => item.idx === idx);
  }

  shuffle() {
    this._list = shuffle(this._list);
    return this;
  }

  get(idx: string) {
    return this._list.find(item => item.idx === idx);
  }

  getList() {
    return this._list;
  }

  getIdxList() {
    return this._list.map(i => i.idx);
  }

  delete(idx: string) {
    this._list = this._list.filter(item => item.idx !== idx);
    return this;
  }

  add(name: string, idx?: string) {
    this._list.push({ name, idx: idx ?? simpleId() });
    return this;
  }

  move(fromIdx: string, toIdx: string) {
    if (!this._vExists(fromIdx) || !this._vExists(toIdx)) return this;

    const fromItem = this.get(fromIdx)!;

    this.delete(fromIdx);

    const toSortIdx = this._getSortIdx(toIdx)!;

    this._list = [
      ...this._list.slice(0, toSortIdx),
      { ...fromItem, idx: toIdx },
      ...this._list.slice(toSortIdx + 1)
    ];

    return this;
  }

  clone() {
    return new List([...this._list]);
  }
}