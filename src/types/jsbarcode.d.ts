declare module 'jsbarcode' {
  interface JsBarcodeOptions {
    format?: string;
    width?: number;
    height?: number;
    displayValue?: boolean;
    text?: string;
    fontSize?: number;
    font?: string;
    textAlign?: string;
    textPosition?: string;
    textMargin?: number;
    fontOptions?: string;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    valid?: (valid: boolean) => void;
  }

  function JsBarcode(
    element: string | HTMLElement | SVGElement,
    text: string,
    options?: JsBarcodeOptions
  ): void;

  namespace JsBarcode {
    export function getModule(name: string): any;
  }

  export = JsBarcode;
} 