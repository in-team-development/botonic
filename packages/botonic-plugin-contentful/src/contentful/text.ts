import * as contentful from 'contentful';
import * as cms from '../cms';
import { ButtonDelivery } from './button';
import { CarouselFields } from './carousel';
import { DeliveryApi, ContentWithKeywordsFields } from './delivery-api';
import { DeliveryWithFollowUp } from './follow-up';

export class TextDelivery extends DeliveryWithFollowUp {
  constructor(
    protected delivery: DeliveryApi,
    private readonly button: ButtonDelivery
  ) {
    super(cms.ModelType.TEXT, delivery);
  }

  async text(id: string, context: cms.Context): Promise<cms.Text> {
    // we only get the 1 level of included references...
    let entry: contentful.Entry<
      TextFields
    > = await this.delivery.getEntryByIdOrName(id, cms.ModelType.TEXT, context);
    // .. so we need to fetch the buttons
    return this.textFromEntry(entry, context);
  }

  async textFromEntry(
    entry: contentful.Entry<TextFields>,
    context: cms.Context
  ): Promise<cms.Text> {
    let fields = entry.fields;
    let buttons = fields.buttons || [];
    let followup: Promise<cms.Content | undefined> = this.followUp!.fromFields(
      fields.followup,
      context
    );
    let promises = [followup];
    promises.push(
      ...buttons.map(reference => this.button.fromReference(reference, context))
    );

    return Promise.all(promises).then(followUpAndButtons => {
      let followUp = followUpAndButtons.shift() as (cms.Text | undefined);
      let buttons = followUpAndButtons as cms.Button[];
      return new cms.Text(
        fields.name,
        fields.text,
        buttons,
        fields.shortText,
        fields.keywords,
        followUp,
        fields.buttonsStyle == 'QuickReplies'
          ? cms.ButtonStyle.QUICK_REPLY
          : cms.ButtonStyle.BUTTON
      );
    });
  }
}

export interface TextFields extends ContentWithKeywordsFields {
  // Full text
  text: string;
  // typed as any because we might only get the entry.sys but not the fields
  buttons: contentful.Entry<any>[];
  followup?: contentful.Entry<TextFields | CarouselFields>;
  buttonsStyle?: string;
}
