// AdMob integration via @capacitor-community/admob

const AD_IDS = {
  interstitial: 'ca-app-pub-3792768001612007/8085891654',
};

let admob = null;
let interstitialReady = false;
let deathsSinceLastAd = 0;
const INTERSTITIAL_EVERY = 3;

async function initAds() {
  try {
    const AdMob = window.Capacitor?.Plugins?.AdMob;
    if (!AdMob) return;
    admob = AdMob;

    // Step 1: UMP consent check (required by Google Mobile Ads SDK v7+)
    let canRequest = true;
    try {
      const info = await admob.requestConsentInfo({});
      canRequest = info.canRequestAds;
      // Show consent form if needed (EEA users)
      if (info.isConsentFormAvailable && info.status === 'REQUIRED') {
        try { await admob.showConsentForm(); } catch (e) {}
      }
    } catch (e) {
      // Consent check unavailable — proceed anyway (non-EEA default)
      canRequest = true;
    }

    if (!canRequest) return;

    // Step 2: Initialize AdMob
    await admob.initialize({ testingDevices: [], initializeForTesting: false });

    // Step 3: Pre-load first interstitial
    await loadInterstitial();
  } catch (e) {
    console.error('[ads] init failed:', e?.message || e);
  }
}

async function loadInterstitial() {
  if (!admob) return;
  try {
    await admob.prepareInterstitial({
      adId: AD_IDS.interstitial,
      isTesting: false,
    });
    interstitialReady = true;
  } catch (e) {
    console.error('[ads] load failed:', e?.message || e);
  }
}

async function onGameOver() {
  deathsSinceLastAd++;
  if (!admob || !interstitialReady) return;
  if (deathsSinceLastAd < INTERSTITIAL_EVERY) return;

  deathsSinceLastAd = 0;
  try {
    await admob.showInterstitial();
    interstitialReady = false;
    await loadInterstitial();
  } catch (e) {
    console.error('[ads] show failed:', e?.message || e);
    interstitialReady = false;
    loadInterstitial();
  }
}

export { initAds, onGameOver };
