declare module 'vue-content-loader' {
    import { VueConstructor } from 'vue'

    export interface ContentLoaderProps {
        width: number
        height: number
        speed: number
        preserveAspectRatio: string
        primaryColor: string
        secondaryColor: string
        uniqueKey: string
        animate: boolean
    }

    export interface ContentLoaderConstructor extends VueConstructor {
        props: ContentLoaderProps
    }

    type FacebookLoaderConstructor = ContentLoaderConstructor
    type BulletListLoaderConstructor = ContentLoaderConstructor
    type CodeLoaderConstructor = ContentLoaderConstructor
    type InstagramLoaderConstructor = ContentLoaderConstructor
    type ListLoaderConstructor = ContentLoaderConstructor

    export const ContentLoader: ContentLoaderConstructor
    export const FacebookLoader: FacebookLoaderConstructor
    export const BulletListLoader: BulletListLoaderConstructor
    export const InstagramLoader: InstagramLoaderConstructor
    export const CodeLoader: CodeLoaderConstructor
    export const ListLoader: ListLoaderConstructor

    // export interface FacebookLoaderConstructor
    //     extends ContentLoaderConstructor {}
    // export interface CodeLoaderConstructor extends ContentLoaderConstructor {}
    // export interface BulletListLoaderConstructor
    //     extends ContentLoaderConstructor {}
    // export interface InstagramLoaderConstructor
    //     extends ContentLoaderConstructor {}
    // export interface ListLoaderConstructor extends ContentLoaderConstructor {}
}
