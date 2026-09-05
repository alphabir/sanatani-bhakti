const { withProjectBuildGradle } = require('expo/config-plugins');

/**
 * Lets Kotlin read dependencies compiled by a newer Kotlin than this project uses.
 *
 * Why this exists: `react-native-google-mobile-ads@16.5.0` (the latest) hard-pins
 * `play-services-ads:25.4.0`, and Google builds that with Kotlin 2.3. Expo SDK 56
 * compiles with Kotlin 2.1, and a 2.1 compiler refuses to read 2.3 metadata:
 *
 *   e: play-services-ads-25.4.0-api.jar!/META-INF/....kotlin_module
 *      Module was compiled with an incompatible version of Kotlin.
 *      The binary version of its metadata is 2.3.0, expected version is 2.1.0.
 *
 * Raising the whole project to Kotlin 2.3 does fix that, but then
 * react-native-safe-area-context crashes the 2.3 compiler — so the cure is worse
 * than the disease. This flag is the narrow alternative the compiler itself
 * suggests, and it is already what `expo-iap` applies to its own module
 * (node_modules/expo-iap/android/build.gradle). Here it is applied to every
 * subproject, since the offending jar lands on several classpaths.
 *
 * The check being skipped is a metadata *version* guard, not a correctness one:
 * the AdMob classes this app touches are plain Java/Android APIs.
 *
 * Remove this when Expo's Kotlin catches up with what Google Play Services ships.
 */
const MARKER = '// @generated sanatani: skip kotlin metadata version check';

const BLOCK = `
${MARKER}
allprojects {
  tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
    compilerOptions {
      freeCompilerArgs.add("-Xskip-metadata-version-check")
    }
  }
}
`;

module.exports = function withKotlinMetadataCheckSkip(config) {
  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error(
        'withKotlinMetadataCheckSkip: expected a Groovy build.gradle, got ' +
          cfg.modResults.language,
      );
    }
    // prebuild regenerates this file, but guard anyway so a re-run cannot double-apply.
    if (!cfg.modResults.contents.includes(MARKER)) {
      cfg.modResults.contents += BLOCK;
    }
    return cfg;
  });
};
