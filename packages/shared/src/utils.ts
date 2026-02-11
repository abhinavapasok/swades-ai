/**
 * Format a number as currency
 */
export function formatCurrency(
    amount: number | string,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(numericAmount)) return String(amount);

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(numericAmount);
}

/**
 * Format a date
 */
export function formatDate(date: Date | string | number): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
