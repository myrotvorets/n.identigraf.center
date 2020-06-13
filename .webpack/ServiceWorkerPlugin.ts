import webpack from 'webpack';
import { resolve } from 'path';

export default class ServiceWorkerPlugin {
    public apply(compiler: webpack.Compiler): void {
        const src = resolve(__dirname, '../src/sw.ts');

        compiler.hooks.make.tapAsync(
            this.constructor.name,
            (compilation: webpack.compilation.Compilation, callback: () => void): void => {
                const outputOptions = compiler.options;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const child: webpack.Compiler = (compilation as any).createChildCompiler(this.constructor.name);
                child.context = compiler.context;
                child.options = { ...outputOptions };
                child.options.entry = { sw: src };
                child.options.target = 'webworker';
                child.options.output = { ...child.options.output, filename: '[name].js' };
                child.outputFileSystem = compiler.outputFileSystem;

                new webpack.SingleEntryPlugin(compiler.context, src, 'sw').apply(child);

                compilation.hooks.additionalAssets.tapAsync(this.constructor.name, (childProcessDone: () => void) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (child as any).runAsChild(
                        // err is of webpack.webpackError type (type declaration missing)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (err: any, entries: webpack.Entry[], childCompilation: webpack.compilation.Compilation) => {
                            if (!err) {
                                compilation.assets = { ...childCompilation.assets, ...compilation.assets };
                            }

                            if (err) {
                                compilation.errors.push(err);
                            }

                            childProcessDone();
                        },
                    );
                });

                callback();
            },
        );
    }
}
