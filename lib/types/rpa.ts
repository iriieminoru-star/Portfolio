export type Action =
  | {
      type: "click";
      selector: string;
      text?: string;
    }
  | {
      type: "input";
      selector: string;
      value: string;
    };