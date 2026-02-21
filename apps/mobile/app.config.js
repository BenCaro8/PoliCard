import * as dotenv from 'dotenv';

dotenv.config();

export default {
  expo: {
    name: 'Pocketnaut',
    slug: 'mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: false,
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#ffffff',
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_SECRET,
        },
      },
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
        'FOREGROUND_SERVICE',
        'ACCESS_BACKGROUND_LOCATION',
      ],
      package: 'com.anonymous.mobile',
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_SECRET,
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'This app needs access to your location to show your position on the map.',
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'This app requires location access to provide location-based services.',
        UIBackgroundModes: ['location'],
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
      [
        'expo-asset',
        {
          assets: [
            './assets/shaders/vertex-shader.glsl',
            './assets/shaders/fragment-shader.glsl',
          ],
        },
      ],
    ],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '7c1309d7-8c3e-4b31-a60b-033a282b7a11',
      },
    },
    owner: 'bencaro8',
  },
};
