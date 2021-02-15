const roundDecimal = (division) => {
    return Math.round((division + Number.EPSILON) * 100) / 100;
};

const shorten = (str, maxLen, separator = ' ', source) => {
    const link = `... <a class="underline" href=${source} target="_blank" rel="noreferrer">Read more</a>`;
    if (str.length <= maxLen) return str;
    let shortened_string = str.substr(0, str.lastIndexOf(separator, maxLen));
    let unclosed_tag = find_unclosed_tags(shortened_string);

    if (unclosed_tag) {
        shortened_string += unclosed_tag;
    }
    return shortened_string + link;
};

function find_unclosed_tags(str) {
    str = str.toLowerCase();
    var tags = [
        'a',
        'span',
        'div',
        'ul',
        'li',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'table',
        'tr',
        'td',
        'b',
        'i',
        'u',
    ];
    let mismatch = '';
    tags.forEach(function (tag) {
        var pattern_open = '<' + tag + '( |>)';
        var pattern_close = '</' + tag + '>';

        var diff_count =
            (str.match(new RegExp(pattern_open, 'g')) || []).length -
            (str.match(new RegExp(pattern_close, 'g')) || []).length;

        if (diff_count !== 0) {
            mismatch = '</' + tag + '>';
        }
    });

    return mismatch;
}

export default roundDecimal;
export { shorten };
