import { Context } from '../cms';
import { CarouselFields } from './carousel';
import { DeliveryWithFollowUp } from './follow-up';
import { TextFields } from './text';
import * as cms from '../cms';
import * as contentful from 'contentful';
import { ContentWithKeywordsFields, DeliveryApi } from './delivery-api';

export class UrlDelivery extends DeliveryWithFollowUp {
  constructor(delivery: DeliveryApi) {
    super(cms.ModelType.URL, delivery);
  }

  async url(id: string, context: Context): Promise<cms.Url> {
    const entry: contentful.Entry<UrlFields> = await this.getEntry(id, context);
    const fields = entry.fields;
    const followUp = await this.followUp!.fromFields(fields.followup!, context);
    const name = fields.name || fields.url;
    return new cms.Url(
      name,
      fields.url,
      fields.shortText,
      fields.keywords,
      followUp
    );
  }
}

export interface UrlFields extends ContentWithKeywordsFields {
  url: string;
  followup?: contentful.Entry<TextFields | CarouselFields>;
}
