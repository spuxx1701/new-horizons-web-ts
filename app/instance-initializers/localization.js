export async function initialize(applicationInstance) {
    await applicationInstance.lookup("service:localizationService").readLocalizationFile();
  };
  
  export default {
    initialize
  };