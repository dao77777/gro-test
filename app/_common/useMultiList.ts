import { useCallback, useState } from "react";
import { List } from "./List";

type MultiListItem = { idx: string, name: string, list: List };

type MultiList = MultiListItem[];

export const useMultiList = (multiList: MultiList) => {
  const [ml, setML] = useState<MultiList>(multiList);

  const _vPIDExists = useCallback((pid: string) => {
    return !!ml.find(item => item.idx === pid);
  }, [ml]);

  const _vCIDExists = useCallback((cid: string) => {
    for (const i of ml) {
      if (i.list._vExists(cid)) {
        return true;
      }
    }

    return false;
  }, [ml]);

  const _getPByPID = useCallback((pid: string) => {
    return ml.find(item => item.idx === pid);
  }, [ml]);

  const _getPByCID = useCallback((cid: string) => {
    for (const i of ml) {
      const isFind = i.list.get(cid);

      if (isFind) return i;
    }
  }, [ml]);

  const _getCByCID = useCallback((cid: string) => {
    for (const i of ml) {
      const isFind = i.list.get(cid);

      if (isFind) return isFind;
    }
  }, [ml]);

  const _setListByPID = useCallback((pid: string, newList: List) => {
    setML(c => c.map(i => i.idx === pid ? { ...i, list: newList } : i));
  }, [])

  const getCByCID = useCallback((cid: string) => _getCByCID(cid), [_getCByCID]);

  const deleteItemByCID = useCallback((cid: string) => {
    if (!_vCIDExists(cid)) return;

    const p = _getPByCID(cid)!;

    _setListByPID(cid, p.list.delete(cid).clone());
  }, [_vCIDExists, _getPByCID, _setListByPID]);

  const addItemByPID = useCallback((pid: string, name: string, cid?: string) => {
    if (!_vPIDExists(pid)) return;

    const p = _getPByPID(pid)!;

    const newList = p.list.add(name, cid).clone();

    _setListByPID(pid, newList);
  }, [_vPIDExists, _getPByPID, _setListByPID]);

  const swapItem = useCallback((fcid: string, tcid: string) => {
    if (!_vCIDExists(fcid) || !_vCIDExists(tcid)) return;

    const fp = _getPByCID(fcid)!;
    const tp = _getPByCID(tcid)!;

    const fpid = fp.idx;
    const tpid = tp.idx;

    const fc = _getCByCID(fcid)!;
    const tc = _getCByCID(tcid)!;

    const newFList = fp.list.delete(fcid).add(tc.name, tcid).clone();
    const newTList = tp.list.delete(tcid).add(fc.name, fcid).clone();

    _setListByPID(fpid, newFList);
    _setListByPID(tpid, newTList);
  }, [_vCIDExists, _getPByCID, _getCByCID, _setListByPID]);

  const moveItem = useCallback((fcid: string, tcid: string) => {
    if (!_vCIDExists(fcid) || !_vCIDExists(tcid)) return;

    const fp = _getPByCID(fcid)!;
    const tp = _getPByCID(tcid)!;

    const fpid = fp.idx;
    const tpid = tp.idx;

    const fc = _getCByCID(fcid)!;

    const newFList = fp.list.delete(fcid).clone();
    const newTList = tp.list.add(fc.name, fcid).move(fcid, tcid).clone();

    _setListByPID(fpid, newFList);
    _setListByPID(tpid, newTList);
  }, [_vCIDExists, _getPByCID, _getCByCID, _setListByPID]);

  return {
    ml,
    getCByCID,
    deleteItemByCID,
    addItemByPID,
    swapItem,
    moveItem
  }
}