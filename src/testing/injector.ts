import {ExecutionContext, TestInterface} from "ava";
import {Injector, Provider, ReflectiveInjector} from "injection-js";

export interface InjectorContext {
    injector: Injector;
}

export function provideInjector(
    test: TestInterface<InjectorContext>,
    providers: Provider[] = [],
) {
    let resolved = ReflectiveInjector.resolve(providers);
    test.beforeEach((t: ExecutionContext<InjectorContext>) => {
        let injector = ReflectiveInjector.fromResolvedProviders(resolved);
        t.context.injector = injector;
    });
}
