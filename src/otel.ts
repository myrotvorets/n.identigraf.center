import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { Span } from '@opentelemetry/api';

const resource = Resource.default().merge(
    new Resource({
        [ATTR_SERVICE_NAME]: 'identigraf',
        [ATTR_SERVICE_VERSION]: process.env.APP_VERSION,
    }),
);

const exporter = new OTLPTraceExporter({
    url: 'https://otel.myrotvorets.center/v1/traces',
});

const processor = new BatchSpanProcessor(exporter);

const provider = new WebTracerProvider({
    resource,
    spanProcessors: [processor],
});

provider.register({
    contextManager: new ZoneContextManager(),
});

registerInstrumentations({
    instrumentations: [new FetchInstrumentation(), new XMLHttpRequestInstrumentation()],
});

export const tracer = provider.getTracer('identigraf', process.env.APP_VERSION);

declare global {
    interface Window {
        startBindingSpan: (traceId: string, spanId: string, traceFlags: number) => void;
    }
}

let bindingSpan: Span | undefined;
window.startBindingSpan = (traceId: string, spanId: string, traceFlags: number): void => {
    bindingSpan = tracer.startSpan('');
    bindingSpan.spanContext().traceId = traceId;
    bindingSpan.spanContext().spanId = spanId;
    bindingSpan.spanContext().traceFlags = traceFlags;
};
