declare module 'vue-split-panel' {
    export function install(Vue: any, ...args: any[]): void

export namespace Split {
    const mixins: {
        methods: {
            broadcast: any
            dispatch: any
        }
    }[]

    const name: string

    const props: {
        direction: {
            default: string
            type: any
        }
        gutterSize: {
            default: number
            type: any
        }
    }

    const staticRenderFns: any[]

    function data(): any

    function mounted(): void

    function render(): any

    namespace SplitArea {
        const mixins: {
            methods: {
                broadcast: any
                dispatch: any
            }
        }[]

        const name: string

        const props: {
            minSize: {
                default: number
                type: any
            }
            size: {
                default: number
                type: any
            }
        }

        const staticRenderFns: any[]

        function render(): any

        namespace computed {
            function classes(): any

        }

        namespace watch {
            function minSize(val: any): void

            function size(val: any): void

        }

    }

    namespace methods {
        function changeAreaSize(): void

        function getSizes(): any

        function init(): void

        function reset(): void

    }

    namespace watch {
        function direction(val: any): void

        function gutterSize(val: any): void

    }

}

export namespace SplitArea {
    const mixins: {
        methods: {
            broadcast: any
            dispatch: any
        }
    }[]

    const name: string

    const props: {
        minSize: {
            default: number
            type: any
        }
        size: {
            default: number
            type: any
        }
    }

    const staticRenderFns: any[]

    function render(): any

    namespace computed {
        function classes(): any

    }

    namespace watch {
        function minSize(val: any): void

        function size(val: any): void

    }

}

}
