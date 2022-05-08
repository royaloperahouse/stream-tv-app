import TVEventHandler from 'react-native/Libraries/Components/AppleTV/TVEventHandler';

export abstract class TVEventManager {
  private static tvEventHandler: null | typeof TVEventHandler = null;
  private static subscriptions: Array<(_: any, event: any) => void> = [];
  static init(): boolean {
    if (!TVEventManager.isInit()) {
      TVEventManager.tvEventHandler = new TVEventHandler();
      TVEventManager.tvEventHandler.enable(null, (cp: any, event: any) => {
        for (let i = 0; i < TVEventManager.subscriptions.length; i++) {
          TVEventManager.subscriptions[i](cp, event);
        }
      });
    }
    return TVEventManager.isInit();
  }

  static isInit(): boolean {
    return TVEventManager.tvEventHandler !== null;
  }

  static addEventListener(cb: (_: any, event: any) => void) {
    TVEventManager.subscriptions.push(cb);
  }

  static getEventListeners(): Array<(_: any, event: any) => void> {
    return [...TVEventManager.subscriptions];
  }

  static setEventListeners(subscriptions: Array<(_: any, event: any) => void>) {
    TVEventManager.subscriptions = subscriptions;
  }

  static removeEventListener(cb: (_: any, event: any) => void) {
    const index = TVEventManager.subscriptions.findIndex(
      cbItem => cbItem === cb,
    );
    if (index !== -1) {
      TVEventManager.subscriptions.splice(index, 1);
    }
  }

  static unmount() {
    if (typeof TVEventManager?.tvEventHandler?.disable === 'function') {
      TVEventManager.tvEventHandler.disable();
    }
    TVEventManager.subscriptions = [];
    TVEventManager.tvEventHandler = null;
  }
}
