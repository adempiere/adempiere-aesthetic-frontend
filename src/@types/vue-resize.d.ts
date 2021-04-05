declare module 'vue-resize' {
    export function install(Vue: any): void

    export namespace ResizeObserver {
    const name: string

    const staticRenderFns: any[]

    function beforeDestroy(): void

    function mounted(): void

    function render(): any

    namespace methods {
        function addResizeHandlers(): void

        function compareAndNotify(): void

        function removeResizeHandlers(): void

    }

}
}
