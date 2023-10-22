export function useDocumentTitle(title: string): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (document) {
        document.title = title;
        const el = document.querySelector('title');
        if (el) {
            el.innerText = title;
        } else {
            const newTitle = document.createElement('title');
            newTitle.innerText = title;
            document.head.appendChild(newTitle);
        }
    }

    return title;
}
