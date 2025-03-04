import * as cms from '../cms';
import { Context } from '../cms';
import { KeywordsOptions, KeywordsParser, MatchType } from '../nlp/keywords';
import { checkLocale } from '../nlp/locales';
import { Tokenizer } from '../nlp/tokens';
import { SearchResult } from './search-result';

export class SearchByKeywords {
  constructor(
    readonly cms: cms.CMS,
    readonly tokenizer: Tokenizer,
    readonly keywordsOptions = new KeywordsOptions()
  ) {}

  async searchContentsFromInput(
    inputTextTokens: string[],
    matchType: MatchType,
    context: Context
  ): Promise<SearchResult[]> {
    const locale = checkLocale(context.locale);
    const contentsWithKeywords = await this.cms.contentsWithKeywords(context);
    const kws = new KeywordsParser<SearchResult>(
      locale,
      matchType,
      this.tokenizer,
      this.keywordsOptions
    );
    contentsWithKeywords.forEach(content =>
      kws.addCandidate(content, content.keywords!)
    );
    const results = kws.findCandidatesWithKeywordsAt(inputTextTokens);
    return results.map(res => {
      const candidate = res.candidate as SearchResult;
      // @ts-ignore
      candidate.match = res.match;
      return candidate;
    });
  }

  /**
   * Chitchat contents need special treatment: does not make sense to ask user to disambiguate,
   * have less priority than non-chitchat contents,...
   * @return which contents must be displayed
   */
  public filterChitchat(
    tokens: string[],
    callbacks: SearchResult[]
  ): SearchResult[] {
    const isChitChat = (cc: SearchResult) => cc.getCallbackIfChitchat();

    const chitchatContents = callbacks.filter(isChitChat);
    if (chitchatContents.length == 0) {
      return callbacks;
    }
    if (chitchatContents.length < callbacks.length) {
      return callbacks.filter(c => !isChitChat(c));
    }
    // all are chitchats
    const estimatedNoChitchatWords =
      tokens.length - chitchatContents.length * 2;
    if (estimatedNoChitchatWords > 2) {
      // avoid that a sentence with chitchat and a question without recognized keywords is answered as chitchat
      return [];
    }
    return [chitchatContents[0]];
  }
}
