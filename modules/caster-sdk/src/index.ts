import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { CasterSDKModule } = NativeModules;

export interface CasterSDK {
  startClient: (clientId: string) => Promise<string>;
  stopClient: () => Promise<string>;
  setStatusListener: () => Promise<string>;
}

// Create event emitter for status updates
const casterEventEmitter = Platform.OS === 'android' && CasterSDKModule
  ? new NativeEventEmitter(CasterSDKModule)
  : null;

export const CasterSDK: CasterSDK | null = Platform.OS === 'android' ? CasterSDKModule : null;

export const addCasterStatusListener = (callback: (status: string) => void) => {
  if (casterEventEmitter) {
    return casterEventEmitter.addListener('CasterSDKStatusChanged', (event) => {
      callback(event.status);
    });
  }
  return null;
};

export default CasterSDK;
