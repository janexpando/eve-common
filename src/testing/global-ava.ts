import anyAva, { TestInterface } from 'ava';
import { Dict } from '../types';
import { InjectorContext } from './injector';

export const test: TestInterface<InjectorContext & Dict<any>> = anyAva;
