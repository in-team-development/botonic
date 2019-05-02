import { NameMap } from '../cms/nameMap';
import { DeliveryApi } from './deliveryApi';

export class CacheDelivery {
  nameMap = new NameMap();
  constructor(readonly delivery: DeliveryApi) {}

  private async load(): Promise<number> {
    let entries = await this.delivery.getEntries<any>();
    entries.items.forEach(entry => {
      let name = entry.fields.name;
      if (name) {
        this.nameMap.add(entry.sys.id, name);
      }
    });
    return Promise.resolve(entries.total);
  }

  async nameToId(modelName: string): Promise<string | undefined> {
    if (this.nameMap.isEmpty()) {
      await this.load();
    }
    return Promise.resolve(this.nameMap.nameToId.get(modelName));
  }
}
