export function range(count: number, step?: number): number[];
export function range(range: [number, number], step?: number): number[];
export function range(rangeOrCount: number | [number, number], step?: number): number[] {
  let res: number[] = [];

  step ??= 1;

  if (Array.isArray(rangeOrCount)) {
    for (let i = rangeOrCount[0]; i <= rangeOrCount[1]; i += step) {
      res.push(i);
    };
  };

  if (typeof rangeOrCount === "number") {
    res = new Array(rangeOrCount).fill(0).map((_, idx) => idx * step!);
  };

  return res;
};

export const shuffle = function <T>(list: T[]) {
  const newList = [...list];
  for (let i = newList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newList[i], newList[j]] = [newList[j], newList[i]];
  }
  return newList;
};

export const simpleId = () => Math.random().toString(36).slice(2, 9);

export const getYMDFomDate = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const getHMSFromDate = (date: Date) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export const arr2CSV = (arr: string[][]) => {
  const csvContent = arr
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  return csvContent;
}

export const exportCSV = (csv: string) => {
  const blob = new Blob([csv], { type: "text/csv" });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download = "leads.csv";

  a.click();

  window.URL.revokeObjectURL(url);
}