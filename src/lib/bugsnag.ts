import Bugsnag from '@bugsnag/js';
import { bugsnagConfig } from '../config/bugsnag';

if (!process.env.BUILD_SSR) {
    Bugsnag.start({
        apiKey: bugsnagConfig.apiKey,
        onError: () => process.env.NODE_ENV === 'production' && self.location.hostname.endsWith('.identigraf.center'),
    });
}
