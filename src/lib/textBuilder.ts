// text builder utility, used for handling conditional text in 
// descriptions and other text blurbs
export const _tb = function(text: Array<string | { text: string, isVisible: Function }>) {
    const output = new Array<string>;
    for (const i in text) {
        if (typeof(text[i]) === "string") output.push(text[i]);
        else {
            if ((text[i] as {text: string, isVisible: Function}).isVisible()) {
                output.push((text[i] as {text: string, isVisible: Function}).text);
            }
        }
    }
    return output;
}