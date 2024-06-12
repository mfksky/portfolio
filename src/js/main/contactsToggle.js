export function toggleContacts(btnSelector, contentSelector) {
    const callBtn = document.querySelector(btnSelector);
    const callContent = document.querySelector(contentSelector);

    callBtn.addEventListener('click', () => {
        callBtn.classList.toggle('_active');
        callContent.classList.toggle('_active');
    });

    document.addEventListener('click', (event) => {
        const isClickInside = callBtn.contains(event.target) || callContent.contains(event.target);
        if (!isClickInside) {
            callBtn.classList.remove('_active');
            callContent.classList.remove('_active');
        }
    });
}