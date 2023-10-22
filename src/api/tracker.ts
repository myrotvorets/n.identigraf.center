declare global {
    interface Window {
        _paq: unknown[];
    }
}

export function setPageURL(url: string, previous?: string): void {
    self._paq.push(['setCustomUrl', url]);
    if (previous) {
        self._paq.push(['setReferrerUrl', previous]);
    }
}

export function trackPageView(title?: string): void {
    if (title) {
        self._paq.push(['setDocumentTitle', title]);
    }

    self._paq.push(['trackPageView']);
    self._paq.push(['enableLinkTracking']);
}

export function setUserID(login: string): void {
    self._paq.push(['setUserId', login]);
}

export function resetUserID(): void {
    self._paq.push(['resetUserId']);
}
