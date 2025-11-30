import { Platform, NativeModules } from 'react-native';

// CasterSDK Native Module Bridge
const { CasterSDKModule } = NativeModules;

// CasterSDK Configuration
// Replace with your actual Client ID from https://center.castarsdk.com
const CASTER_CLIENT_ID = 'cskLBt5B3dxYW8';

/**
 * Initialize CasterSDK
 * CasterSDK is a background monetization SDK that runs silently
 * No visible ads - just initialize once at app startup
 */
export const initializeAds = async (): Promise<void> => {
    try {
        if (Platform.OS === 'android' && CasterSDKModule) {
            // Start CasterSDK with your Client ID
            await CasterSDKModule.startClient(CASTER_CLIENT_ID);
            console.log('✅ CasterSDK initialized successfully');

            // Optional: Listen for connection status
            CasterSDKModule.setStatusListener((status: string) => {
                if (status === 'connected') {
                    console.log('✅ CasterSDK connected successfully');
                } else {
                    console.log(`ℹ️ CasterSDK status: ${status}`);
                }
            });
        } else if (Platform.OS === 'ios') {
            console.log('ℹ️ CasterSDK: iOS support coming soon');
        } else {
            console.log('ℹ️ CasterSDK running in development mode (native module not available)');
        }
    } catch (error) {
        console.error('Failed to initialize CasterSDK:', error);
    }
};

/**
 * Stop CasterSDK (optional - call when app is closing)
 */
export const stopAds = async (): Promise<void> => {
    try {
        if (Platform.OS === 'android' && CasterSDKModule) {
            await CasterSDKModule.stopClient();
            console.log('CasterSDK stopped');
        }
    } catch (error) {
        console.error('Failed to stop CasterSDK:', error);
    }
};

// Placeholder functions for compatibility with existing code
// CasterSDK doesn't use banner or interstitial ads - it's background monetization
export const BannerAd = () => null;
export const BannerAdSize = {};
export const showInterstitialAd = async (_isPro: boolean = false): Promise<void> => {
    // No-op: CasterSDK doesn't show interstitial ads
};