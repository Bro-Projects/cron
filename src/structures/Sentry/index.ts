import * as Sentry from "@sentry/node";
import { loadConfig } from "@utils";

Sentry.init({
  dsn: loadConfig().keys.sentryURI,
});

export default Sentry;