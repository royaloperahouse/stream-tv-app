
import { delay } from 'redux-saga/effects';

export function* bigDelay(seconds: number) {
    const sec: number = Math.ceil(seconds / 10000);
    for (let i = 0; i < sec; i++) {
        yield delay(10000);
    }
}