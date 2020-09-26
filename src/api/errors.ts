import type { ErrorResponse } from './types';

const errors: Record<string, string> = {
    'auth/invalid-verification-code': 'Код підтвердження SMS недійсний.',
    'auth/too-many-requests':
        'Google заблокував усі запити з цього пристрою через незвичну активність. Спробуйте ще раз пізніше.',

    AUTHORIZATION_FAILED: 'Прикра помилка авторизації.',
    AUTHORIZATION_REQUIRED: 'Для виконання цієї дії потрібна авторизація.',
    BAD_GATEWAY: 'Помилка спілкування з сервером',
    COMM_ERROR: 'Помилка спілкування з сервером',
    COUNTRY_BLOCK: 'Цю дію можна здійснити лише з території вільної України.',
    COUNTRY_BLOCK_RU:
        'Особам, які перебувають на території країни-агресора та окупованих нею територіях, країни, яка фінансує та постачає зброю терористам, доступ до сайту заборонено.',
    OUT_OF_CREDITS: 'Кількість безкоштовних спроб досягнуто. Будь ласка, спробуйте ще раз завтра.',
    UNKNOWN_ERROR: 'Несподівана помилка.',
};

export function decodeErrorCode(code: string): string {
    return errors[code] || 'Несподівана помилка.';
}

export function decodeErrorResponse(r: ErrorResponse): string {
    const error = errors[r.code];
    return error ?? r.message;
}

export function decodeFirebaseError(code: string, message: string): string {
    const error = errors[code];
    return error ?? message;
}
