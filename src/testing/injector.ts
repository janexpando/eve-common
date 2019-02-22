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
    let _provide = (t: ExecutionContext<InjectorContext>) => {
        t.context.injector = ReflectiveInjector.fromResolvedProviders(resolved);
    };
    test.before(_provide);
    test.beforeEach(_provide);
}
