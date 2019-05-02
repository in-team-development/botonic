export class NameMap {
  constructor(readonly nameToId = new Map<string, string>()) {}
  add(cmsId: string, modelName: string): void {
    this.nameToId.set(modelName, cmsId);
  }

  isEmpty(): boolean {
    return this.nameToId.size === 0;
  }
}
