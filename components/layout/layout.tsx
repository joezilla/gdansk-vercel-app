import Footer from '../footer'
import Meta from './meta'
import Navi from '../navigation'
import Script from 'next/script'
import { IPost } from '../../lib/contentmodel/wrappertypes';
import React from 'react'


type LayoutProps = {
  children: React.ReactNode,
  preview?: boolean
  navigationPosts: IPost[],
  locale: string
}

export function Layout(props: LayoutProps) {
  const [darkMode] = React.useState(false);
  return (
    <>
      <Meta locale={props.locale}/>
      <div className="flex flex-col h-full dark:bg-mybg-dark h-screen dark:text-mytxt-dark">
        <Navi navigationPosts={props.navigationPosts} locale={props.locale} />
        <main className="py-0">{props.children}</main>
        <Footer locale={props.locale}/>
      </div>
    </>
  )
}
