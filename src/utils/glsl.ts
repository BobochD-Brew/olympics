export const glsl = (strings: TemplateStringsArray, ...values: any[]) => {
    return (values.map((v, i) => `${strings[i]}${v}`).join("") + strings[strings.length - 1]);
}

export const named = (name: string) => ({
    glsl: (_strings: TemplateStringsArray, ..._values: any[]) => {
        const _glsl = glsl(_strings, ..._values);
        return {
            glsl: _glsl,
            func: name,
        }
    }
})