import { Button, Callback, CMS, ModelType, Text, Context } from '../cms';
import { KeywordsOptions, MatchType } from '../nlp/keywords';
import { checkLocale } from '../nlp/locales';
import { Tokenizer } from '../nlp/tokens';
import { SearchByKeywords } from './search-by-keywords';
import { SearchResult } from './search-result';

export class Search {
  readonly search: SearchByKeywords;
  constructor(
    private readonly cms: CMS,
    private readonly tokenizer: Tokenizer,
    keywordsOptions?: KeywordsOptions
  ) {
    this.search = new SearchByKeywords(cms, tokenizer, keywordsOptions);
  }

  /**
   * It does not sort the results based on the {@link SearchResult.priority}.
   * @param context must contain language
   */
  async searchByKeywords(
    inputText: string,
    matchType: MatchType,
    context: Context
  ): Promise<SearchResult[]> {
    const locale = checkLocale(context.locale);
    const tokens = this.tokenizer.tokenize(locale, inputText);
    const contents = await this.search.searchContentsFromInput(
      tokens,
      matchType,
      context
    );
    return this.search.filterChitchat(tokens, contents);
  }

  async respondFoundContents(
    results: SearchResult[],
    confirmKeywordsFoundTextId: string,
    noKeywordsFoundTextId: string,
    context: Context
  ): Promise<Text> {
    if (results.length == 0) {
      return this.cms.text(noKeywordsFoundTextId, context);
    }
    const chitchatCallback = results[0].getCallbackIfChitchat();
    if (chitchatCallback) {
      return this.cms.chitchat(chitchatCallback.id, context);
    }
    const buttonPromises = results.map(async result => {
      const urlCallback = result.getCallbackIfContentIs(ModelType.URL);
      if (urlCallback) {
        const url = await this.cms.url(urlCallback.id, context);
        return new Button(
          result.name,
          result.shortText!,
          Callback.ofUrl(url.url)
        );
      }
      return result.toButton();
    });
    const buttons = await Promise.all(buttonPromises);
    const text = await this.cms.text(confirmKeywordsFoundTextId, context);
    return text.cloneWithButtons(buttons);
  }
}
