import { Locale, tokenizeAndStem } from './index';

export enum SearchPosition {
  START = 0,
  END = 1
}

export class TextRange {
  constructor(readonly from: number, readonly to: number) {}
}

export class TextEdit {
  needles: string[][];
  locale: Locale;

  constructor(
    locale: Locale,
    needles: string[],
    readonly separators = ' .,)('
  ) {
    this.locale = locale;
    // TODO maybe needles should also be tokenized outside
    this.needles = needles.map(n => this.tokenize(n));
  }

  private nextWord(text: string, start: number): string | undefined {
    if (start >= text.length) {
      return undefined;
    }
    let idx = start;
    for (; idx < text.length; idx++) {
      if (!this.separators.includes(text[idx])) {
        break;
      }
    }
    return text.slice(start, idx);
  }

  private prevWord(text: string, end: number): string | undefined {
    if (end < 0) {
      return undefined;
    }
    let idx = end;
    for (; idx > 0; idx--) {
      if (!this.separators.includes(text[idx])) {
        break;
      }
    }
    return text.slice(idx, end);
  }

  skipSeparators(text: string, start: number, dir = 1): number {
    while (this.separators.includes(text[start])) {
      start += dir;
    }
    return start;
  }

  private findNeedle(text: string, needle: string[], idx: number, dir : number): number | undefined {
    idx = this.skipSeparators(text, idx, dir);
    for (const n of needle) {
      const word = this.nextWord(text, idx);
      if (!word) {
        return undefined;
      }
      if (this.tokenize(word)[0] != n) {
        return undefined;
      }
      idx += word.length;
      idx = this.skipSeparators(text, idx);
    }
    return idx;
  }

  private prevNeedle(text: string, needle: string[], idx: number): number | undefined {
    idx = this.skipSeparators(text, idx, -1);
    for (let n=needle.length; n >=0; n--) {
      const word = this.prevWord(text, idx);
      if (!word) {
        return undefined;
      }
      if (this.tokenize(word)[0] != n) {
        return undefined;
      }
      idx += word.length;
      idx = this.skipSeparators(text, idx);
    }
    return idx;
  }


  search(text: string, pos: SearchPosition): TextRange | undefined {
    text = text.trim();
    for (const needle of this.needles) {
      const needleEnd = this.findNeedle(text, needle, 0);
      if (needleEnd) {
        return new TextRange(0, needleEnd);
      }
    }
    return undefined;
  }

  /**
   * @return the stripped text in lower case
   */
  strip(text: string, pos: SearchPosition): string {
    const range = this.search(text, pos);
    if (!range) {
      return text;
    }
    return (text.slice(0, range.from) + text.slice(range.to)).trim();
  }

  tokenize(text: string) {
    return tokenizeAndStem(this.locale, text, []);
  }
}
